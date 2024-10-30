import React, { FC } from "react";
import Playground from "../templates/Playground";
import { registerTool, ToolProps } from "../toolStore";
import { reindent } from "../utils";

const initialCode = reindent(`
  const birth = moment("1981-06-16");
  const today = moment();
  const ageInDays = today.diff(birth, 'day');

  const multiDiff = (date1, date2) => {
    const temp = moment(date1);
    return ['years', 'months', 'days']
      .map(unit => {
        const value = date2.diff(temp, unit);
        temp.add(value, unit);
        return value ? \`\${value} \${unit}\` : null;
      })
      .filter(Boolean)
      .join(', ');
  }

  const ageMultiDiff = multiDiff(birth, today);
`);

const initialWatchExprs = [
  "birth.format('YYYY/MM/DD')",
  "today.format('YYYY/MM/DD')",
  "ageInDays",
  "ageMultiDiff",
];

const MomentPlayground: FC<ToolProps> = (props) => {
  return (
    <Playground
      initialCode={initialCode}
      initialWatchExprs={initialWatchExprs}
      label="Edit your moment.js code"
      toolComp={MomentPlayground}
      {...props}
    />
  );
};

registerTool({
  component: MomentPlayground,
  name: "MomentPlayground",
  description: "JavaScript playground with Moment.js.",
});
