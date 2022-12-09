const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3030;

app.use(express.static(__dirname));
app.use(express.json());

// Make sure folder exist
!fs.existsSync("./results/") && fs.mkdirSync("./results/");

app.get("/", (req, res) => {
  const testFolder = "./results/";

  const folders = [];
  fs.readdirSync(testFolder).forEach((file) => {
    folders.push[file];
  });
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/tests", (req, res) => {
  const testFolder = "./results/";

  const folders = [];
  fs.readdirSync(testFolder).forEach((file) => {
    folders.push(file);
  });

  res.json({ title: "api", folders });
});

app.get("/tests/detail/:folderName", function (req, res) {
  try {
    const results = fs.readFileSync(
      `./results/${req.params.folderName}/results.txt`,
      "utf8"
    );
    // const errors = fs.readFileSync(
    //   `./results/${req.params.folderName}/errors.txt`,
    //   "utf8"
    // );
    res.json({ results, errors: [] });
  } catch (err) {
    console.error(err);
  }
});

app.post("/run", async (req, res) => {
  const runTests = require("./tests");

  const url = req.body.url;
  const runs = req.body.runs;
  const label = req.body.label;
  const tests = await runTests(url, runs, label);
  res.json({ done: true });
});

app.listen(port, () => {
  console.log(`Lighthouse app running on http://localhost:${port}`);
});
