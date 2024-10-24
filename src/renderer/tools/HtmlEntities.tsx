import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { ascii } from "../common/ascii";
import { CopyButton, PasteButton } from "../common/Buttons";
import { FieldLabel, TextArea } from "../fields";
import { usePersistedState } from "../persistedState";
import { registerTool, ToolProps } from "../toolStore";
import { displayName, htmlToText } from "../utils";

const initialText = "Rock & Roll !";

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
    grid-template-columns: 1fr 0fr 0fr;
    grid-template-rows: 0fr 1fr;
    grid-template-areas:
      "label copy  paste"
      "field field field";
    gap: var(--gap-size);
  `
);

const entities = ascii.filter((ascii) => ascii[4]);
const charToEntity = Object.fromEntries(
  entities.map((row) => [row[1], row[4]])
);

const textToHtml = (text: string) =>
  text
    .split("")
    .map((char) => charToEntity[char] ?? char)
    .join("");

const HtmlEntities: FC<ToolProps> = () => {
  const [text, setText] = usePersistedState(HtmlEntities, "text", initialText);
  const [html, setHtml] = useState<string>();

  useEffect(() => {
    setHtml(textToHtml(text));
  }, [text]);

  useEffect(() => {
    if (html === undefined) {
      return;
    }
    setText(htmlToText(html));
  }, [html, setText]);

  return (
    <SideBySide>
      <Grid>
        <FieldLabel $area="label">Plain text</FieldLabel>
        <CopyButton area="copy" name="plain text" state={text} />
        <PasteButton area="paste" name="plain text" setState={setText} />
        <TextArea area="field" state={text} setState={setText} rows={10} />
      </Grid>
      <Grid>
        <FieldLabel $area="label">HTML entities</FieldLabel>
        <CopyButton area="copy" name="html" state={html} />
        <PasteButton area="paste" name="html" setState={setHtml} />
        <TextArea area="field" state={html} setState={setHtml} rows={10} />
      </Grid>
    </SideBySide>
  );
};

registerTool({
  component: HtmlEntities,
  name: "HtmlEntities",
  description: "HTML entities encoder and decoder.",
});

export default HtmlEntities;
