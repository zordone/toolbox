import React from "react";
import AspectRatio from "./AspectRatio";
import Base64 from "./Base64";
import Help from "./Help";
import JsonFormatter from "./JsonFormatter";
import KimbleCalculator from "./KimbleCalculator";
import MomentPlayground from "./MomentPlayground";
import PasswordGenerator from "./PasswordGenerator";
import Regex from "./Regex";
import Uuid from "./Uuid";
import LodashPlayground from "./LodashPlayground";
import WordCounter from "./WordCounter";
import Unindent from "./Unindent";

const tools = {
  AspectRatio: {
    name: "AspectRatio",
    description: "Aspect ratio calculator.",
    component: AspectRatio,
  },
  Base64: {
    name: "Base64",
    description: "Base64 encoder and decoder.",
    component: Base64,
  },
  Help: {
    name: "Help",
    description: "Instructions and the list of all the tools.",
    component: (props) => <Help tools={tools} {...props} />,
  },
  JsonFormatter: {
    name: "JsonFormatter",
    description: "JSON formatter and editor.",
    component: JsonFormatter,
  },
  KimbleCalculator: {
    name: "KimbleCalculator",
    description: "Kimble time log calculator.",
    component: KimbleCalculator,
  },
  LodashPlayground: {
    name: "LodashPlayground",
    description: "JavaScript playground with Lodash.",
    component: LodashPlayground,
  },
  MomentPlayground: {
    name: "MomentPlayground",
    description: "JavaScript playground with Moment.js.",
    component: MomentPlayground,
  },
  PasswordGenerator: {
    name: "PasswordGenerator",
    description: "Random password generator.",
    component: PasswordGenerator,
  },
  Regex: {
    name: "Regex",
    description: "Regular expression tester website.",
    component: Regex,
  },
  Unindent: {
    name: "Unindent",
    description: "Unindent JavaScript code or other indented text.",
    component: Unindent,
  },
  Uuid: {
    name: "Uuid",
    description: "UUID generator.",
    component: Uuid,
  },
  WordCounter: {
    name: "WordCounter",
    description: "Word, line, and character counter.",
    component: WordCounter,
  },
};

export default tools;
