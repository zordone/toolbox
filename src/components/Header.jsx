import React from "react";
import styled from "styled-components";
import logoPng from "../logo.png";
import { displayName, noop } from "../utils";
import Search from "./Search";

const TITLE_OPACITY = 0.2;

const Container = displayName(
  "Container",
  styled.div`
    display: flex;
    background: var(--header-bg);
    align-items: center;
    user-select: none;
    font-size: 1.6rem;
    font-weight: bold;
  `
);

const Logo = displayName(
  "Logo",
  styled.img`
    padding: 0.5rem;
    width: 2.5rem;
    height: auto;
    opacity: 0.7;
  `
);

const Title = displayName(
  "Title",
  styled.h1`
    display: inline-block;
    margin: 0;
    font: inherit;
    opacity: ${TITLE_OPACITY};
  `
);

const Header = ({
  searchRef,
  tools,
  currentToolName,
  onSelectTool = noop,
  onClick = noop,
}) => {
  return (
    <Container onClick={onClick}>
      <Logo src={logoPng} />
      <Title>Toolbox/</Title>
      <Search
        searchRef={searchRef}
        tools={tools}
        currentToolName={currentToolName}
        onSelectTool={onSelectTool}
      />
    </Container>
  );
};

export default Header;
