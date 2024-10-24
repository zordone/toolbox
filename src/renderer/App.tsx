import hotkeys from "hotkeys-js";
import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { usePersistedState } from "./persistedState";
import tools from "./tools";
import { displayName } from "./utils";
import Header from "./common/Header";

hotkeys.filter = () => true;

const ToolContainer = displayName(
  "ToolContainer",
  styled.div`
    padding: 1rem;
    user-select: none;
    overflow-y: hidden;
    box-sizing: border-box;
  `
);

const App = () => {
  const searchRef = useRef<HTMLInputElement>();
  const [currentToolName, setCurrentToolName] = usePersistedState(
    App,
    "tool",
    ""
  );

  const [pasted, setPasted] = useState("");
  const [reload, setReload] = useState(0);

  const focusSearch = useCallback(
    (event: MouseEvent | Event | null) => {
      searchRef.current.focus();
      event?.preventDefault?.();
      return false;
    },
    [searchRef]
  );

  const onSelectTool = useCallback(
    (name: string) => {
      setCurrentToolName(name);
      setReload(0);
    },
    [setCurrentToolName]
  );

  const onReloadTool = useCallback(() => {
    setReload(reload + 1);
  }, [reload]);

  const onPaste = useCallback((event: ClipboardEvent) => {
    const text = event.clipboardData.getData("Text") || "";
    if (text) {
      setPasted(text);
      setTimeout(() => setPasted(null), 0);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [onPaste]);

  useHotkeys("cmd+f,esc", focusSearch);

  const tool = tools[currentToolName] || tools.Help;
  const Tool = tool.component;

  return (
    <div className="App">
      <ToastContainer
        autoClose={2000}
        pauseOnFocusLoss={false}
        position="bottom-center"
      />
      <Header
        currentToolName={tool.name}
        onReloadTool={onReloadTool}
        onSelectTool={onSelectTool}
        onTitleClick={focusSearch}
        searchRef={searchRef}
        tools={tools}
      />
      <ToolContainer>
        <Tool
          focusSearch={focusSearch}
          key={`${tool.name}-${reload}`}
          onSelectTool={onSelectTool}
          pasted={pasted}
        />
      </ToolContainer>
    </div>
  );
};

// needed for usePersistedState!
App.displayName = "App";

export default App;
