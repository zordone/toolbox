import _ from "lodash";
import React, { useCallback, useState } from "react";
import saferEval from "safer-eval";
import styled from "styled-components";
import {
  CopyButton,
  OpenButton,
  PasteButton,
  SaveButton,
} from "../common/Buttons";
import CodeEditor from "../common/CodeEditor";
import { FieldLabel, FileField, TextArea } from "../fields";
import { usePersistedState } from "../persistedState";
import { commonContext } from "../templates/Playground";
import { registerTool } from "../toolStore";
import { displayName, formatJson, reindent } from "../utils";

const Grid = displayName(
  "Grid",
  styled.div`
    display: grid;
    grid-template-columns: 27rem 0fr 0fr 1fr 0fr;
    grid-template-rows: 0fr 0fr 0fr 1fr;
    grid-template-areas:
      "lin   open  paste lout save copy"
      "fin   fin   fin   fout fout fout"
      "lcode lcode lcode fout fout fout"
      "fcode fcode fcode fout fout fout";
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
    (newCode: string) => {
      "use strict";
      // parse input
      let input;
      try {
        input = JSON.parse(content || "{}");
      } catch (err) {
        return { value: "", error: `Invalid input: ${err.message}` };
      }
      // run
      const context = { ...commonContext, input, _ };
      const fullCode = codeTemplate.replace("{{TRANSFORM}}", newCode);
      try {
        const result = saferEval(fullCode, context);
        // setTimeout prevents the cursor jumping back when updating the output before the code.
        setTimeout(() => setOutput(formatJson(result)), 0);
        return { value: newCode, error: null };
      } catch (err) {
        return { value: "", error: err.message };
      }
    },
    [content]
  );

  return (
    <Grid>
      <FieldLabel $area="lin">Input</FieldLabel>
      <OpenButton
        area="open"
        dialogOptions={dialogOptions}
        fieldName="input"
        setContent={setContent}
        setName={setName}
      />
      <PasteButton area="paste" name="input JSON" setState={setContent} />
      <FileField
        {...{ name, setName, setContent }}
        allowTypes={allowTypes}
        area="fin"
        monoSpace
        placeholder="Drop a JSON file or URL here"
      />
      <FieldLabel $area="lcode">Transform</FieldLabel>
      <CodeEditor
        area="fcode"
        focus={true}
        onValidate={onValidate}
        setState={setCode}
        state={code}
      />
      <FieldLabel $area="lout">Output</FieldLabel>
      <SaveButton
        area="save"
        content={output}
        dialogOptions={dialogOptions}
        fieldName="output"
      />
      <CopyButton area="copy" name="output JSON" state={output} />
      <TextArea
        area="fout"
        fullWidth
        monoSpace
        readOnly
        state={output}
        style={outputStyle}
      />
    </Grid>
  );
};

registerTool({
  component: JsonTransformer,
  name: "JsonTransformer",
  description: "JSON data transform with JavaScript and Lodash.",
});

export default JsonTransformer;
