import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { FieldLabel } from "../components/Fields";
import { CopyButton, PasteButton } from "../components/Buttons";
import CodeEditor from "../components/CodeEditor";
import { displayName } from "../utils";

const initialJson = JSON.stringify(
  {
    hello: "world",
    foo: {
      id: "foo1",
      value: 1,
    },
  },
  null,
  2
);

const Grid = displayName(
  "Grid",
  styled.div`
    display: grid;
    grid-template-columns: 1fr 0fr;
    grid-template-rows: 0fr 1fr;
    grid-template-areas:
      "label copy paste"
      "code  code code";
    gap: var(--gap-size);
    height: 100%;
  `
);

const JsonFormatter = ({ pasted }) => {
  const [json, setJson] = useState(initialJson);

  useEffect(() => {
    if (pasted) {
      setJson(pasted);
    }
  }, [pasted]);

  const onValidate = useCallback((value) => {
    try {
      const newValue = JSON.stringify(JSON.parse(value), null, 2);
      return { value: newValue };
    } catch (ex) {
      return { error: ex.message };
    }
  }, []);

  return (
    <Grid>
      <FieldLabel area="label">Edit your JSON:</FieldLabel>
      <CopyButton area="copy" name="JSON" state={json} />
      <PasteButton area="paste" name="JSON" setState={setJson} />
      <CodeEditor
        area="code"
        mode="json"
        state={json}
        setState={setJson}
        monoSpace={true}
        focus={false}
        onValidate={onValidate}
      />
    </Grid>
  );
};

export default JsonFormatter;
