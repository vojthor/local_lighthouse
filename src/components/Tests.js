import { Fragment } from "preact";
import { useEffect, useState, useRef } from "preact/hooks";
import { median } from "../helpers/calc";
import { fetchTestData } from "../helpers/fetch";
import FormattedTestString from "./FormattedTestString";
import TestContent from "./TestContent";
import TestsSelect from "./TestSelect";

const LH_KEY = "LH";

export default function Tests() {
  const [compare, setCompare] = useState(false);
  const [stored, setStored] = useState([]);
  const [testContent, setTestContent] = useState({});
  const [compareTestContent, setCompareTestContent] = useState({});

  // Refs
  const primaryTest = useRef(null);
  const comparedTest = useRef(null);

  useEffect(() => {
    const fetchTests = async () => {
      let url = "http://localhost:3030/tests";
      const response = await fetch(url);
      const data = await response.json();
      setStored(data.folders);
    };
    fetchTests();
  }, []);

  // TODO refactor
  const compared = () => {
    const elements = [];
    const UP_ARROW = <icon>⬆</icon>;
    const DOWN_ARROW = <icon>⬇</icon>;

    if (compareTestContent.length === 0) {
      return [];
    }

    const hasDifferentLength = testContent.length !== compareTestContent.length;

    const compareValue = (value1, value2, key) => {
      // Everything expect LH - the lower the better
      if (key === LH_KEY) {
        return value2 > value1;
      } else {
        return value1 > value2;
      }
    };

    // Test is the same, iterate over it and compare
    if (!hasDifferentLength) {
      for (const [key, values] of Object.entries(testContent)) {
        const MEDIAN_BASE = median(values).toFixed(2);
        const MEDIAN_COMPARING = median(compareTestContent[key]).toFixed(2);
        const MEDIAN_IS_HIGHER = compareValue(
          MEDIAN_COMPARING,
          MEDIAN_BASE,
          key
        );

        const MEDIAN_IS_LOWER = compareValue(
          MEDIAN_BASE,
          MEDIAN_COMPARING,
          key
        );

        const el = (
          <div>
            <h3>{key}</h3>
            {values.map((value, i) => {
              const IS_HIGHER = compareValue(
                compareTestContent[key][i],
                value,
                key
              );
              const IS_LOWER = compareValue(
                value,
                compareTestContent[key][i],
                key
              );

              return (
                <div
                  key={i}
                  class={`LHresults-gridItem LHresults-gridItem--${
                    IS_HIGHER ? "higher" : IS_LOWER ? "lower" : ""
                  }`}
                >
                  {compareTestContent[key][i]}
                  {IS_HIGHER && (key === LH_KEY ? DOWN_ARROW : UP_ARROW)}
                  {IS_LOWER && (key === LH_KEY ? UP_ARROW : DOWN_ARROW)}
                </div>
              );
            })}
            <div
              class={`LHresults-gridItem LHresults-gridItem--median LHresults-median--${
                MEDIAN_IS_HIGHER ? "higher" : MEDIAN_IS_LOWER ? "lower" : ""
              }`}
            >
              <b>
                {MEDIAN_COMPARING}
                {MEDIAN_IS_HIGHER && (key === LH_KEY ? DOWN_ARROW : UP_ARROW)}
                {MEDIAN_IS_LOWER && (key === LH_KEY ? UP_ARROW : DOWN_ARROW)}
              </b>
            </div>
          </div>
        );

        elements.push(el);
      }
    }

    return elements;
  };

  return (
    <div>
      <h2>Stored tests</h2>
      <div class="TestSelect">
        <TestsSelect
          stored={stored}
          selectRef={primaryTest}
          onChangeFn={(e) => {
            if (e.target.value !== "default") {
              fetchTestData(e.target.value, setTestContent);
            }
          }}
        />
        <div class="CompareToggle">
          <input
            type="checkbox"
            name="compare"
            value="Compare"
            checked={compare}
            onChange={() => setCompare(!compare)}
          />
          <label for="compare">Compare</label>
        </div>
        {compare && (
          <TestsSelect
            stored={stored}
            selectRef={comparedTest}
            onChangeFn={(e) => {
              if (e.target.value !== "default") {
                fetchTestData(e.target.value, setCompareTestContent);
              }
            }}
          />
        )}
      </div>
      <div class="LHresults-grid">
        <TestContent lhValues={testContent} />
      </div>
      <div>
        {Object.values(compareTestContent).length > 0 && (
          <Fragment>
            <h2>
              Comparing{" "}
              <b>
                <FormattedTestString testString={primaryTest?.current?.value} />
              </b>
              {` and `}
              <b>
                <FormattedTestString
                  testString={comparedTest?.current?.value}
                />
              </b>
            </h2>
            <div class="LHresults-grid">
              {compared().map((content) => content)}
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
}
