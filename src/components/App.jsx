import React, { useRef, useState, useCallback, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHotkeys } from "react-hotkeys-hook";
import hotkeys from "hotkeys-js";
import styled from "styled-components";
import Header from "./Header";
import tools from "../tools";
import { displayName, setToolMeta } from "../utils";
import { usePersistedState } from "../persistedState";

hotkeys.filter = function (event) {
  return true;
};

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
  const searchRef = useRef();
  const [currentToolName, setCurrentToolName] = usePersistedState(
    App,
    "tool",
    ""
  );

  const [pasted, setPasted] = useState("");
  const [reload, setReload] = useState(0);

  const focusSearch = useCallback(
    (event) => {
      searchRef.current.focus();
      event?.preventDefault?.();
      return false;
    },
    [searchRef]
  );

  const onSelectTool = useCallback(
    (name) => {
      setCurrentToolName(name);
      setReload(0);
    },
    [setCurrentToolName]
  );

  const onReloadTool = useCallback(() => {
    setReload(reload + 1);
  }, [reload]);

  const onPaste = useCallback((event) => {
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
        position="bottom-center"
        autoClose={2000}
        pauseOnFocusLoss={false}
      />
      <Header
        searchRef={searchRef}
        tools={tools}
        currentToolName={tool.name}
        onSelectTool={onSelectTool}
        onReloadTool={onReloadTool}
        onTitleClick={focusSearch}
      />
      <ToolContainer>
        <Tool
          key={`${tool.name}-${reload}`}
          pasted={pasted}
          focusSearch={focusSearch}
          onSelectTool={onSelectTool}
        />
      </ToolContainer>
    </div>
  );
};

// only needed for usePersistedState. App isn't added to the tools array.
setToolMeta(App, { name: "App", description: "Root app component" });

export default App;
