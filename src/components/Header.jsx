import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import logoPng from "../logo.png";
import { displayName } from "../utils";

const TITLE_OPACITY = 0.3;

const Container = displayName(
  "Container",
  styled.div`
    display: flex;
    background: var(--header-bg);
    align-items: center;
    user-select: none;
    font-size: 2rem;
    font-weight: bold;
  `
);

const Logo = displayName(
  "Logo",
  styled.img`
    padding: 0.5rem;
    width: 3rem;
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

const Separator = displayName(
  "Separator",
  styled.div`
    font: inherit;
    font-size: 3rem;
    margin: 0 0.1rem 0.3rem 0.05em;
    opacity: ${TITLE_OPACITY / 3};
  `
);

const Value = displayName(
  "Value",
  styled.div`
    font: inherit;
    color: ${({ isOk }) => (isOk ? "inherit" : "#f005")};
  `
);

const Completion = displayName(
  "Completion",
  styled.div`
    font: inherit;
    opacity: ${TITLE_OPACITY};
  `
);

const Search = displayName(
  "Search",
  styled.input`
    position: absolute;
    top: -10rem;
    background: transparent;
    color: inherit;
    font: inherit;
    border: none;
    outline: none;
    margin: 0;
  `
);

const cursorBlinking = keyframes`
  0% { opacity: 1; }
  45% { opacity: 1; }
  50% { opacity: 0; }
  95% { opacity: 0; }
`;

const Cursor = displayName(
  "Cursor",
  styled.div`
    width: 1px;
    background: currentColor;
    height: 2rem;
    animation-name: ${cursorBlinking};
    animation-duration: 1s;
    animation-iteration-count: infinite;
  `
);

const Header = ({ searchRef, tools, onSelectTool, onClick }) => {
  const [value, setValue] = useState("");
  const [completion, setCompletion] = useState("");
  const [cursor, setCursor] = useState(false);
  const [isOk, setIsOk] = useState(false);

  const onInput = (event) => {
    const value = event.target.value.toLowerCase().trim();
    if (!value) {
      setValue("");
      setCompletion("");
      setIsOk(true);
      return;
    }
    const matches = Object.values(tools)
      .filter((tool) => tool.name.toLowerCase().startsWith(value))
      .map((tool) => tool.name)
      .sort();
    if (matches.length) {
      const match = matches[0];
      setValue(match.slice(0, value.length));
      setCompletion(match.slice(value.length));
      setIsOk(true);
      return;
    }
    setValue(value);
    setCompletion("");
    setIsOk(false);
  };

  const onFocus = () => {
    searchRef.current.value = "";
    setValue("");
    setCursor(true);
  };
  const onBlur = () => setCursor(false);

  const onKeyPress = (event) => {
    if (event.key === "Enter" && isOk && value) {
      const completed = value + completion;
      setValue(completed);
      setCompletion("");
      onSelectTool(completed);
      searchRef.current.value = "";
      searchRef.current.blur();
    }
  };

  return (
    <Container onClick={onClick}>
      <Logo src={logoPng} />
      <Title>Toolbox</Title>
      <Separator children="/" />
      <Value isOk={isOk}>{value}</Value>
      {cursor && <Cursor />}
      <Completion>{completion}</Completion>
      <Search
        ref={searchRef}
        onInput={onInput}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
      />
    </Container>
  );
};

export default Header;
