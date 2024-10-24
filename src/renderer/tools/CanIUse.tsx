import React, { FC } from "react";
import Website from "../templates/Website";
import { registerTool, ToolProps } from "../toolStore";

const CanIUse: FC<ToolProps> = () => (
  <Website url="https://caniuse.com/" title="caniuse" invert={false} />
);

registerTool({
  component: CanIUse,
  name: "CanIUse",
  description: "Browser support tables website.",
});

export default CanIUse;
