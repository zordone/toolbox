import React, { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { CopyButton, PasteButton } from "../common/Buttons";
import { Footer } from "../common/Footer";
import { Unit } from "../common/Unit";
import { Value } from "../common/Value";
import { FieldLabel } from "../fields";
import { usePersistedState } from "../persistedState";
import { registerTool, ToolProps } from "../toolStore";
import { displayName, reindent } from "../utils";
import { DiffEditor, loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import type { editor } from "monaco-editor";

monaco.editor.defineTheme("custom", {
  base: "vs-dark",
  inherit: true,
  rules: [],
  colors: {
    "diffEditor.diagonalFill": "#BBBBBB20",
    "diffEditor.insertedLineBackground": "#9CCC2C18",
    "diffEditor.insertedTextBackground": "#9CCC2C40",
    "diffEditor.removedLineBackground": "#FF000018",
    "diffEditor.removedTextBackground": "#FF000040",
    "editor.background": "#181818", // --input-bg
    "editor.wordHighlightTextBackground": "#00000000",
    "editorCursor.foreground": "#00C3FF", // --input-fg
    "editorLineNumber.activeForeground": "#FFFFFF20",
    "editorLineNumber.foreground": "#FFFFFF20",
    "menu.separatorBackground": "#60606040",
    "scrollbar.shadow": "#00000000",
  },
});

loader.config({ monaco });

const initialBefore = reindent(`
  One
  Twooo
  Three
  Four
  Six
  Seven
  Seven
  Seven
  Eight
  Nine
  Ten
  ---
  hello world
`);

const initialAfter = reindent(`
  One
  Two
  Three
  Four
  Five
  Six
  Seven
  Eight
  Nine
  Ten
  ---
  Hello World!
`);

const monacoOptions: monaco.editor.IDiffEditorConstructionOptions = {
  fontSize: 16,
  minimap: { enabled: false },
  originalEditable: true,
  parameterHints: { enabled: false },
  quickSuggestions: false,
  scrollBeyondLastLine: false,
  suggestOnTriggerCharacters: false,
  renderSideBySideInlineBreakpoint: 0,
  cursorWidth: 2,
  glyphMargin: true,
  lineDecorationsWidth: 20,
};

const Container = displayName(
  "Container",
  styled.div`
    display: grid;
    grid-template:
      "header" 0fr
      "editor" 1fr
      / 1fr;
    gap: var(--gap-size);
    overflow: hidden;
    height: 100%;

    /* transparent gutter to make it look like two editors */
    & .monaco-diff-editor .gutter {
      background: transparent;
    }

    /* don't highlight the current line */
    & .monaco-editor .view-overlays .current-line-exact {
      border: none;
    }

    /* imitate the border radius of our own inputs */
    & .monaco-editor,
    & .monaco-editor .overflow-guard {
      border-radius: var(--border-radius);
    }
  `
);

interface HeaderProps {
  $leftWidthPx?: number | null;
}

const Header = displayName(
  "Header",
  styled.div<HeaderProps>`
    display: grid;
    grid-template-columns: ${({ $leftWidthPx }) =>
      $leftWidthPx ? `${$leftWidthPx}px 1fr` : "1fr 1fr"};
    gap: var(--gap-size);
  `
);

const PaneHeader = displayName(
  "PaneHeader",
  styled.div`
    display: flex;
    align-items: center;
    gap: var(--gap-size);
  `
);

const Diff: FC<ToolProps> = () => {
  const [before, setBefore] = usePersistedState(Diff, "before", initialBefore);
  const [after, setAfter] = usePersistedState(Diff, "after", initialAfter);
  const editorRef = useRef<editor.IStandaloneDiffEditor | null>(null);
  const [leftWidthPx, setLeftWidthPx] = useState<number | null>(null);
  const [diffCount, setDiffCount] = useState<number>(0);

  // Stable initial values: passed to DiffEditor only on mount so that
  // @monaco-editor/react never calls model.setValue() during typing
  // (it does so unconditionally whenever the `original`/`modified` props change).
  const stableOriginal = useRef(before);
  const stableModified = useRef(after);

  // Last values Monaco reported back to us, used to tell user edits
  // (Monaco → state) apart from external changes (paste → Monaco).
  const syncedBefore = useRef(before);
  const syncedAfter = useRef(after);

  // Push external state changes (paste) into Monaco without touching
  // the `original`/`modified` props (which would reset the cursor).
  useEffect(() => {
    if (before !== syncedBefore.current) {
      syncedBefore.current = before;
      editorRef.current?.getOriginalEditor().setValue(before);
    }
  }, [before]);

  useEffect(() => {
    if (after !== syncedAfter.current) {
      syncedAfter.current = after;
      editorRef.current?.getModifiedEditor().setValue(after);
    }
  }, [after]);

  return (
    <Container>
      <Header $leftWidthPx={leftWidthPx}>
        <PaneHeader>
          <FieldLabel style={{ flexGrow: 1 }}>Before</FieldLabel>
          <CopyButton name="before" state={before} />
          <PasteButton name="before" setState={setBefore} />
        </PaneHeader>
        <PaneHeader>
          <FieldLabel style={{ flexGrow: 1, marginLeft: "25px" }}>
            After
          </FieldLabel>
          <CopyButton name="after" state={after} />
          <PasteButton name="after" setState={setAfter} />
        </PaneHeader>
      </Header>
      <DiffEditor
        language="plaintext"
        modified={stableModified.current}
        options={monacoOptions}
        original={stableOriginal.current}
        theme="custom"
        onMount={(editor) => {
          editorRef.current = editor;
          const syncWidth = () =>
            setLeftWidthPx(editor.getOriginalEditor().getLayoutInfo().width);
          editor.getOriginalEditor().onDidLayoutChange(syncWidth);
          syncWidth();
          editor.onDidUpdateDiff(() =>
            setDiffCount(editor.getLineChanges()?.length ?? 0)
          );
          editor.getOriginalEditor().onDidChangeModelContent(() => {
            const value = editor.getOriginalEditor().getValue();
            syncedBefore.current = value;
            setBefore(value);
          });
          editor.getModifiedEditor().onDidChangeModelContent(() => {
            const value = editor.getModifiedEditor().getValue();
            syncedAfter.current = value;
            setAfter(value);
          });
        }}
      />
      <Footer>
        <Value>{diffCount}</Value>
        <Unit> difference{diffCount === 1 ? "" : "s"} found.</Unit>
      </Footer>
    </Container>
  );
};

registerTool({
  component: Diff,
  name: "Diff",
  description: "Text comparator and diff visualizer.",
});
