import copyToClipboard from "copy-to-clipboard";
import React, {
  FC,
  Fragment,
  KeyboardEventHandler,
  MouseEventHandler,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { ascii } from "../common/ascii";
import { TextField } from "../fields";
import { usePersistedState } from "../persistedState";
import { registerTool, ToolProps } from "../toolStore";
import { displayName, htmlToText } from "../utils";

const Container = displayName(
  "Container",
  styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  `
);

const Grid = displayName(
  "Grid",
  styled.div`
    --grid-border: #181818;

    display: grid;
    grid-template-columns: 0fr 0fr 0fr 0fr 0fr 0fr 1fr;
    gap: 1px;
    border: 1px solid var(--grid-border);
    background: var(--grid-border);
    max-height: 100%;
    overflow-y: scroll;
    box-sizing: border-box;

    & > * {
      background: var(--main-bg);
      height: 100%;
      align-content: space-around;
      padding: var(--gap-size);
      box-sizing: border-box;
    }
  `
);

const Header = displayName(
  "Header",
  styled.h3`
    margin: 0;
    align-self: center;
    position: sticky;
    top: 0;
    outline: 1px solid var(--grid-border);
    z-index: 1;
  `
);

const Cell = displayName(
  "Cell",
  styled.span`
    cursor: pointer;
    &.char {
      font-family: monospace;
      color: var(--input-fg);
    }
    :hover {
      background: var(--selection);
    }
  `
);

// decimal to hexadecimal number
const hex = (dec: number) => dec.toString(16).padStart(2, "0");

// pre-calculate search terms
const search = ascii.map(([code, char, symbol, number, name, description]) =>
  [symbol, char, code, hex(code), number, name, description]
    .join(" ")
    .toLowerCase()
);

// copy the original character or other cell text
const copyCell = (element: HTMLElement) => {
  const { html, symbol } = element.dataset;
  const copy = html ? htmlToText(html) : element.innerText;
  const show = symbol || JSON.stringify(copy);
  if (!copy) return;
  copyToClipboard(copy);
  toast.success(`${show} copied to clipboard.`);
};

const AsciiTable: FC<ToolProps> = () => {
  const [filter, setFilter] = usePersistedState(AsciiTable, "filter", "");
  const filterLower = filter.toLowerCase();

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (event.code !== "Enter") return;
      const first = document.querySelector<HTMLElement>("span.char");
      if (!first) return;
      copyCell(first);
    },
    []
  );

  const onClick: MouseEventHandler<HTMLDivElement> = useCallback(
    ({ target }) => {
      if (!(target instanceof HTMLElement)) return;
      if (target.tagName !== "SPAN") return;
      copyCell(target);
    },
    []
  );

  return (
    <Container>
      <div>
        <TextField
          autoFocus
          onKeyDown={onKeyDown}
          placeholder="Filter"
          setState={setFilter}
          state={filter}
          type="search"
        />
      </div>
      <Grid onClick={onClick}>
        <Header>Dec</Header>
        <Header>Hex</Header>
        <Header>Symbol / Char</Header>
        <Header>Unicode</Header>
        <Header>HTML Number</Header>
        <Header>HTML Name</Header>
        <Header>Description</Header>
        {ascii
          .filter((_, index) => search[index].includes(filterLower))
          .map(([code /*char*/, , symbol, number, name, desc]) => (
            <Fragment key={code}>
              <Cell>{code}</Cell>
              <Cell>{hex(code)}</Cell>
              <Cell
                className="char"
                dangerouslySetInnerHTML={{
                  __html: symbol || number,
                }}
                data-html={number}
                data-symbol={symbol}
              />
              <Cell>{`\\x${hex(code)}`}</Cell>
              <Cell>{number}</Cell>
              <Cell>{name}</Cell>
              <Cell>{desc}</Cell>
            </Fragment>
          ))}
      </Grid>
    </Container>
  );
};

registerTool({
  component: AsciiTable,
  name: "AsciiTable",
  description: "ASCII table.",
});

export default AsciiTable;
