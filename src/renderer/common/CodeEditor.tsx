import React, {
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import AceEditor, { IAceEditorProps } from "react-ace";
import styled from "styled-components";
import { displayName, noop, stopPropagation } from "../utils";
import "./CodeEditor.css";
import { cssGridArea, CssGridAreaProps } from "./styledCss";
// must be imported after AceEditor
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/theme-tomorrow_night";

const EditorContainer = displayName(
  "EditorContainer",
  styled.div<CssGridAreaProps>`
    ${cssGridArea};
    position: relative;
    border-radius: var(--border-radius);
    overflow: hidden;

    /* AceEditor can't be styled directly, because styled components swallows the theme prop. */
    > .ace-editor {
      ${cssGridArea};
      background: var(--input-bg);
      padding: 0.2rem;
      box-sizing: border-box;
    }
  `,
);

interface ErrorProps {
  $visible: boolean;
}

const Error = displayName(
  "Error",
  styled.div<ErrorProps>`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: var(--error-bg);
    color: var(--error-fg);
    padding: 0.2rem;
    transition: transform 400ms;
    transform: ${({ $visible }) => ($visible ? "none" : "translateY(100%)")};
  `,
);

interface ValidatorResult {
  error: string | null;
  value: string;
}
type Validator = (text: string) => ValidatorResult | Promise<ValidatorResult>;
type OnChange = (value: string, event?: unknown) => void;

const defaultValidator: Validator = (text) => ({ error: null, value: text });

interface CodeEditorProps extends Omit<IAceEditorProps, "onValidate" | "mode"> {
  area?: string;
  editorRef?: MutableRefObject<AceEditor>;
  initialCode?: string;
  mode?: "javascript" | "json";
  onValidate?: Validator;
  readOnly?: boolean;
  setState: (state: string) => void;
  state: string;
}

const CodeEditor: FC<CodeEditorProps> = ({
  area,
  editorRef,
  initialCode = "",
  mode = "javascript",
  onValidate = defaultValidator,
  readOnly = false,
  setState = noop,
  state,
  ...rest
}) => {
  const [lastError, setLastError] = useState<string | null>();
  const [error, setError] = useState<string | null>();
  const [inputValue, setInputValue] = useState(state);
  const onChangeRef = useRef<OnChange>();

  const onChange: OnChange = useCallback(
    async (text: string) => {
      const { value, error } = await onValidate(text);
      setInputValue(text);
      setError(error);
      if (!error) {
        setState(value);
      }
    },
    [setState, onValidate],
  );

  // extra validations
  useEffect(() => {
    if (state === undefined && !!initialCode) {
      // validate initial code
      onChange(initialCode);
    } else if (state !== undefined && onChange !== onChangeRef.current) {
      // re-validate state when validator changes
      onChange(state);
    }
    onChangeRef.current = onChange;
  }, [state, initialCode, onChange]);

  // set editor value to external state
  useEffect(() => {
    setInputValue(state);
  }, [state]);

  // keep last error info until next validation
  useEffect(() => {
    if (error && error !== lastError) {
      setLastError(error);
    }
  }, [error, lastError]);

  return (
    <EditorContainer $area={area} onPaste={stopPropagation}>
      <AceEditor
        debounceChangePeriod={500}
        height="100%"
        mode={mode}
        onChange={onChange}
        readOnly={readOnly}
        ref={editorRef}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          tabSize: 2,
          useWorker: false,
          foldStyle: "markbeginend",
          highlightGutterLine: false,
        }}
        theme="tomorrow_night"
        value={inputValue}
        width="100%"
        {...rest}
      />
      <Error $visible={!!error}>{lastError}</Error>
    </EditorContainer>
  );
};

export default CodeEditor;
