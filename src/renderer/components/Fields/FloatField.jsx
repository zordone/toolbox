import React from "react";
import BasicField from "./BasicField";

const FloatField = (props) => (
  <BasicField
    {...props}
    type="number"
    onValidate={(text) => {
      const value = parseFloat(text, 10);
      const error = isNaN(value) ? "Not a valid float" : null;
      return { value, error };
    }}
  />
);

export default FloatField;
