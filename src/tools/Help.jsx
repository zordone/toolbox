import React from "react";
import styled from "styled-components";
import { displayName } from "../utils";

const Key = displayName(
  "Key",
  styled.span`
    border-radius: var(--border-radius);
    padding: 0.1rem 0.2rem 0.3rem 0.2rem;
    margin: 0 0.1rem 0 0.2rem;
    background: #999;
    box-shadow: -0.08rem 0.08rem 0 0.08rem #777;
    color: #444;
    width: 1rem;
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

const Help = ({ tools }) => {
  const sortedTools = Object.values(tools)
    .map((tool) => tool.name)
    .sort()
    .map((name) => tools[name]);

  return (
    <div>
      <p>
        Press <Key>⌘</Key>+<Key>F</Key> to search for a tool.
      </p>
      <Heading>Tools</Heading>
      <ToolList>
        {sortedTools.map((tool) => (
          <ToolItem key={tool.name}>
            <strong>{tool.name}</strong> - {tool.description}
          </ToolItem>
        ))}
      </ToolList>
    </div>
  );
};

export default Help;
