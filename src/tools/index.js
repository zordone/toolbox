import React from "react";
import AspectRatio from "./AspectRatio";
import Base64 from "./Base64";
import Help from "./Help";
import KimbleCalculator from "./KimbleCalculator";
import MomentPlayground from "./MomentPlayground";
import PasswordGenerator from "./PasswordGenerator";
import Uuid from "./Uuid";
import LodashPlayground from "./LodashPlayground";
import WordCounter from "./WordCounter";

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
    component: () => <Help tools={tools} />,
  },
  KimbleCalculator: {
    name: "KimbleCalculator",
    description: "Kimble time log calculator.",
    component: KimbleCalculator,
  },
  LodashPlayground: {
    name: "LodashPlayground",
    description: "Lodash playground.",
    component: LodashPlayground,
  },
  MomentPlayground: {
    name: "MomentPlayground",
    description: "Moment.js playground.",
    component: MomentPlayground,
  },
  PasswordGenerator: {
    name: "PasswordGenerator",
    description: "Random password generator.",
    component: PasswordGenerator,
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
