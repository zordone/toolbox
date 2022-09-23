import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { FieldLabel, TextAreaHighlight, TextField } from "../components/Fields";
import { displayName, setToolMeta } from "../utils";
import { usePersistedState } from "../persistedState";

const DEFAULT_EXP = "/llo/";
const DEFAULT_TEST = "Hello World!";

const Grid = displayName(
  "Grid",
  styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 0fr 0fr 0fr;
    grid-template-areas:
      "lExp"
      "exp"
      "lTest"
      "test";
    gap: var(--gap-size);
    height: 100%;
  `
);

const strToRegex = (str) => {
  const match = str.match(/^\/(.*)\/([gimyus]*)$/);
  if (!match) {
    throw new Error("Invalid regex");
  }
  const [, pattern, flags] = match;
  return new RegExp(pattern, flags);
};

const Regex = () => {
  const [expr, setExpr] = usePersistedState(Regex, "expression", DEFAULT_EXP);
  const [test, setTest] = usePersistedState(Regex, "test", DEFAULT_TEST);
  const [marks, setMarks] = useState([]);
  const [error, setError] = useState("");

  const execute = useCallback(() => {
    // parse regex
    let regex;
    try {
      regex = strToRegex(expr);
    } catch (err) {
      setError(err.message);
      setMarks([]);
      return;
    }
    // find matches
    let matches;
    try {
      if (regex.global) {
        matches = Array.from(test.matchAll(regex));
      } else {
        const match = test.match(regex);
        matches = match ? [match] : [];
      }
      console.log("matches", matches); // TODO: remove
    } catch (err) {
      console.error(err);
      setError(err.message);
      matches = [];
      // TODO: display error?
    }
    // convert to marks
    const marks = matches.map((match) => ({
      index: match.index,
      length: match[0].length,
    }));
    console.log("marks", marks);
    setMarks(marks);
    setError("");
  }, [expr, test]);

  useEffect(execute, [execute]);

  return (
    <Grid>
      <FieldLabel>Regular expression</FieldLabel>
      <TextField
        state={expr}
        setState={setExpr}
        error={error}
        placeholder="/foo/g"
        monoSpace
      />
      <FieldLabel>Test data</FieldLabel>
      <TextAreaHighlight
        area="test"
        state={test}
        setState={setTest}
        marks={marks}
        rows={10}
      />
    </Grid>
  );
};

setToolMeta(Regex, {
  name: "Regex",
  description: "Regular expression tester.",
  settings: [],
});

export default Regex;
