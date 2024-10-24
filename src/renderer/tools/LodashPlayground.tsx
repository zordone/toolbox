import _ from "lodash";
import React, { FC } from "react";
import Playground from "../templates/Playground";
import { registerTool, ToolProps } from "../toolStore";
import { reindent } from "../utils";

const initialCode = reindent(`
  const contacts = [
    { id: 1, name: "Bob", email: "bob@bob.com" },
    { id: 2, name: "Jane", email: "jane@jane.com" },
    { id: 3, name: "Alice", email: "alice@alice.com" }
  ];

  const result = _.find(contacts, { id: 2 });
`);

const initialWatchExprs = ["contacts", "result"];

const extraContext = { _ };

const LodashPlayground: FC<ToolProps> = (props) => {
  return (
    <Playground
      extraContext={extraContext}
      initialCode={initialCode}
      initialWatchExprs={initialWatchExprs}
      label="Edit your lodash code"
      toolComp={LodashPlayground}
      {...props}
    />
  );
};

registerTool({
  component: LodashPlayground,
  name: "LodashPlayground",
  description: "JavaScript playground with Lodash.",
});

export default LodashPlayground;
