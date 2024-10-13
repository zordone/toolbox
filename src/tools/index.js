import React from "react";
import AspectRatio from "./AspectRatio";
import Base64 from "./Base64";
import CanIUse from "./CanIUse";
import Color from "./Color";
import Help from "./Help";
import JsonFormatter from "./JsonFormatter";
import JsonTransformer from "./JsonTransformer";
import KimbleCalculator from "./KimbleCalculator";
import LiquidTester from "./LiquidTester";
import LodashPlayground from "./LodashPlayground";
import LoremIpsum from "./LoremIpsum";
import MomentPlayground from "./MomentPlayground";
import PasswordGenerator from "./PasswordGenerator";
import Regex from "./Regex";
import Regex101 from "./Regex101";
import Unindent from "./Unindent";
import Uuid from "./Uuid";
import WordCounter from "./WordCounter";

const allTools = [
  AspectRatio,
  Base64,
  CanIUse,
  Color,
  Help,
  JsonFormatter,
  JsonTransformer,
  KimbleCalculator,
  LiquidTester,
  LodashPlayground,
  LoremIpsum,
  MomentPlayground,
  PasswordGenerator,
  // disabled for now, because Regex101 is working again.
  // Regex,
  Regex101,
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
//       settings: [...],
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
