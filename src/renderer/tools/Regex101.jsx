import React from "react";
import Website from "../components/Website";
import { setToolMeta } from "../utils";

const Regex101 = () => (
  <Website url="https://regex101.com/" title="regex101" invert={false} />
);

setToolMeta(Regex101, {
  name: "Regex101",
  description: "Regular expression tester website.",
});

export default Regex101;
