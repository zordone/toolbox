import React, { FC } from "react";
import Website from "../templates/Website";
import { registerTool, ToolProps } from "../toolStore";

const Regex101: FC<ToolProps> = () => (
  <Website url="https://regex101.com/" title="regex101" invert={false} />
);

registerTool({
  component: Regex101,
  name: "Regex101",
  description: "Regular expression tester website.",
});

export default Regex101;
