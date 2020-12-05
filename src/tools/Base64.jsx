import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { TextArea, FieldLabel } from "../components/Fields";
import { CopyButton, PasteButton } from "../components/Buttons";
import { displayName } from "../utils";

const SideBySide = displayName(
  "SideBySide",
  styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--gap-size);
  `
);

const Grid = displayName(
  "Grid",
  styled.div`
    display: grid;
    grid-template-columns: 1fr 0fr 0fr;
    grid-template-areas:
      "label copy  paste"
      "field field field";
    gap: var(--gap-size);
  `
);

const Base64 = () => {
  const [text, setText] = useState("");
  const [base64, setBase64] = useState("");

  useEffect(() => {
    setBase64(btoa(text));
  }, [text]);

  useEffect(() => {
    try {
      setText(atob(base64));
    } catch (err) {
      setText("");
      toast.error("Invalid Base64 string.");
    }
  }, [base64]);

  return (
    <SideBySide>
      <Grid>
        <FieldLabel area="label">Plain text</FieldLabel>
        <CopyButton area="copy" name="plain text" state={text} />
        <PasteButton area="paste" name="plain text" setState={setText} />
        <TextArea area="field" state={text} setState={setText} rows={10} />
      </Grid>
      <Grid>
        <FieldLabel area="label">Base64</FieldLabel>
        <CopyButton area="copy" name="base64" state={base64} />
        <PasteButton area="paste" name="base64" setState={setBase64} />
        <TextArea area="field" state={base64} setState={setBase64} rows={10} />
      </Grid>
    </SideBySide>
  );
};

export default Base64;
