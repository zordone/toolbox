import React, { ComponentProps, FC } from "react";
import BasicField from "./BasicField";

const TextField: FC<ComponentProps<typeof BasicField>> = (props) => (
  <BasicField type="text" {...props} />
);

export default TextField;
