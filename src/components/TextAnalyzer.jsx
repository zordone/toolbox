import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { TextArea, FieldLabel } from "./Fields";
import { CopyButton } from "./Buttons";
import { displayName } from "../utils";
import { cssGridArea } from "./styledCss";

const Grid = displayName(
  "Grid",
  styled.div`
    display: grid;
    grid-template-columns: 1fr 0fr;
    grid-template-areas:
      "label copy"
      "text  text"
      "foot  foot";
    gap: var(--gap-size);
  `
);

const Footer = displayName(
  "Footer",
  styled.div`
    ${cssGridArea}
    grid-area: foot;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 0fr;
    gap: var(--gap-size);
  `
);

const Value = displayName(
  "Value",
  styled.span`
    ${cssGridArea}
    white-space: nowrap;
    margin-right: 0.1rem;
    font-weight: bold;
    font-size: 1.5rem;
  `
);

const Unit = displayName(
  "Text",
  styled.span`
    ${cssGridArea}
    white-space: nowrap;
    margin-right: 0.1rem;
    opacity: 0.5;
  `
);

const TextAnalyzer = ({
  label = "Edit your text here:",
  name = "text",
  initialText = "",
  onUpdateResults = () => [],
  pasted,
}) => {
  const [text, setText] = useState(initialText);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const newResults = onUpdateResults(text);
    setResults(newResults);
  }, [text, onUpdateResults]);

  useEffect(() => {
    if (pasted) {
      setText(pasted);
    }
  }, [pasted]);

  return (
    <Grid>
      <FieldLabel area="label">{label}</FieldLabel>
      <TextArea
        area="text"
        state={text}
        setState={setText}
        monoSpace={true}
        rows={10}
      />
      <CopyButton area="copy" name={name} state={text} />
      <Footer>
        {results.map(({ value, unit, title }) => (
          <div key={title}>
            <Value title={title}>{value}</Value>
            <Unit>{unit}</Unit>
          </div>
        ))}
      </Footer>
    </Grid>
  );
};

export default TextAnalyzer;
