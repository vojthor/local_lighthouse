import { useEffect, useState } from "preact/hooks";

export default function Tests() {
  const [compare, setCompare] = useState([]);
  const [stored, setStored] = useState([]);
  const [testContent, setTestContent] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      let url = "http://localhost:3030/tests";
      const response = await fetch(url);
      const data = await response.json();
      console.log(data.folders);
      setStored(data.folders);
    };
    fetchTests();
  }, []);

  // Fetch tests detail
  const fetchTestData = async (folderName, el) => {
    const data = await fetch(
      `http://localhost:3030/tests/detail/${folderName}`
    );

    const LH_VALUES = [];
    const LH_TTI_VALUES = [];
    const LH_SPEED_INDEX_VALUES = [];
    const LH_FCP_VALUES = [];
    const LH_LCP_VALUES = [];
    const LH_TBT_VALUES = [];
    const LH_CLS_VALUES = [];

    const { results, errors } = await data.json();

    JSON.parse(results).forEach((result) => {
      const {
        LH_SCORE,
        LH_CLS,
        LH_FCP,
        LH_LCP,
        LH_SPEED_INDEX,
        LH_TBT,
        LH_TTI,
      } = result;

      LH_VALUES.push(parseFloat(LH_SCORE));
      LH_TTI_VALUES.push(parseFloat(LH_TTI));
      LH_SPEED_INDEX_VALUES.push(parseFloat(LH_SPEED_INDEX));
      LH_FCP_VALUES.push(parseFloat(LH_FCP));
      LH_LCP_VALUES.push(parseFloat(LH_LCP));
      LH_TBT_VALUES.push(parseFloat(LH_TBT));
      LH_CLS_VALUES.push(parseFloat(LH_CLS));
    });

    const LH_VALUES_FINAL = {
      LH: LH_VALUES,
      LH_TTI: LH_TTI_VALUES,
      LH_SPEED_INDEX: LH_SPEED_INDEX_VALUES,
      LH_FCP: LH_FCP_VALUES,
      LH_LCP: LH_LCP_VALUES,
      LH_TBT: LH_TBT_VALUES,
      LH_CLS: LH_CLS_VALUES,
    };

    const elements = [];
    for (const [key, values] of Object.entries(LH_VALUES_FINAL)) {
      console.log(values);
      const el = (
        <div>
          <h3>{key}</h3>
          {values.map((value, i) => (
            <div key={i} class="LHresults-gridItem">
              {value}
            </div>
          ))}
          <div class="LHresults-gridItem LHresults-gridItem--median">
            <b>{median(values).toFixed(2)}</b>
          </div>
        </div>
      );

      elements.push(el);
    }

    setTestContent(elements);
  };

  return (
    <div>
      <h2>Stored tests</h2>
      <div>
        <select
          class="js-tests"
          name="Tests"
          id="cars"
          onChange={(e) => {
            if (e.target.value !== "default") {
              fetchTestData(e.target.value);
            }
          }}
        >
          <option value="default">Select test</option>
          {stored.map((storedTest) => (
            <option value={storedTest}>
              {new Date(storedTest.split("|")[0]).toLocaleDateString()}
              {new Date(storedTest.split("|")[0]).toLocaleTimeString()}
              {storedTest.split("|")[1]}
            </option>
          ))}
        </select>
      </div>
      <div class="LHresults-grid">{testContent.map((content) => content)}</div>
    </div>
  );
}

// Count median
const median = (numbers) => {
  const mid = Math.floor(numbers.length / 2),
    nums = [...numbers].sort((a, b) => a - b);

  return numbers.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};
