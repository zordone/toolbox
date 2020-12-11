import React, { useState, useEffect, useRef } from "react";
import saferEval from "safer-eval";
import { toast } from "react-toastify";
import styled from "styled-components";
import { displayName } from "../utils";
import { FieldLabel } from "./Fields";
import CodeEditor from "./CodeEditor";
import { reindent, noop } from "../utils";
import WatchList from "./Watches";
import Splitter, { SplitterPane } from "./Splitter";

const defaultCode = reindent(`
  const number = 1 + 2 + 3;
`);

const defaultWatchExprs = ["number"];

const wrapperStart = "(function () {";
const wrapperEnd = "})()";

const runCode = (code, extraContext, watchExprs) => {
  const watchCode = Array.from(watchExprs)
    .map((expr) => {
      // extra String() to make undefined to "undefined"
      const exprStr = JSON.stringify(expr);
      return `
        try {
          watches.push({ expr: ${exprStr}, value: ${expr} });
        } catch (err) {
          watches.push({ expr: ${exprStr}, value: err.message, isError: true });
        }
        `;
    })
    .join("\n");

  const context = {
    ...extraContext,
    console,
    Boolean,
    String,
    watches: [],
  };

  const fullCode = [wrapperStart, code, watchCode, wrapperEnd].join("\n");
  saferEval(fullCode, context);
  return context;
};
    
export const LabelRow = displayName(
  "LabelRow",
  styled.div`
    display: flex;
    justify-content: space-between;
  `
);

export const WatchHelp = displayName(
  "WatchHelp",
  styled.span`
    align-self: flex-end;
    opacity: 0.5;
    font-size: 0.8rem;
  `
);

const Playground = ({
  label = "Edit your javascript code:",
  initialCode = defaultCode,
  initialWatchExprs = defaultWatchExprs,
  extraContext = {},
  focusSearch = noop,
}) => {
  const [code, setCode] = useState(initialCode);
  const [watchExprs, setWatchExprs] = useState(new Set(initialWatchExprs));
  const [watchResults, setWatchResults] = useState([]);
  const editorRef = useRef();

  const onValidate = (newCode) => {
    try {
      runCode(newCode, extraContext, watchExprs);
      return { value: newCode, error: null };
    } catch (err) {
      return { value: newCode, error: err.message };
    }
  };

  useEffect(() => {
    try {
      const context = runCode(code, extraContext, watchExprs);
      setWatchResults(context.watches);
    } catch (err) {
      setWatchResults(
        Array.from(watchExprs).map((expr) => ({
          expr,
          value: "?",
          isError: true,
        }))
      );
    }
  }, [code, extraContext, watchExprs]);

  const addWatch = () => {
    const expr = (editorRef.current.editor.getSelectedText() || "").trim();
    if (!expr) {
      toast.error("Watch expression can't be empty.");
      return;
    }
    if (expr.includes(";")) {
      toast.error("Watch expression can't contain semicolon.");
      return;
    }
    if (watchExprs.has(expr)) {
      removeWatch(expr);
    } else {
      watchExprs.add(expr);
      setWatchExprs(new Set(watchExprs));
      toast.success("Watch expression added.");
    }
  };

  const removeWatch = (expr) => {
    watchExprs.delete(expr);
    setWatchExprs(new Set(watchExprs));
    toast.success("Watch expression removed.");
  };

  return (
    <Splitter split="vertical" defaultSize="75%">
      <SplitterPane>
        <LabelRow>
          <FieldLabel>{label}</FieldLabel>
          <WatchHelp>Press ^W to add/remove watch.</WatchHelp>
        </LabelRow>
        <CodeEditor
          editorRef={editorRef}
          state={code}
          setState={setCode}
          monoSpace={true}
          focus={true}
          onValidate={onValidate}
          commands={[
            {
              name: "addWatch",
              bindKey: { win: "Ctrl-w", mac: "Ctrl-w" },
              exec: addWatch,
            },
            {
              name: "focusSearch",
              bindKey: { win: "Ctrl-f", mac: "Ctrl-f" },
              exec: focusSearch,
            },
          ]}
        />
      </SplitterPane>
      <SplitterPane>
        <FieldLabel>Watches:</FieldLabel>
        <WatchList watches={watchResults} onRemove={removeWatch} />
      </SplitterPane>
    </Splitter>
  );
};

export default Playground;
