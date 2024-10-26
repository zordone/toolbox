import FuzzySearch from "fuzzy-search";
import React, {
  ChangeEventHandler,
  FC,
  KeyboardEventHandler,
  MutableRefObject,
  useCallback,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import { Tool, Tools } from "../toolStore";
import { displayName, noop, preventDefault } from "../utils";
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

interface SearchInputProps {
  $isOk: boolean;
}

const SearchInput = displayName(
  "SearchInput",
  styled.input.attrs(() => ({
    type: "text",
    spellCheck: false,
  }))<SearchInputProps>`
    display: block;
    box-sizing: border-box;
    width: 100%;
    background: inherit;
    border: none;
    outline: none;
    color: ${({ $isOk }) => ($isOk ? "inherit" : "var(--error-fg)")};
    padding: 0.2rem;
    font: inherit;
  `
);

interface SearchOptionsProps {
  $isVisible: boolean;
}

const SearchOptions = displayName(
  "SearchOptions",
  styled.div<SearchOptionsProps>`
    ${cssShadow}
    position: absolute;
    z-index: 2;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--modal-bg);
    display: ${({ $isVisible }) => ($isVisible ? "block" : "none")};
    font-weight: 400;
    padding: 0.5rem 0;
    border-radius: var(--border-radius);
    max-height: calc(100vh - 5rem);
    overflow-y: scroll;
  `
);

interface SearchOptionProps {
  $isSelected: boolean;
}

const SearchOption = displayName(
  "SearchOption",
  styled.div<SearchOptionProps>`
    font-size: 1rem;
    padding: 0.2rem 1rem;
    background: ${({ $isSelected }) =>
      $isSelected ? "var(--selection)" : "none"};
    cursor: pointer;
  `
);

const SearchOptionName = displayName("SearchOptionName", styled.div({}));

const SearchOptionDesc = displayName(
  "SearchOptionDesc",
  styled.div`
    font-size: 0.7rem;
    opacity: 0.5;
    margin-top: -0.2rem;
  `
);

interface SearchProps {
  currentToolName: string;
  onSelectTool: (name: string) => void;
  searchRef: MutableRefObject<HTMLInputElement>;
  tools: Tools;
}

const Search: FC<SearchProps> = ({
  currentToolName,
  onSelectTool = noop,
  searchRef,
  tools,
}) => {
  const [value, setValue] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [searcher, setSearcher] = useState<FuzzySearch<Tool>>();
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

  const onInput: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const newValue = event.target.value;
      if (newValue !== value) {
        setValue(newValue);
      }
    },
    [setValue, value]
  );

  const handleKey = useCallback(
    (key: string) => {
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

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => handleKey(event.key),
    [handleKey]
  );

  const onOptionClick = useCallback(() => handleKey("Enter"), [handleKey]);

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
        $isOk={!value || Boolean(filtered.length)}
        onBlur={onBlur}
        onFocus={onFocus}
        onInput={onInput}
        onKeyDown={onKeyDown}
        ref={searchRef}
        value={value}
      />
      <SearchOptions $isVisible={isFocused && Boolean(filtered.length)}>
        {filtered.map(({ name, description }, optIndex) => (
          <SearchOption
            $isSelected={optIndex === index}
            key={name}
            onClick={onOptionClick}
            // TODO: workaround to make onClick work. why??
            onMouseDown={preventDefault}
            onMouseEnter={() => setIndex(optIndex)}
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
