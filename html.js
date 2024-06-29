import fs from "fs/promises";

const main = async () => {
  var txt = await fs.readFile(process.argv[2]);
  var sections = txt
    .toString()
    .split("\n")
    .map((r) => {
      var parts = r.split(":");
      var file = parts[0];
      var match = parts[1];
      var id = file.split("/")[1];
      var pdf = file.split("zips/" + id + "/")[1];
      console.log(`<h3>Today's rare plant mentions in CEQA documents</h3>
      <ul>
       <LI><a href="https://ceqanet.opr.ca.gov/${id}">${pdf} - <b>${match}</b></a></LI>
       </ul>`);
    });
};

main().catch((err) => {
  console.error(err);
  process.exit(1); // Retry Job Task by exiting the process
});
