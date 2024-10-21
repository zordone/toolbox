import React from "react";
import Website from "../components/Website";
import { setToolMeta } from "../utils";

const CanIUse = () => (
  <Website url="https://caniuse.com/" title="caniuse" invert={false} />
);

setToolMeta(CanIUse, {
  name: "CanIUse",
  description: "Browser support tables website.",
});

export default CanIUse;
