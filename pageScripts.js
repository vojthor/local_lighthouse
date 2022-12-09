const testSelect = document.querySelector(".js-tests");

testSelect.addEventListener("change", (e) => {
  const { value } = e.target;
  if (value !== "default") {
    fetchTestData(e.target.value);
  }
});

// Run new test
document
  .querySelector(".js-testTrigger")
  .addEventListener("click", async (e) => {
    const url = document.querySelector(".js-testUrl").value;
    const runs = document.querySelector(".js-testRuns").value;
    const label = document.querySelector(".js-testLabel").value;

    document.querySelector(".js-testSpinner").classList.add("is-spinning");

    const data = await fetch(`http://localhost:3030/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, runs, label }), // body data type must match "Content-Type" header
    });
    const parsedData = await data.json();
    location.reload();
  });

// Fetch tests
let url = "http://localhost:3030/tests";
fetch(url)
  .then((response) => response.json())
  .then((result) => {
    result.folders.forEach((folder) => {
      const date = new Date(folder.split("|")[0]);
      testSelect.insertAdjacentHTML(
        "beforeend",
        `<option value="${folder}">${date.toLocaleDateString()} ${date.toLocaleTimeString()} ${
          folder.split("|")[1]
        }</option>`
      );
    });
  })
  .catch((error) => console.log("error:", error));

// Fetch tests detail
const fetchTestData = async (folderName, el) => {
  const data = await fetch(`http://localhost:3030/tests/detail/${folderName}`);

  const LH = [];
  const LH_TTI = [];
  const LH_SPEED_INDEX = [];
  const LH_FCP = [];
  const LH_LCP = [];
  const LH_TBT = [];
  const LH_CLS = [];

  const { results, errors } = await data.json();
  const lines = results.split("\n");
  lines
    .filter((line) => line)
    .forEach((line) => {
      const values = line.split(",").filter((val) => val.length > 0);
      LH.push(parseFloat(values[0]));
      LH_TTI.push(parseFloat(values[1]));
      LH_SPEED_INDEX.push(parseFloat(values[2]));
      LH_FCP.push(parseFloat(values[3]));
      LH_LCP.push(parseFloat(values[4]));
      LH_TBT.push(parseFloat(values[5]));
      LH_CLS.push(parseFloat(values[6]));
    });

  const LH_VALUES = {
    LH,
    LH_TTI,
    LH_SPEED_INDEX,
    LH_FCP,
    LH_LCP,
    LH_TBT,
    LH_CLS,
  };

  const content = document.querySelector(".js-testContent");
  content.innerHTML = "";
  const wrapper = document.createElement("DIV");

  for (const [key, values] of Object.entries(LH_VALUES)) {
    const wrapper = document.createElement("DIV");
    wrapper.insertAdjacentHTML("beforeend", `<h3>${key}</h3>`);
    values.forEach((value, i) => {
      wrapper.insertAdjacentHTML(
        "beforeend",
        `<div class="LHresults-gridItem">${value}</div>`
      );
    });
    wrapper.insertAdjacentHTML(
      "beforeend",
      `<div class="LHresults-gridItem LHresults-gridItem--median"><b>${median(
        values
      ).toFixed(2)}</b></div>`
    );
    content.insertAdjacentElement("beforeend", wrapper);
  }
};

// Count median
const median = (numbers) => {
  const mid = Math.floor(numbers.length / 2),
    nums = [...numbers].sort((a, b) => a - b);

  return numbers.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};
