import React, { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { CopyButton } from "../common/Buttons";
import { FieldLabel, IntegerField, TextArea } from "../fields";
import { usePersistedState } from "../persistedState";
import { registerTool, ToolProps } from "../toolStore";
import { displayName, repeat as repeatText } from "../utils";

const BASE = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
].join("");

const Grid = displayName(
  "Grid",
  styled.div`
    display: grid;
    grid-template-columns: 0fr 4ch 0fr 8ch 0fr 4ch 1fr 0fr;
    grid-template-rows: 0fr 1fr;
    grid-template-areas:
      "lRep rep lLen len lEol eol .   copy"
      "out  out out  out out  out out out";
    gap: var(--gap-size);
    height: 100%;
  `
);

const LoremIpsum: FC<ToolProps> = () => {
  const [output, setOutput] = useState("");
  const [repeat, setRepeat] = usePersistedState<number | undefined>(
    LoremIpsum,
    "repeat"
  );
  const [length, setLength] = usePersistedState<number | undefined>(
    LoremIpsum,
    "length"
  );
  const [eols, setEols] = usePersistedState<number>(LoremIpsum, "eols", 2);

  const generate = useCallback(() => {
    const count = repeat || Math.trunc(length / BASE.length + 1) || 0;
    const separator = eols ? repeatText("\n", eols) : " ";
    const maxLength = length || Infinity;
    const result = repeatText(BASE, count, separator).substr(0, maxLength);
    setOutput(result);
  }, [eols, repeat, length]);

  useEffect(generate, [generate]);

  // if neither `repeat` or `length` is specified after initialization, set a default
  useEffect(() => {
    if (!repeat && !length) {
      setRepeat(3);
    }
  }, [length, repeat, setRepeat]);

  return (
    <Grid>
      <FieldLabel>Repeat</FieldLabel>
      <IntegerField
        min={0}
        onChange={() => setLength(undefined)}
        setState={setRepeat}
        state={repeat}
      />
      <FieldLabel>Length</FieldLabel>
      <IntegerField
        min={0}
        onChange={() => setRepeat(undefined)}
        setState={setLength}
        state={length}
      />
      <FieldLabel>EOLs</FieldLabel>
      <IntegerField min={0} state={eols} setState={setEols} />
      <CopyButton area="copy" name="lorem ipsum" state={output} />
      <TextArea rows={10} area="out" readOnly={true} state={output} />
    </Grid>
  );
};

registerTool({
  component: LoremIpsum,
  name: "LoremIpsum",
  description: "Lorem ipsum text generator.",
});

export default LoremIpsum;
