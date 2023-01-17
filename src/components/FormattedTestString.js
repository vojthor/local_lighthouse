const FormattedTestString = ({ testString }) => {
  if (!testString) {
    return null;
  }

  const stringParts = testString.split("|");
  return (
    <span>
      {`${stringParts[1]} `}
      {`(${new Date(stringParts[0]).toLocaleDateString()} ${new Date(
        stringParts[0]
      ).toLocaleTimeString()})`}
    </span>
  );
};

export default FormattedTestString;
