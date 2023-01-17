import FormattedTestString from "./FormattedTestString";

const TestsSelect = ({ stored, onChangeFn, selectRef }) => (
  <select name="Tests" onChange={onChangeFn} ref={selectRef}>
    <option value="default">Select test</option>
    {stored.map((storedTest) => (
      <option value={storedTest}>
        <FormattedTestString testString={storedTest} />
      </option>
    ))}
  </select>
);

export default TestsSelect;
