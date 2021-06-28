import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { FieldLabel, IntegerField, TextArea } from "../components/Fields";
import { CopyButton } from "../components/Buttons";
import { displayName, setToolMeta, repeat as repeatText } from "../utils";
import { usePersistedState } from "../persistedState";

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

const LoremIpsum = () => {
  const [output, setOutput] = useState("");
  const [repeat, setRepeat] = usePersistedState(LoremIpsum, "repeat");
  const [length, setLength] = usePersistedState(LoremIpsum, "length");
  const [eols, setEols] = usePersistedState(LoremIpsum, "eols", 2);

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
        state={repeat}
        setState={setRepeat}
        onChange={() => setLength(undefined)}
      />
      <FieldLabel>Length</FieldLabel>
      <IntegerField
        state={length}
        setState={setLength}
        onChange={() => setRepeat(undefined)}
      />
      <FieldLabel>EOLs</FieldLabel>
      <IntegerField state={eols} setState={setEols} />
      <CopyButton area="copy" name="lorem ipsum" state={output} />
      <TextArea area="out" state={output} readOnly={true} rows={10} />
    </Grid>
  );
};

setToolMeta(LoremIpsum, {
  name: "LoremIpsum",
  description: "Lorem ipsum text generator.",
  settings: [],
});

export default LoremIpsum;
