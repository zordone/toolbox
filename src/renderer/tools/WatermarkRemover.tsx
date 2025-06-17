import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { CopyButton, PasteButton } from "../common/Buttons";
import { FieldLabel, TextArea } from "../fields";
import { usePersistedState } from "../persistedState";
import { registerTool, ToolProps } from "../toolStore";
import { displayName, isNamedFocus } from "../utils";

const initialText = "Space: |Tab:\t|FFFC:\uFFFC|00AD:\u00AD|LF:\nHello World!";

const SideBySide = displayName(
  "SideBySide",
  styled.div`
    display: grid;
    grid-template:
      "left right" 1fr
      "foot foot" 0fr
      / 1fr 1fr;
    gap: var(--gap-size);
    height: 100%;
  `
);

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

const Footer = displayName(
  "Footer",
  styled.div`
    /* empty */
  `
);

const Value = displayName(
  "Value",
  styled.span`
    font-weight: 700;
    margin-right: 0.3rem;
  `
);

const Unit = displayName(
  "Unit",
  styled.span`
    opacity: 0.5;
  `
);

const reInvisible = /\p{Default_Ignorable_Code_Point}|[\uFFF0-\uFFFF]/gu;

const removeWatermark = (text: string): string => {
  const chars = Array.from(text);
  let clean = "";
  for (const char of chars) {
    const isInvisible = reInvisible.exec(char);
    if (!isInvisible) clean += char;
  }
  return clean;
};

const WatermarkRemover: FC<ToolProps> = () => {
  const [marked, setMarked] = usePersistedState(
    WatermarkRemover,
    "marked",
    initialText
  );
  const [clean, setClean] = useState("");
  const [removed, setRemoved] = useState(0);

  useEffect(() => {
    if (isNamedFocus("clean")) {
      return;
    }
    const clean = removeWatermark(marked);
    setClean(clean);
    setRemoved(marked.length - clean.length);
  }, [marked]);

  return (
    <SideBySide>
      <Grid>
        <FieldLabel $area="label">Watermarked text</FieldLabel>
        <CopyButton area="copy" name="watermaked text" state={marked} />
        <PasteButton
          area="paste"
          name="watermarked text"
          setState={setMarked}
        />
        <TextArea area="field" state={marked} setState={setMarked} rows={10} />
      </Grid>
      <Grid>
        <FieldLabel $area="label">Clean text</FieldLabel>
        <CopyButton area="copy" name="clean text" state={clean} />
        <TextArea
          area="field"
          state={clean}
          setState={setClean}
          readOnly={true}
          rows={10}
          data-name="clean text"
        />
      </Grid>
      <Footer>
        <Value>{removed}</Value>
        <Unit>characters removed.</Unit>
      </Footer>
    </SideBySide>
  );
};

registerTool({
  component: WatermarkRemover,
  name: "WatermarkRemover",
  description: "AI output watermark remover.",
});
