import React from "react";
import moment from "moment";
import "moment/locale/hu";
import { reindent } from "../utils";
import Playground from "../components/Playground";

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

const extraContext = { moment };

const MomentPlayground = (props) => {
  return (
    <Playground
      label="Edit your moment.js code:"
      initialCode={initialCode}
      initialWatchExprs={initialWatchExprs}
      extraContext={extraContext}
      toolComp={MomentPlayground}
      {...props}
    />
  );
};

export default MomentPlayground;
