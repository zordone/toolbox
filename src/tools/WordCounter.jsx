import React from "react";
import TextAnalyzer from "../components/TextAnalyzer";
import { reindent } from "../utils";

const initialText = reindent(`
  Being human makes us susceptible to the onset of feelings. The role of these emotions varies. 
  Some of them are useful while others may be harmful. The use of social media for self-expression 
  has reached a point that it makes us feel we can say anything. This begins when we see people 
  expressing anything and everything that come to mind. When we see everyone else voicing their 
  likes and dislikes, their irritations and desires we tend to imitate what they do. And because 
  many engage in this, we think that it is normal and healthy. However, when we get used to 
  unbridled self-expression, we come to believe that all feelings are valid. We become convinced 
  that in real life, we should also act on our emotions and our impulses. Using social media this 
  way erodes our ability to regulate our actions and reactions. 
`);

const WordCounter = (props) => {
  const analyze = (text) => {
    const lines = (text.match(/\n/g) || []).length + Number(text.length > 0);
    const words = Math.floor((text.match(/\b/g) || []).length / 2);
    const chars = text.length;
    return [
      {
        title: "Number of lines",
        value: lines,
        unit: "lines,",
      },
      {
        title: "Number of words",
        value: words,
        unit: "words,",
      },
      {
        title: "Number of characters",
        value: chars,
        unit: "characters.",
      },
    ];
  };

  return (
    <TextAnalyzer
      label="Paste the text here"
      name="text"
      initialText={initialText}
      onUpdateResults={analyze}
      toolComp={WordCounter}
      {...props}
    />
  );
};

export default WordCounter;
