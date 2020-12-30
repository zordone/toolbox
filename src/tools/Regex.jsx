import React from "react";
import Website from "../components/Website";
import { setToolMeta } from "../utils";

const Regex = () => (
  <Website url="https://regex101.com/" title="regex101" invert={false} />
);

setToolMeta(Regex, {
  name: "Regex",
  description: "Regular expression tester website.",
});

export default Regex;
