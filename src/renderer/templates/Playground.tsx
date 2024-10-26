import React, {
  ComponentProps,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactAce from "react-ace";
import { toast } from "react-toastify";
import styled from "styled-components";
import CodeEditor from "../common/CodeEditor";
import { safeEval } from "../common/SafeEval";
import Splitter, { SplitterPane } from "../common/Splitter";
import WatchList, { Watch } from "../common/Watches";
import { FieldLabel } from "../fields";
import { usePersistedState, usePersistedStateSet } from "../persistedState";
import { displayName, noop, reindent } from "../utils";

const defaultCode = reindent(`
  const number = 1 + 2 + 3;
`);

const defaultWatchExprs = ["number"];

const wrapperStart = "(function () {";
const wrapperEnd = "return context; })()";

const runCode = async (
  code: string,
  extraContext: object,
  watchExprs: Set<string>
) => {
  const watchCode = Array.from(watchExprs)
    .map((expr) => {
      const exprStr = JSON.stringify(expr);
      return reindent(`
        try {
          watches.push({ expr: ${exprStr}, value: ${expr} });
        } catch (err) {
          watches.push({ expr: ${exprStr}, value: err.message, isError: true });
        }
      `);
    })
    .join("\n");

  const watches: Watch[] = [];
  const context = {
    ...extraContext,
    watches,
  };

  const fullCode = [wrapperStart, code, watchCode, wrapperEnd].join("\n");
  return safeEval(fullCode, context);
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
    opacity: 0.4;
    font-size: 0.7rem;
  `
);

interface PlaygroundProps {
  extraContext?: object;
  focusSearch: (event: Event) => void | false;
  initialCode?: string;
  initialWatchExprs?: string[];
  label: string;
  toolComp: FC;
}

const EMPTY = {};

const Playground: FC<PlaygroundProps> = ({
  extraContext = EMPTY,
  focusSearch = noop,
  initialCode = defaultCode,
  initialWatchExprs = defaultWatchExprs,
  label = "Edit your javascript code:",
  toolComp,
}) => {
  const [code, setCode] = usePersistedState(toolComp, "code", initialCode);
  const [watchExprs, setWatchExprs] = usePersistedStateSet<string>(
    toolComp,
    "watchExprs",
    new Set(initialWatchExprs)
  );
  const [watchResults, setWatchResults] = useState<Watch[]>([]);
  const editorRef = useRef<ReactAce>();

  const onValidate: ComponentProps<typeof CodeEditor>["onValidate"] = async (
    newCode
  ) => {
    try {
      await runCode(newCode, extraContext, watchExprs);
      return { value: newCode, error: null };
    } catch (err) {
      return { value: newCode, error: err.message };
    }
  };

  useEffect(() => {
    runCode(code, extraContext, watchExprs)
      .then((context: { watches: Watch[] }) => {
        setWatchResults(context.watches);
      })
      .catch(() => {
        setWatchResults(
          Array.from(watchExprs).map((expr) => ({
            expr,
            value: "?",
            isError: true,
          }))
        );
      });
  }, [code, extraContext, watchExprs]);

  const removeWatch = useCallback(
    (expr: string) => {
      watchExprs.delete(expr);
      setWatchExprs(new Set(watchExprs));
      toast.success("Watch expression removed.");
    },
    [setWatchExprs, watchExprs]
  );

  const addWatch = useCallback(() => {
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
  }, [watchExprs, removeWatch, setWatchExprs]);

  const commands: ComponentProps<typeof CodeEditor>["commands"] = [
    {
      name: "addWatch",
      bindKey: { win: "Ctrl-w", mac: "Ctrl-w" },
      exec: addWatch,
    },
    {
      name: "focusSearch",
      bindKey: { win: "Ctrl-f", mac: "Cmd-f" },
      exec: () => focusSearch(null),
    },
  ];

  return (
    <Splitter vertical={false} defaultSizes={[75, 25]}>
      <SplitterPane paddingSide="right">
        <LabelRow>
          <FieldLabel>{label}</FieldLabel>
          <WatchHelp>Press ^W to add/remove watch.</WatchHelp>
        </LabelRow>
        <CodeEditor
          commands={commands}
          editorRef={editorRef}
          focus={true}
          onValidate={onValidate}
          setState={setCode}
          state={code}
        />
      </SplitterPane>
      <SplitterPane paddingSide="left">
        <FieldLabel>Watches</FieldLabel>
        <WatchList watches={watchResults} onRemove={removeWatch} />
      </SplitterPane>
    </Splitter>
  );
};

export default Playground;
