import "./basic.min.css";
import "./style";
import Tests from "./components/Tests";
import { useState } from "preact/hooks";

import NewTest from "./components/NewTest";

const App = () => {
  const [processing, setProcessing] = useState(false);

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
      <NewTest setProcessing={setProcessing} />
      <Tests />
    </div>
  );
};

export default App;
