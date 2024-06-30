import neatCsv from "neat-csv";
import extract from "extract-zip";
import { mkdirp } from "mkdirp";
import moment from "moment";
import * as path from "path";
import { writeFile } from "node:fs/promises";
import { Readable } from "node:stream";

// Retrieve Job-defined env vars
const { CLOUD_RUN_TASK_INDEX = 0, CLOUD_RUN_TASK_ATTEMPT = 0 } = process.env;

// Define main script
const main = async () => {
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
    .toLocaleString("sv-SE", { timeZone: "America/Los_Angeles" })
    .split(" ")[0];

  var mndUrl = `https://ceqanet.opr.ca.gov/Search?StartRange=${yesterday}&EndRange=${yesterday}&DocumentType=MND%20-%20Mitigated%20Negative%20Declaration&OutputFormat=CSV`;
  var nopUrl = `https://ceqanet.opr.ca.gov/Search?StartRange=${yesterday}&EndRange=${yesterday}&DocumentType=NOP%20-%20Notice%20of%20Preparation%20of%20a%20Draft%20EIR&OutputFormat=CSV`;

  const response = await fetch(mndUrl);
  const response2 = await fetch(nopUrl);

  // Convert the response into text
  const body = await response.text();
  const mnds = await neatCsv(body);
  console.log(mndUrl, mnds.length);

  const body2 = await response2.text();
  const nops = await neatCsv(body2);
  console.log(nopUrl, nops.length);

  var outdir = path.resolve(process.cwd() + "/zips");
  await mkdirp(outdir);

  var matches = mnds.concat(nops);

  async function tryGetPDFs(match, delay = 5000, retries = 3) {
    const operation = async () => {
      var id = match["SCH Number"];
      var zip = match["Document Portal URL"] + "/AttachmentZip";
      console.log(zip);
      const response = await fetch(zip);
      const body = Readable.fromWeb(response.body);
      var zipfile = outdir + "/" + id + ".zip";
      await writeFile(zipfile, body);
      await extract(zipfile, {
        dir: outdir + "/" + id,
      });
    };
    const wrapped = retryOperation(operation, delay, retries);
    return await wrapped;
  }

  for (const match of matches) {
    await tryGetPDFs(match);
  }
};

// Wait for a specific amount of time
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Credits to @Bergi
const retryOperation = (operation, delay, retries) =>
  operation().catch((reason) =>
    retries > 0
      ? wait(delay).then(() => retryOperation(operation, delay, retries - 1))
      : Promise.reject(reason)
  );

// Start script
main().catch((err) => {
  console.error(err);
  process.exit(1); // Retry Job Task by exiting the process
});
