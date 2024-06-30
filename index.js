import neatCsv from "neat-csv";
import extract from "extract-zip";
import * as path from "path";
import { mkdirp } from "mkdirp";
import { writeFile } from "node:fs/promises";
import { Readable } from "node:stream";

// Retrieve Job-defined env vars
const { CLOUD_RUN_TASK_INDEX = 0, CLOUD_RUN_TASK_ATTEMPT = 0 } = process.env;

// Define main script
const main = async () => {
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
    .toLocaleString("sv", { timeZoneName: "short" })
    .split(" ")[0];

  const response = await fetch(
    `https://ceqanet.opr.ca.gov/Search?StartRange=${yesterday}&EndRange=${yesterday}&DocumentType=MND%20-%20Mitigated%20Negative%20Declaration&OutputFormat=CSV`
  );

  const response2 = await fetch(
    `https://ceqanet.opr.ca.gov/Search?StartRange=${yesterday}&EndRange=${yesterday}&DocumentType=NOP%20-%20Notice%20of%20Preparation%20of%20a%20Draft%20EIR&OutputFormat=CSV`
  );

  // Convert the response into text
  const body = await response.text();
  const mnds = await neatCsv(body);

  const body2 = await response2.text();
  const nops = await neatCsv(body2);

  var outdir = path.resolve(process.cwd() + "/zips");
  await mkdirp(outdir);

  var matches = mnds.concat(nops);
  console.log(matches);

  for (const match of matches) {
    var id = match["SCH Number"];
    var zip = match["Document Portal URL"] + "/AttachmentZip";
    const response = await fetch(zip);
    const body = Readable.fromWeb(response.body);
    var zipfile = outdir + "/" + id + ".zip";
    await writeFile(zipfile, body);
    await extract(zipfile, {
      dir: outdir + "/" + id,
    });
    await sleep(100);
  }
};

// Wait for a specific amount of time
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Start script
main().catch((err) => {
  console.error(err);
  process.exit(1); // Retry Job Task by exiting the process
});
