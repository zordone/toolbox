import React, { useCallback, useState } from "react";
import styled from "styled-components";
import saferEval from "safer-eval";
import _ from "lodash";
import { FieldLabel, FileField, TextArea } from "../components/Fields";
import { displayName, formatJson, reindent, setToolMeta } from "../utils";
import CodeEditor from "../components/CodeEditor";
import { commonContext } from "../components/Playground";
import { usePersistedState } from "../persistedState";
import { OpenButton, SaveButton } from "../components/Buttons";

const Grid = displayName(
  "Grid",
  styled.div`
    display: grid;
    grid-template-columns: 28rem 0fr 1fr 0fr;
    grid-template-rows: 0fr 0fr 0fr 1fr;
    grid-template-areas:
      "lin   open  lout save"
      "fin   fin   fout fout"
      "lcode lcode fout fout"
      "fcode fcode fout fout";
    gap: var(--gap-size);
    height: 100%;
  `
);

const allowTypes = ["application/json"];

const initialCode = reindent(`
  const transform = (input) => {
    // write your transform code here
    return input;
  };
`);

const codeTemplate = reindent(`
  (function () {
    {{TRANSFORM}}
    return transform(input); 
  })();
`);

const outputStyle = { fontSize: "0.7rem", whiteSpace: "pre" };

const dialogOptions = {
  filters: [
    { name: "JSON files", extensions: ["json"] },
    { name: "All Files", extensions: ["*"] },
  ],
};

const JsonTransformer = () => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [code, setCode] = usePersistedState(
    JsonTransformer,
    "code",
    initialCode
  );
  const [output, setOutput] = useState("");

  const onValidate = useCallback(
    (newCode) => {
      // parse input
      let input;
      try {
        input = JSON.parse(content || "{}");
      } catch (err) {
        return { error: `Invalid input: ${err.message}` };
      }
      // run
      const context = { ...commonContext, input, _ };
      const fullCode = codeTemplate.replace("{{TRANSFORM}}", newCode);
      try {
        const result = saferEval(fullCode, context);
        setOutput(formatJson(result));
        return { value: newCode };
      } catch (err) {
        return { error: err.message };
      }
    },
    [content]
  );

  return (
    <Grid>
      <FieldLabel area="lin">Input:</FieldLabel>
      <OpenButton
        area="open"
        setName={setName}
        setContent={setContent}
        fieldName="input"
        dialogOptions={dialogOptions}
      />
      <FileField
        area="fin"
        {...{ name, setName, content, setContent }}
        placeholder="Drop a JSON file or URL here"
        allowTypes={allowTypes}
        monoSpace
      />
      <FieldLabel area="lcode">Transform:</FieldLabel>
      <CodeEditor
        area="fcode"
        state={code}
        setState={setCode}
        monoSpace={true}
        focus={true}
        onValidate={onValidate}
      />
      <FieldLabel area="lout">Output:</FieldLabel>
      <SaveButton
        area="save"
        content={content}
        fieldName="output"
        dialogOptions={dialogOptions}
      />
      <TextArea
        area="fout"
        state={output}
        fullWidth
        monoSpace
        readOnly
        style={outputStyle}
      />
    </Grid>
  );
};

setToolMeta(JsonTransformer, {
  name: "JsonTransformer",
  description: "JSON data transform with JavaScript and Lodash.",
});

export default JsonTransformer;
