import fs from "fs/promises";

const main = async () => {
  var txt = await fs.readFile(process.argv[2]);
  console.log("<h3>Today's rare plant mentions in CEQA documents</h3>");
  var ids = {};
  var sections = txt
    .toString()
    .trim()
    .split("\n")
    .map((r) => {
      var parts = r.split(":");
      var file = parts[0];
      var match = parts[1];
      var id = file.split("/")[1];
      var pdf = file.split("zips/" + id + "/")[1];
      if (!ids[id]) ids[id] = {};
      if (!ids[id][pdf]) ids[id][pdf] = [];
      ids[id][pdf].push(`
       <li><i>...${match}...</i></li>`);
    });
  for (var id in ids) {
    console.log(
      `<ul><li><a href="https://ceqanet.opr.ca.gov/${id}">SCH #${id}</a></li>`
    );
    for (var pdf in ids[id]) {
      console.log(
        `<ul><li><a href="https://ceqanet.opr.ca.gov/${id}">${pdf}</a></li>`
      );
      console.log("<ul><li>Mentions of rare plants in this PDF:</li>");
      console.log(ids[id][pdf].join("\n"));
      console.log("</ul></ul></ul>");
    }
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1); // Retry Job Task by exiting the process
});
