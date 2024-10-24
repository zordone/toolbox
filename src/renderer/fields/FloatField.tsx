import React, { ComponentProps, FC } from "react";
import BasicField from "./BasicField";

const FloatField: FC<ComponentProps<typeof BasicField>> = (props) => (
  <BasicField
    {...props}
    type="number"
    onValidate={(text) => {
      const value = parseFloat(text);
      const error = isNaN(value) ? "Not a valid float" : null;
      return { value, error };
    }}
  />
);

export default FloatField;
