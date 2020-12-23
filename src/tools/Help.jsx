import React from "react";
import styled from "styled-components";
import { displayName, noop } from "../utils";

const Key = displayName(
  "Key",
  styled.span`
    border-radius: var(--border-radius);
    padding: 0.1rem 0.2rem 0.3rem 0.2rem;
    margin: 0 0.1rem 0 0.2rem;
    background: #999;
    box-shadow: -0.08rem 0.08rem 0 0.08rem #777;
    color: #444;
    min-width: 1rem;
    height: 1rem;
    display: inline-block;
    text-align: center;
  `
);

const Heading = displayName(
  "Heading",
  styled.p`
    margin: 0;
    line-height: 1.5;
    font-size: 1.3rem;
    font-weight: bold;
  `
);

const ToolList = displayName(
  "ToolList",
  styled.ul`
    margin-top: 0;
  `
);

const ToolItem = displayName(
  "ToolItem",
  styled.li`
    line-height: 1.5;
  `
);

const ToolName = displayName(
  "ToolName",
  styled.a`
    font-weight: 700;
    cursor: pointer;
  `
);

const ToolDesc = displayName(
  "ToolDesc",
  styled.span`
    opacity: 0.6;
  `
);

const Help = ({ tools, onSelectTool = noop }) => {
  const sortedTools = Object.values(tools)
    .map((tool) => tool.name)
    .sort()
    .map((name) => tools[name]);

  return (
    <div>
      <p>
        Press <Key>esc</Key> or <Key>⌘</Key>
        <Key>F</Key> to search for a tool.
      </p>
      <Heading>Tools</Heading>
      <ToolList>
        {sortedTools.map((tool) => (
          <ToolItem key={tool.name}>
            <ToolName onClick={() => onSelectTool(tool.name)}>
              {tool.name}
            </ToolName>
            <ToolDesc> - {tool.description}</ToolDesc>
          </ToolItem>
        ))}
      </ToolList>
    </div>
  );
};

export default Help;
