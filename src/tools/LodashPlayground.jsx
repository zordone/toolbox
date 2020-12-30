import React from "react";
import _ from "lodash";
import { reindent, setToolMeta } from "../utils";
import Playground from "../components/Playground";

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

const LodashPlayground = (props) => {
  return (
    <Playground
      label="Edit your lodash code:"
      initialCode={initialCode}
      initialWatchExprs={initialWatchExprs}
      extraContext={extraContext}
      toolComp={LodashPlayground}
      {...props}
    />
  );
};

setToolMeta(LodashPlayground, {
  name: "LodashPlayground",
  description: "JavaScript playground with Lodash.",
});

export default LodashPlayground;
