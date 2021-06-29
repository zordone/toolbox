import BasicField from "./BasicField";

const IntegerField = (props) => (
  <BasicField
    {...props}
    type="number"
    onValidate={(text) => {
      const value = parseInt(text, 10);
      const error = isNaN(value) ? "Not a valid integer" : null;
      return { value, error };
    }}
  />
);

export default IntegerField;
