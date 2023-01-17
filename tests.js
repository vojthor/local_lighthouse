#!/usr/bin/env node
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const fs = require("fs");

const runTests2 = (url, runLimit) =>
  new Promise((resolve, reject) => {
    const execSync = require("child_process").execSync;
    const [parseErrors, parseResults] = require("./parser");
    const time = new Date().toISOString();
    let runs = 0;

    const dir = `./results/${time}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    do {
      console.log(`Starting performance test ${runs + 1}`); // Logs this to the console just before it kicks off
      try {
        execSync(
          `lighthouse ${url} --headless --output json --output-path="./results/${time}/${
            runs + 1
          }_result.json" `
        ); // Executes this on the command line to run the performance test
      } catch (err) {
        console.log(`Performance test ${runs + 1} failed`); // If Lighthouse happens to fail it'll log this to the console and log the error message
        break;
      }
      console.log(`Finished running performance test ${runs + 1}`); // Logs this to the console just after it finishes running each performance test
      runs++;
    } while (runs < runLimit); // Keeps looping around until this condition is false

    parseResults(time, runLimit);
    parseErrors(time, runLimit);

    resolve(`All finished`);
  });

const runTests = (url, runs, label) => {
  const results = [];
  const errors = [];

  return new Promise(async (resolve, reject) => {
    for (i = 0; i < runs; i++) {
      const chrome = await chromeLauncher.launch({
        chromeFlags: ["--headless"],
      });
      const options = {
        logLevel: "info",
        output: "html",
        // onlyCategories: ["performance"],
        port: chrome.port,
      };
      const reportFull = await lighthouse(url, options);
      const report = reportFull.lhr;

      // Metrics
      const LH_SCORE = `${report.categories.performance.score}`;
      const LH_TTI = report.audits.interactive.displayValue;
      const LH_SPEED_INDEX = report.audits["speed-index"].displayValue;
      const LH_FCP = report.audits["first-meaningful-paint"].displayValue;
      const LH_LCP = report.audits["largest-contentful-paint"].displayValue;
      const LH_TBT = report.audits["total-blocking-time"].displayValue;
      const LH_CLS = report.audits["cumulative-layout-shift"].displayValue;

      let metricsArray = {
        URL: url,
        LH_SCORE,
        LH_TTI,
        LH_SPEED_INDEX,
        LH_FCP,
        LH_LCP,
        LH_TBT,
        LH_CLS,
      };

      // metricsArray = metricsArray.filter(Boolean);
      // metricsArray = metricsArray.map((entry) =>
      //   entry.replace("ms", "").trim()
      // );
      // metricsArray = metricsArray.map((entry) => entry.replace("s", "").trim());

      results.push(metricsArray);

      // Errors
      const ERRORS = report.audits["errors-in-console"];
      if (ERRORS.score === 0) {
        const errorString =
          ERRORS.details?.items.map(
            (error) => `${error.description} - ${error.url}`
          ) || ERRORS;
        errors.push(errorString);
      }

      await chrome.kill();
    }

    const date = new Date().toISOString();
    const dirName = `${date}|${label}`;
    const dir = `./results/${dirName}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    // Write results to file
    const stream = fs.createWriteStream(`./results/${dirName}/results.json`, {
      flags: "a",
    });

    stream.write(JSON.stringify(results));
    stream.end();

    // Write errors to file
    const streamError = fs.createWriteStream(
      `./results/${dirName}/errors.json`,
      {
        flags: "a",
      }
    );
    streamError.write(JSON.stringify(errors));
    streamError.end();

    resolve(`All finished`);
  });
};

module.exports = runTests;
