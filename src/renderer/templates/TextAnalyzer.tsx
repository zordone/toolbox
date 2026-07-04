import React, { FC, useEffect, useState, Fragment } from "react";
import styled from "styled-components";
import { CopyButton } from "../common/Buttons";
import { Footer } from "../common/Footer";
import { Unit } from "../common/Unit";
import { Value } from "../common/Value";
import { FieldLabel, TextArea } from "../fields";
import { usePersistedState } from "../persistedState";
import { displayName } from "../utils";
import { ToolProps } from "../toolStore";

const Grid = displayName(
  "Grid",
  styled.div`
    display: grid;
    grid-template:
      "label copy" 0fr
      "text  text" 1fr
      "foot  foot" 0fr
      / 1fr 0fr;
    gap: var(--gap-size);
    height: 100%;
  `
);

interface Result {
  title: string;
  unit: string;
  value: number | string | boolean;
}

interface TextAnalyzerProps {
  initialText: string;
  label: string;
  name: string;
  onUpdateResults: (text: string) => Result[];
  pasted?: string;
  toolComp: FC<ToolProps>;
}

const TextAnalyzer: FC<TextAnalyzerProps> = ({
  initialText = "",
  label = "Edit your text here:",
  name = "text",
  onUpdateResults = () => [],
  pasted,
  toolComp,
}) => {
  const [text, setText] = usePersistedState(toolComp, "text", initialText);
  const [results, setResults] = useState<Result[]>([]);

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
      <FieldLabel $area="label">{label}</FieldLabel>
      <TextArea
        area="text"
        monoSpace={true}
        rows={10}
        setState={setText}
        state={text}
        autoFocus
      />
      <CopyButton area="copy" name={name} state={text} />
      <Footer $area="foot">
        {results.map(({ title, unit, value }) => (
          <Fragment key={title}>
            <Value title={title}>{value}</Value>
            <Unit>{unit}&nbsp;</Unit>
          </Fragment>
        ))}
      </Footer>
    </Grid>
  );
};

export default TextAnalyzer;
