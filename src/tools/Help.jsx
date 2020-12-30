import React from "react";
import styled from "styled-components";
import { displayName, noop, setToolMeta } from "../utils";
import packageJson from "../../package.json";

const Key = displayName(
  "Key",
  styled.span`
    border-radius: var(--border-radius);
    padding: 0.1rem 0.2rem 0.3rem 0.2rem;
    margin: 0 0.1rem 0 0.2rem;
    background: #999;
    box-shadow: -0.08rem 0.08rem 0 0.08rem #777;
    color: #333;
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

const Count = displayName(
  "Count",
  styled.span`
    font-size: 0.7rem;
    font-weight: 400;
    opacity: 0.2;
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
    &:hover {
      color: var(--link-hover);
    }
  `
);

const ToolDesc = displayName(
  "ToolDesc",
  styled.span`
    opacity: 0.5;
  `
);

const Footer = displayName(
  "Footer",
  styled.p`
    font-size: 0.7rem;
    opacity: 0.2;
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
      <Heading>
        <span>Tools </span>
        <Count>{sortedTools.length}</Count>
      </Heading>
      <ToolList>
        {sortedTools.map((tool) => (
          <ToolItem key={tool.name}>
            <ToolName onClick={() => onSelectTool(tool.name)}>
              {tool.name}
            </ToolName>
            <ToolDesc> — {tool.description}</ToolDesc>
          </ToolItem>
        ))}
      </ToolList>
      <Footer>v{packageJson.version}</Footer>
    </div>
  );
};

setToolMeta(Help, {
  name: "Help",
  description: "Instructions and the list of all the tools.",
});

export default Help;
