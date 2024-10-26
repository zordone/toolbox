import React, { ComponentProps, FC, useEffect } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { CopyButton, PasteButton } from "../common/Buttons";
import CodeEditor from "../common/CodeEditor";
import { cssGridArea, CssGridAreaProps } from "../common/styledCss";
import { FieldLabel } from "../fields";
import { capitalize, displayName } from "../utils";

const Grid = displayName(
  "Grid",
  styled.div<CssGridAreaProps>`
    ${cssGridArea}
    display: grid;
    grid-template:
      "label copy paste" 0fr
      "code  code code" 1fr
      / 1fr 0fr;
    gap: var(--gap-size);
    height: 100%;
  `
);

interface FormatterProps extends ComponentProps<typeof CodeEditor> {
  area?: string;
  initialCode?: string;
  mode: ComponentProps<typeof CodeEditor>["mode"];
  name: string;
  onValidate: ComponentProps<typeof CodeEditor>["onValidate"];
  pasted?: string;
  setState: (newState: string) => void;
  state: string;
  title: string;
}

const Formatter: FC<FormatterProps> = ({
  area,
  initialCode = "",
  mode = "javascript",
  name,
  onValidate,
  pasted,
  setState,
  state,
  title,
  ...rest
}) => {
  useEffect(() => {
    if (pasted) {
      setState(pasted);
      toast.success(capitalize(`Pasted into ${name}.`));
    }
  }, [pasted, setState, name]);

  return (
    <Grid $area={area}>
      <FieldLabel $area="label">{title}</FieldLabel>
      <CopyButton area="copy" name={name} state={state} />
      <PasteButton area="paste" name={name} setState={setState} />
      <CodeEditor
        area="code"
        mode={mode}
        state={state}
        setState={setState}
        initialCode={initialCode}
        focus={false}
        onValidate={onValidate}
        {...rest}
      />
    </Grid>
  );
};

export default Formatter;
