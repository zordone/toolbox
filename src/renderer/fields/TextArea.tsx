import React, { ComponentProps, FC } from "react";
import BasicField from "./BasicField";

const TextArea: FC<ComponentProps<typeof BasicField>> = (props) => (
  <BasicField {...props} as="textarea" />
);

export default TextArea;
