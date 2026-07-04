import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { CopyButton, PasteButton } from "../common/Buttons";
import { ErrorBanner } from "../common/ErrorBanner";
import { SideBySide } from "../common/SideBySide";
import { FieldLabel, TextArea } from "../fields";
import { usePersistedState } from "../persistedState";
import { registerTool, ToolProps } from "../toolStore";
import { displayName, isNamedFocus } from "../utils";

const initialText = "Hello World!";

const Grid = displayName(
  "Grid",
  styled.div`
    position: relative;
    overflow-y: hidden;
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
  const [base64, setBase64] = useState<string>("");
  const [textError, setTextError] = useState<string>("");
  const [base64Error, setBase64Error] = useState<string>("");

  useEffect(() => {
    if (isNamedFocus("base64")) {
      return;
    }
    try {
      setBase64(btoa(text));
      setTextError("");
    } catch {
      setBase64("");
      setTextError("Non-ASCII string.");
    }
  }, [text]);

  useEffect(() => {
    if (!base64) {
      return;
    }
    try {
      setText(atob(base64));
      setBase64Error("");
    } catch {
      setText("");
      setBase64Error("Invalid Base64 string.");
    }
  }, [base64, setText]);

  return (
    <SideBySide>
      <Grid>
        <FieldLabel $area="label">Plain text</FieldLabel>
        <CopyButton area="copy" name="plain text" state={text} />
        <PasteButton area="paste" name="plain text" setState={setText} />
        <TextArea area="field" state={text} setState={setText} rows={10} />
        <ErrorBanner $visible={!!textError}>{textError}</ErrorBanner>
      </Grid>
      <Grid>
        <FieldLabel $area="label">Base64</FieldLabel>
        <CopyButton area="copy" name="base64" state={base64} />
        <PasteButton area="paste" name="base64" setState={setBase64} />
        <TextArea
          area="field"
          state={base64}
          setState={setBase64}
          rows={10}
          data-name="base64"
        />
        <ErrorBanner $visible={!!base64Error}>{base64Error}</ErrorBanner>
      </Grid>
    </SideBySide>
  );
};

registerTool({
  component: Base64,
  name: "Base64",
  description: "Base64 encoder and decoder.",
});
