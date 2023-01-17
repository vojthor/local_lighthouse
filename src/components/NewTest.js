import { useState } from "preact/hooks";
import { startTests } from "../helpers/fetch";

const NewTest = ({ setProcessing }) => {
  const [options, setOptions] = useState({ url: `https://` });

  const setRunOptions = (e) => {
    const { name, value } = e.target;
    setOptions((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div>
      <h2>New test</h2>
      <div class="NewTestInputs">
        <input
          value={options.url}
          class="js-testUrl"
          name="url"
          onChange={setRunOptions}
          type="url"
          placeholder="https://pond5.com"
          pattern="https://.*"
          size="30"
        />
        <input
          class="js-testRuns"
          type="number"
          name="runs"
          placeholder="Number of runs"
          onChange={setRunOptions}
        />
        <input
          class="js-testLabel"
          type="label"
          name="label"
          placeholder="Label"
          onChange={setRunOptions}
        />
        <button
          class="js-testTrigger"
          onClick={() => {
            startTests(options, setProcessing);
          }}
        >
          Run Lighthouse
        </button>
      </div>
    </div>
  );
};

export default NewTest;
