import React, { useEffect } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { FieldLabel } from "./Fields";
import { CopyButton, PasteButton } from "./Buttons";
import CodeEditor from "./CodeEditor";
import { displayName, capitalize } from "../utils";

const Grid = displayName(
  "Grid",
  styled.div`
    display: grid;
    grid-area: ${({ area }) => area};
    grid-template-columns: 1fr 0fr;
    grid-template-rows: 0fr 1fr;
    grid-template-areas:
      "label copy paste"
      "code  code code";
    gap: var(--gap-size);
    height: 100%;
  `
);

const Formatter = ({
  area,
  pasted,
  title,
  name,
  state,
  setState,
  initialCode = "",
  onValidate,
  mode = "javascript",
  ...rest
}) => {
  useEffect(() => {
    if (pasted) {
      setState(pasted);
      toast.success(capitalize(`Pasted into ${name}.`));
    }
  }, [pasted, setState, name]);

  return (
    <Grid area={area}>
      <FieldLabel area="label">{title}</FieldLabel>
      <CopyButton area="copy" name={name} state={state} />
      <PasteButton area="paste" name={name} setState={setState} />
      <CodeEditor
        area="code"
        mode={mode}
        state={state}
        setState={setState}
        initialCode={initialCode}
        monoSpace={true}
        focus={false}
        onValidate={onValidate}
        {...rest}
      />
    </Grid>
  );
};

export default Formatter;
