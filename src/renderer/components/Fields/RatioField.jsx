import React from "react";
import BasicField from "./BasicField";

const RatioField = (props) => (
  <BasicField
    {...props}
    type="text"
    onValidate={(text) => {
      const match = text.match(/^(\d+):(\d+)$/);
      const value = match ? `${match[1]}:${match[2]}` : "";
      const error = !match ? "Should be in XXX:YYY format" : null;
      return { value, error };
    }}
  />
);

export default RatioField;
