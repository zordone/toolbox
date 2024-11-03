import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { CopyButton } from "../common/Buttons";
import { cssGridArea, CssGridAreaProps } from "../common/styledCss";
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
  `,
);

const Footer = displayName(
  "Footer",
  styled.div<CssGridAreaProps>`
    ${cssGridArea};
    grid-area: foot;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 0fr;
    gap: var(--gap-size);
  `,
);

const Value = displayName(
  "Value",
  styled.span<CssGridAreaProps>`
    ${cssGridArea};
    white-space: nowrap;
    margin-right: 0.1rem;
    font-weight: bold;
    font-size: 1.5rem;
  `,
);

const Unit = displayName(
  "Unit",
  styled.span<CssGridAreaProps>`
    ${cssGridArea};
    white-space: nowrap;
    margin-right: 0.1rem;
    opacity: 0.5;
  `,
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
      />
      <CopyButton area="copy" name={name} state={text} />
      <Footer>
        {results.map(({ title, unit, value }) => (
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
