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
import { displayName, ignoreError, noop, stopPropagation } from "../utils";
import { cssGridArea, CssGridAreaProps } from "./styledCss";
import { ErrorBanner } from "./ErrorBanner";
import "./CodeEditor.css";
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
    overflow: hidden;
    border: 1px solid #1d1f21; /* gutter bg */
    border-radius: var(--border-radius);

    &:focus-within {
      /* based on cssFocusStyle, adapted for AceEditor */
      border: 1px solid var(--focus-outline);
    }

    /* AceEditor can't be styled directly, because styled components swallows the theme prop. */
    > .ace-editor {
      ${cssGridArea};
      background: var(--input-bg);
      padding: 0.2rem;
      box-sizing: border-box;
    }
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
  editorRef?: MutableRefObject<AceEditor | null>;
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
    (text: string) => {
      // onValidate might be async, but AceEditor doesn't accept an async onChange handler,
      // so we need to handle it here without await.
      Promise.resolve(onValidate(text))
        .then(({ value, error }) => {
          setError(error);
          setInputValue(text);
          if (!error) {
            setTimeout(() => {
              setState(value);
              setInputValue(value);
            }, 0);
          }
        })
        .catch(ignoreError);
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

  // force the scrollbar to be un-focusable. no way to configure it.
  useEffect(() => {
    if (!editorRef?.current) {
      return;
    }
    editorRef.current.refEditor
      .querySelectorAll(".ace_scrollbar")
      .forEach((element) => {
        element.setAttribute("tabindex", "-1");
      });
  }, [editorRef]);

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
          foldStyle: "markbeginend",
          highlightGutterLine: false,
          showInvisibles: true,
          tabSize: 2,
          useWorker: false,
          fontSize: "0.8rem",
        }}
        theme="tomorrow_night"
        value={inputValue}
        width="100%"
        {...rest}
      />
      <ErrorBanner $visible={!!error}>{lastError}</ErrorBanner>
    </EditorContainer>
  );
};

export default CodeEditor;
