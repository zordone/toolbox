import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { TextArea, FieldLabel } from "./Fields";
import { CopyButton } from "./Buttons";
import { displayName } from "../utils";
import { cssGridArea } from "./styledCss";
import { usePersistedState } from "../persistedState";

const Grid = displayName(
  "Grid",
  styled.div`
    display: grid;
    grid-template-columns: 1fr 0fr;
    grid-template-rows: 0fr 1fr 0fr;
    grid-template-areas:
      "label copy"
      "text  text"
      "foot  foot";
    gap: var(--gap-size);
    height: 100%;
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
  "Unit",
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
  toolComp,
  pasted,
}) => {
  const [text, setText] = usePersistedState(toolComp, "text", initialText);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const newResults = onUpdateResults(text);
    setResults(newResults);
  }, [text, onUpdateResults]);

  useEffect(() => {
    if (pasted) {
      setText(pasted);
    }
  }, [pasted, setText]);

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
