import React, { FC, useEffect, useState, Fragment } from "react";
import styled from "styled-components";
import { CopyButton, IconButton } from "../common/Buttons";
import { Footer } from "../common/Footer";
import { Unit } from "../common/Unit";
import { Value } from "../common/Value";
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
      "label buttons" 0fr
      "text  text" 1fr
      "foot  foot" 0fr
      / 1fr 0fr;
    gap: var(--gap-size);
    height: 100%;
  `
);

export const Buttons = displayName(
  "Buttons",
  styled.div<CssGridAreaProps>`
    ${cssGridArea};
    display: flex;
    gap: var(--gap-size);
  `
);

interface Result {
  title: string;
  unit: string;
  value: number | string | boolean;
}

interface Transform {
  icon: string;
  title: string;
  transform: (text: string) => string;
}

interface TextAnalyzerProps {
  initialText: string;
  label: string;
  name: string;
  onUpdateResults: (text: string) => Result[];
  pasted?: string;
  toolComp: FC<ToolProps>;
  transforms?: Transform[];
}

const TextAnalyzer: FC<TextAnalyzerProps> = ({
  initialText = "",
  label = "Edit your text here:",
  name = "text",
  onUpdateResults = () => [],
  pasted,
  toolComp,
  transforms = [],
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
      <Buttons $area="buttons">
        <CopyButton area="copy" name={name} state={text} />
        {transforms.map(({ icon, transform, title }) => (
          <IconButton
            key={icon}
            icon={icon}
            onClick={() => {
              setText(transform(text));
            }}
            title={title}
          />
        ))}
      </Buttons>
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
