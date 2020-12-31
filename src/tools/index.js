import React from "react";
import AspectRatio from "./AspectRatio";
import Base64 from "./Base64";
import CanIUse from "./CanIUse";
import Help from "./Help";
import JsonFormatter from "./JsonFormatter";
import KimbleCalculator from "./KimbleCalculator";
import LodashPlayground from "./LodashPlayground";
import MomentPlayground from "./MomentPlayground";
import PasswordGenerator from "./PasswordGenerator";
import Regex from "./Regex";
import Unindent from "./Unindent";
import Uuid from "./Uuid";
import WordCounter from "./WordCounter";

const allTools = [
  AspectRatio,
  Base64,
  CanIUse,
  Help,
  JsonFormatter,
  KimbleCalculator,
  LodashPlayground,
  MomentPlayground,
  PasswordGenerator,
  Regex,
  Unindent,
  Uuid,
  WordCounter,
];

// compile tools info object
//   {
//     AspectRatio: {
//       name: "AspectRatio",
//       description: "Aspect ratio calculator.",
//       component: AspectRatio,
//     },
//     ...
//   }
const tools = Object.fromEntries(
  allTools.map((toolComp) => [
    toolComp.meta.name,
    {
      ...toolComp.meta,
      component: toolComp,
    },
  ])
);

// help needs the tools as an extra prop
tools.Help.component = (props) => <Help tools={tools} {...props} />;

export default tools;
