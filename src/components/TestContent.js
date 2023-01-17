import { median } from "../helpers/calc";

const TestContent = ({ lhValues }) => {
  const elements = [];
  for (const [key, values] of Object.entries(lhValues)) {
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
  return elements;
};

export default TestContent;
