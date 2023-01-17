import { Fragment } from "preact";
import { useEffect, useState, useRef } from "preact/hooks";
import { fetchTestData } from "../helpers/fetch";
import CompareContent from "./CompareContent";
import FormattedTestString from "./FormattedTestString";
import TestContent from "./TestContent";
import TestsSelect from "./TestSelect";

const Tests = () => {
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

    if (compareTestContent.length === 0) {
      return [];
    }

    for (const [key, values] of Object.entries(testContent)) {
      // Skip URL value
      if (key === "URL") {
        continue;
      }

      elements.push(
        <CompareContent
          metricKey={key}
          values={values}
          compareTestContent={compareTestContent}
        />
      );
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
            } else {
              setTestContent({});
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
          <label for="compare">Compare with </label>
        </div>
        {compare && (
          <TestsSelect
            stored={stored}
            selectRef={comparedTest}
            onChangeFn={(e) => {
              if (e.target.value !== "default") {
                fetchTestData(e.target.value, setCompareTestContent);
              } else {
                setCompareTestContent({});
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
            {testContent.URL !== compareTestContent.URL && (
              <div class="LHresults-warning">
                <div>
                  <div>
                    You comparing different URLs:{" "}
                    <a href={testContent.URL}>{testContent.URL}</a> and{" "}
                    <a href={compareTestContent.URL}>
                      {compareTestContent.URL}
                    </a>{" "}
                  </div>
                  <div>Make sure it make sense...</div>
                </div>
                <div>
                  <i>🤔</i>
                </div>
              </div>
            )}
            <div class="LHresults-grid">
              {compared().map((content) => content)}
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default Tests;
