import "./basic.min.css";
import Tests from "./components/Tests";
import { useState } from "preact/hooks";

import "./style";

export default function App() {
  const [processing, setProcessing] = useState(false);
  const [options, setOptions] = useState({});

  const runTests = async () => {
    setProcessing(true);

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
    setProcessing(false);
    location.reload();
  };

  const setRunOptions = (e) => {
    const { name, value } = e.target;
    setOptions((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div>
      <div
        class={`LHresults-spinner js-testSpinner ${
          processing ? "is-spinning" : ""
        }`}
      >
        <div class="gauge-loader">Loading&#8230;</div>
      </div>
      <h1>Local Lighthouse</h1>
      <div>
        <h2>New test</h2>
        <div>
          <input
            class="js-testUrl"
            type="text"
            name="url"
            placeholder="URL"
            onChange={setRunOptions}
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
          <button class="js-testTrigger" onClick={runTests}>
            Run Lighthouse
          </button>
        </div>
      </div>

      <Tests />
    </div>
  );
}
