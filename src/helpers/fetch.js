// Fetch tests detail
export const fetchTestData = async (folderName, setFn) => {
  const data = await fetch(`http://localhost:3030/tests/detail/${folderName}`);

  let URL = "";
  const LH_VALUES = [];
  const LH_TTI_VALUES = [];
  const LH_SPEED_INDEX_VALUES = [];
  const LH_FCP_VALUES = [];
  const LH_LCP_VALUES = [];
  const LH_TBT_VALUES = [];
  const LH_CLS_VALUES = [];

  const { results, errors } = await data.json();

  JSON.parse(results).forEach((result) => {
    const { LH_SCORE, LH_CLS, LH_FCP, LH_LCP, LH_SPEED_INDEX, LH_TBT, LH_TTI } =
      result;

    URL = result.URL;

    LH_VALUES.push(parseFloat(LH_SCORE));
    LH_TTI_VALUES.push(parseFloat(LH_TTI));
    LH_SPEED_INDEX_VALUES.push(parseFloat(LH_SPEED_INDEX));
    LH_FCP_VALUES.push(parseFloat(LH_FCP));
    LH_LCP_VALUES.push(parseFloat(LH_LCP));
    LH_TBT_VALUES.push(parseFloat(LH_TBT));
    LH_CLS_VALUES.push(parseFloat(LH_CLS));
  });

  const LH_VALUES_FINAL = {
    URL,
    LH: LH_VALUES,
    LH_TTI: LH_TTI_VALUES,
    LH_SPEED_INDEX: LH_SPEED_INDEX_VALUES,
    LH_FCP: LH_FCP_VALUES,
    LH_LCP: LH_LCP_VALUES,
    LH_TBT: LH_TBT_VALUES,
    LH_CLS: LH_CLS_VALUES,
  };

  // setFn(elements);
  setFn(LH_VALUES_FINAL);
};

export const startTests = async (options, setProcessingFn) => {
  setProcessingFn(true);

  if (!options.url) {
    return;
  }

  const data = await fetch(`http://localhost:3030/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });
  const parsedData = await data.json();
  setProcessingFn(false);
  location.reload();
};
