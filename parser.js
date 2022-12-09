fs = require("fs");

const parseResults = (date, runs) => {
  const stream = fs.createWriteStream(`./results/${date}/results.txt`, {
    flags: "a",
  });

  for (let i = 0; i < runs; i++) {
    const report = require(`./results/${date}/${i + 1}_result.json`);
    const LH_SCORE = `${report.categories.performance.score}`;
    const LH_TTI = report.audits.interactive.displayValue;
    const LH_SPEED_INDEX = report.audits["speed-index"].displayValue;
    const LH_FCP = report.audits["first-meaningful-paint"].displayValue;
    const LH_LCP = report.audits["largest-contentful-paint"].displayValue;
    const LH_TBT = report.audits["total-blocking-time"].displayValue;
    const LH_CLS = report.audits["cumulative-layout-shift"].displayValue;

    let metricsArray = [
      LH_SCORE,
      LH_TTI,
      LH_SPEED_INDEX,
      LH_FCP,
      LH_LCP,
      LH_TBT,
      LH_CLS,
    ];
    metricsArray = metricsArray.filter(Boolean);
    metricsArray = metricsArray.map((entry) => entry.replace("ms", "").trim());
    metricsArray = metricsArray.map((entry) => entry.replace("s", "").trim());
    // console.log(metricsArray);

    if (LH_TTI) {
      stream.write(`${metricsArray.join(",")}\n`);
    }
  }

  stream.end();
};

const parseErrors = (date, runs) => {
  const stream = fs.createWriteStream(`./results/${date}/errors.txt`, {
    flags: "a",
  });

  for (let i = 1; i < runs; i++) {
    const report = require(`./results/${date}/${i + 1}_result.json`);
    const ERRORS = report.audits["errors-in-console"];
    if (ERRORS.score === 0) {
      const errorString =
        ERRORS.details?.items.map(
          (error) => `${error.description} - ${error.url}`
        ) || ERRORS;
      stream.write(`${errorString}\n`);
    }
  }

  stream.end();
};

module.exports = [parseResults, parseErrors];
