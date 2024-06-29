// import * as cheerio from "cheerio";
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
    .toISOString()
    .split("T")[0];

  const response = await fetch(
    `https://ceqanet.opr.ca.gov/Search?StartRange=${yesterday}&EndRange=${yesterday}&DocumentType=MND%20-%20Mitigated%20Negative%20Declaration&OutputFormat=CSV`
  );

  // Convert the response into text
  const body = await response.text();
  const mnds = await neatCsv(body);
  var outdir = path.resolve(process.cwd() + "/zips");
  await mkdirp(outdir);

  for (const mnd of mnds) {
    var id = mnd["SCH Number"];
    var zip = mnd["Document Portal URL"] + "/AttachmentZip";
    const response = await fetch(zip);
    const body = Readable.fromWeb(response.body);
    var zipfile = id + ".zip";
    await writeFile(zipfile, body);
    await extract(zipfile, {
      dir: outdir + "/" + id,
    });
  }

  // Load the document using any of the methods described in the "Loading Documents" section.
  // const $ = cheerio.load(body);

  // Selecting Each col-12 class name and iterate through the list
  // $(".listing-items--wrapper > .row > .col-12").map((i, el) => {});
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
