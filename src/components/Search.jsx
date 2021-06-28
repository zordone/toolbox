import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import FuzzySearch from "fuzzy-search";
import { displayName, noop } from "../utils";
import { cssShadow } from "./styledCss";

const MAX_OPTIONS = 10;

const SearchContainer = displayName(
  "SearchContainer",
  styled.div`
    position: relative;
    box-sizing: border-box;
    flex-grow: 1;
    margin-right: 1rem;
    background: inherit;
    font: inherit;
  `
);

const SearchInput = displayName(
  "SearchInput",
  styled.input.attrs(() => ({
    type: "text",
    spellCheck: false,
  }))`
    display: block;
    box-sizing: border-box;
    width: 100%;
    background: inherit;
    border: none;
    outline: none;
    color: ${({ isOk }) => (isOk ? "inherit" : "var(--error-fg)")};
    padding: 0.2rem;
    font: inherit;
  `
);

const SearchOptions = displayName(
  "SearchOptions",
  styled.div`
    ${cssShadow}
    position: absolute;
    z-index: 1;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--modal-bg);
    display: ${({ isVisible }) => (isVisible ? "block" : "none")};
    font-weight: 400;
    padding: 0.5rem 0;
    border-radius: var(--border-radius);
    max-height: calc(100vh - 5rem);
    overflow-y: scroll;
  `
);

const SearchOption = displayName(
  "SearchOption",
  styled.div`
    font-size: 1rem;
    padding: 0.2rem 1rem;
    background: ${({ isSelected }) =>
      isSelected ? "var(--selection)" : "none"};
    cursor: pointer;
  `
);

const SearchOptionName = displayName("SearchOptionName", styled.div``);

const SearchOptionDesc = displayName(
  "SearchOptionDesc",
  styled.div`
    font-size: 0.7rem;
    opacity: 0.5;
    margin-top: -0.2rem;
  `
);

const Search = ({ searchRef, tools, currentToolName, onSelectTool = noop }) => {
  const [value, setValue] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [searcher, setSearcher] = useState();
  const [index, setIndex] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const onFocus = useCallback(() => {
    setIsFocused(true);
    setValue("");
    setFiltered([]);
  }, [setIsFocused]);

  const onBlur = useCallback(() => {
    setIsFocused(false);
  }, [setIsFocused]);

  const onInput = useCallback(
    (event) => {
      const newValue = event.target.value;
      if (newValue !== value) {
        setValue(newValue);
      }
    },
    [setValue, value]
  );

  const onKeyDown = useCallback(
    (event) => {
      const { key } = event;
      if (key === "ArrowUp") {
        setIndex(Math.max(0, index - 1));
        event.preventDefault();
        return;
      }
      if (key === "ArrowDown") {
        setIndex(Math.min(index + 1, filtered.length - 1));
        event.preventDefault();
        return;
      }
      if (key === "Enter" && filtered.length > index) {
        const toolName = filtered[index].name;
        setValue(toolName);
        onSelectTool(toolName);
        setTimeout(() => searchRef.current?.blur(), 0);
        return;
      }
      if (key === "Escape" || key === "Tab") {
        setValue(currentToolName);
        searchRef.current?.blur();
        event.stopPropagation();
        event.preventDefault();
        return;
      }
    },
    [index, filtered, searchRef, currentToolName, onSelectTool]
  );

  const onOptionClick = useCallback(() => {
    onKeyDown({ key: "Enter" });
  }, [onKeyDown]);

  // creates a searcher when tools changes
  useEffect(() => {
    setSearcher(
      new FuzzySearch(Object.values(tools), ["name", "description"], {
        caseSensitive: false,
        sort: true,
      })
    );
  }, [tools]);

  // filters tools when search term changes
  useEffect(() => {
    const term = value.trim();
    if (!term) {
      setFiltered([]);
      setIndex(null);
      return;
    }
    const matches = searcher
      .search(term)
      .sort((a, b) => {
        // if the name starts exactly with the term, sort it to the top
        const aExact = Number(a.name.toLowerCase().startsWith(term));
        const bExact = Number(b.name.toLowerCase().startsWith(term));
        return bExact - aExact;
      })
      .slice(0, MAX_OPTIONS);
    setFiltered(matches);
    setIndex(0);
  }, [value, tools, searcher]);

  // updates value when current tool changes
  useEffect(() => {
    if (!isFocused && currentToolName !== value) {
      setValue(currentToolName);
    }
  }, [isFocused, currentToolName, value]);

  return (
    <SearchContainer>
      <SearchInput
        ref={searchRef}
        value={value}
        onInput={onInput}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        isOk={!value || filtered.length}
      />
      <SearchOptions isVisible={isFocused && filtered.length}>
        {filtered.map(({ name, description }, optIndex) => (
          <SearchOption
            key={name}
            isSelected={optIndex === index}
            onMouseEnter={() => setIndex(optIndex)}
            onMouseDown={(event) => {
              // TODO: workaround to make onClick work. why??
              event.preventDefault();
            }}
            onClick={onOptionClick}
          >
            <SearchOptionName>{name}</SearchOptionName>
            <SearchOptionDesc>{description}</SearchOptionDesc>
          </SearchOption>
        ))}
      </SearchOptions>
    </SearchContainer>
  );
};

export default Search;
