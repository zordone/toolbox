import React from "react";
import TextAnalyzer from "../components/TextAnalyzer";
import { reindent } from "../utils";

const initialText = reindent(`
  01:
  0.50 - OTT: something
  1.25 - ONE: other thing
`);

const KimbleCalculator = (props) => {
  const analyze = (text) => {
    const sum = (text.match(/^\d{1,2}\.\d{2}\b/gm) || [])
      .map(parseFloat)
      .filter(Boolean)
      .reduce((sum, item) => sum + item, 0);
    return [
      {
        title: "Total time logged",
        value: sum.toFixed(2),
        unit: "h in total,",
      },
      {
        title: "Hours left from the weekly 40h",
        value: (40 - sum).toFixed(2),
        unit: "h to go.",
      },
    ];
  };

  return (
    <TextAnalyzer
      label="Paste the Kimble time log here"
      name="kimble log"
      initialText={initialText}
      onUpdateResults={analyze}
      {...props}
    />
  );
};

export default KimbleCalculator;
