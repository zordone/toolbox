import React, { FC } from "react";
import styled from "styled-components";
import packageJson from "../../../package.json";
import { registerTool, ToolProps, Tools } from "../toolStore";
import { displayName, noop } from "../utils";

const Container = displayName(
  "Container",
  styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
  `
);

const KeyInfo = displayName(
  "KeyInfo",
  styled.p`
    margin: 0 0 1rem;
  `
);

const Key = displayName(
  "Key",
  styled.span`
    border-radius: var(--border-radius);
    padding: 0.1rem 0.2rem 0.3rem;
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
    flex: 1 0 0;
    overflow-y: scroll;
    margin: 0;
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
    margin: 0.2rem 0 0;
  `
);

interface HelpProps extends ToolProps {
  tools: Tools;
}

const Help: FC<HelpProps> = ({ tools, onSelectTool = noop }) => {
  const sortedTools = Object.values(tools)
    .map((tool) => tool.name)
    .sort()
    .map((name) => tools[name]);

  return (
    <Container>
      <KeyInfo>
        Press <Key>esc</Key> or <Key>⌘</Key>
        <Key>F</Key> to search for a tool.
      </KeyInfo>
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
    </Container>
  );
};

registerTool({
  component: Help,
  name: "Help",
  description: "Instructions and the list of all the tools.",
});

export default Help;
