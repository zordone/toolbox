import React, { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { CopyButton, PasteButton } from "../common/Buttons";
import { FieldLabel, TextArea } from "../fields";
import { usePersistedState } from "../persistedState";
import { registerTool, ToolProps } from "../toolStore";
import { displayName } from "../utils";

const initialText = "Hello World!";

const SideBySide = displayName(
  "SideBySide",
  styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--gap-size);
    height: 100%;
  `
);

const Grid = displayName(
  "Grid",
  styled.div`
    display: grid;
    grid-template:
      "label copy  paste" 0fr
      "field field field" 1fr
      / 1fr 0fr 0fr;
    gap: var(--gap-size);
  `
);

const Base64: FC<ToolProps> = () => {
  const [text, setText] = usePersistedState(Base64, "text", initialText);
  const [base64, setBase64] = useState<string>();

  useEffect(() => {
    setBase64(btoa(text));
  }, [text]);

  useEffect(() => {
    if (base64 === undefined) {
      return;
    }
    try {
      setText(atob(base64));
    } catch (err) {
      setText("");
      toast.error("Invalid Base64 string.");
    }
  }, [base64, setText]);

  return (
    <SideBySide>
      <Grid>
        <FieldLabel $area="label">Plain text</FieldLabel>
        <CopyButton area="copy" name="plain text" state={text} />
        <PasteButton area="paste" name="plain text" setState={setText} />
        <TextArea area="field" state={text} setState={setText} rows={10} />
      </Grid>
      <Grid>
        <FieldLabel $area="label">Base64</FieldLabel>
        <CopyButton area="copy" name="base64" state={base64} />
        <PasteButton area="paste" name="base64" setState={setBase64} />
        <TextArea area="field" state={base64} setState={setBase64} rows={10} />
      </Grid>
    </SideBySide>
  );
};

registerTool({
  component: Base64,
  name: "Base64",
  description: "Base64 encoder and decoder.",
});

export default Base64;
