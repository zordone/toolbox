import React from "react";
import { getAllTools } from "../toolStore";

// Help is special, see below
import Help from "./Help";

// import all tools to make them auto-register
import "./AsciiTable";
import "./AspectRatio";
import "./Base64";
import "./CanIUse";
import "./Color";
import "./HtmlEntities";
import "./JsonFormatter";
import "./JsonTransformer";
import "./KimbleCalculator";
import "./LiquidTester";
import "./LodashPlayground";
import "./LoremIpsum";
import "./MomentPlayground";
import "./PasswordGenerator";
import "./Regex101";
import "./SheetsToJson";
import "./Unindent";
import "./Uuid";
import "./WordCounter";

// now all tools are registered here
const tools = getAllTools();

// Help needs the tools as an extra prop
tools.Help.component = (props) => <Help tools={tools} {...props} />;

export default tools;
