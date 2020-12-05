import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/javascript";
import { noop, displayName } from "../utils";
import { cssGridArea } from "./styledCss";
import "./CodeEditor.css";

const EditorContainer = displayName(
  "EditorContainer",
  styled.div`
    ${cssGridArea}
    position: relative;
    border-radius: var(--border-radius);
    overflow: hidden;
  `
);

const Error = displayName(
  "Error",
  styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: #8008;
    color: red;
    padding: 0.2rem;
    transition: transform 400ms;
    transform: ${({ visible }) => (visible ? "none" : "translateY(100%)")};
  `
);

const StyledEditor = displayName(
  "StyledEditor",
  styled(AceEditor)`
    ${cssGridArea}
    background: var(--input-bg);
    padding: 0.2rem;
    box-sizing: border-box;
  `
);

const defaultValidator = (text) => ({ error: null, value: text });

const CodeEditor = ({
  editorRef,
  mode = "javascript",
  state = "",
  setState = noop,
  readOnly = false,
  monoSpace = false,
  onValidate = defaultValidator,
  area,
  ...rest
}) => {
  const [lastError, setLastError] = useState();
  const [error, setError] = useState();
  const [inputValue, setInputValue] = useState(state);

  useEffect(() => {
    setInputValue(state);
  }, [state]);

  useEffect(() => {
    if (error && error !== lastError) {
      setLastError(error);
    }
  }, [error, lastError]);

  const onChange = useCallback(
    (text) => {
      const { value, error } = onValidate(text);
      setInputValue(text);
      setError(error);
      if (!error) {
        setState(value);
      }
    },
    [setState, onValidate]
  );

  return (
    <EditorContainer area={area}>
      <StyledEditor
        ref={editorRef}
        mode={mode}
        theme="tomorrow_night"
        value={inputValue}
        onChange={onChange}
        debounceChangePeriod={500}
        error={error}
        readOnly={readOnly}
        monoSpace={monoSpace}
        width="100%"
        height="100%"
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          tabSize: 2,
          useWorker: false,
        }}
        {...rest}
      />
      <Error visible={error}>{lastError}</Error>
    </EditorContainer>
  );
};

export default CodeEditor;