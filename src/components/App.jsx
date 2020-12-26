import React, { useRef, useState, useCallback, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHotkeys } from "react-hotkeys-hook";
import hotkeys from "hotkeys-js";
import styled from "styled-components";
import Header from "./Header";
import tools from "../tools";
import { displayName } from "../utils";

hotkeys.filter = function (event) {
  return true;
};

const ToolContainer = displayName(
  "ToolContainer",
  styled.div`
    padding: 1rem;
    user-select: none;
  `
);

const App = () => {
  const searchRef = useRef();
  const [currentToolName, setCurrentToolName] = useState("");
  const [pasted, setPasted] = useState("");

  const focusSearch = useCallback(
    (event) => {
      searchRef.current.focus();
      event?.preventDefault?.();
      return false;
    },
    [searchRef]
  );

  const onSelectTool = useCallback((name) => {
    setCurrentToolName(name);
  }, []);

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
  Tool.displayName = "Tool";

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
        onClick={focusSearch}
      />
      <ToolContainer>
        <Tool
          pasted={pasted}
          focusSearch={focusSearch}
          onSelectTool={onSelectTool}
        />
      </ToolContainer>
    </div>
  );
};

export default App;
