import { median } from "../helpers/calc";

const LH_KEY = "LH";
const UP_ARROW = <icon>⬆</icon>;
const DOWN_ARROW = <icon>⬇</icon>;

const compareValue = (value1, value2, key) => {
  // Everything expect LH - the lower the better
  if (key === LH_KEY) {
    return value2 > value1;
  } else {
    return value1 > value2;
  }
};

const CompareContent = ({ metricKey, values, compareTestContent }) => {
  const isLHScore = metricKey === LH_KEY;
  const toCompare = compareTestContent[metricKey];

  const MEDIAN_BASE = median(values).toFixed(2);
  const MEDIAN_COMPARING = median(toCompare).toFixed(2);
  const MEDIAN_IS_HIGHER = compareValue(
    MEDIAN_COMPARING,
    MEDIAN_BASE,
    metricKey
  );

  const MEDIAN_IS_LOWER = compareValue(
    MEDIAN_BASE,
    MEDIAN_COMPARING,
    metricKey
  );

  return (
    <div>
      <h3>{metricKey}</h3>
      {values.map((value, i) => {
        const IS_HIGHER = compareValue(toCompare[i], value, metricKey);
        const IS_LOWER = compareValue(value, toCompare[i], metricKey);

        // If we comparing test with fewer runs, just discard the additional rows
        if (toCompare[i] === undefined) {
          return null;
        }

        return (
          <div
            key={i}
            class={`LHresults-gridItem LHresults-gridItem--${
              IS_HIGHER ? "higher" : IS_LOWER ? "lower" : ""
            }`}
          >
            {toCompare[i]}
            {IS_HIGHER && (isLHScore ? DOWN_ARROW : UP_ARROW)}
            {IS_LOWER && (isLHScore ? UP_ARROW : DOWN_ARROW)}
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
          {MEDIAN_IS_HIGHER && (isLHScore ? DOWN_ARROW : UP_ARROW)}
          {MEDIAN_IS_LOWER && (isLHScore ? UP_ARROW : DOWN_ARROW)}
        </b>
      </div>
    </div>
  );
};

export default CompareContent;
