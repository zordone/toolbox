import React, {
  FC,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  useCallback,
} from "react";
import styled from "styled-components";
import { cssFocusStyle, CssFocusStyleProps } from "../common/styledCss";
import { TextField } from "../fields";
import { usePersistedState } from "../persistedState";
import { ToolProps } from "../toolStore";
import { displayName } from "../utils";

const Container = displayName(
  "Container",
  styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  `,
);

interface GridProps extends CssFocusStyleProps {
  $colWidths: number[];
}

const Grid = displayName(
  "Grid",
  styled.div<GridProps>`
    --grid-border: #181818;

    display: grid;
    grid-template-columns: ${({ $colWidths }) =>
      $colWidths.map((w) => w + "fr").join(" ")};
    gap: 1px;
    border: 1px solid var(--grid-border);
    border-radius: var(--border-radius);
    background: var(--grid-border);
    max-height: 100%;
    overflow-y: scroll;
    box-sizing: border-box;

    ${cssFocusStyle};

    & > * {
      background: var(--main-bg);
      height: 100%;
      align-content: space-around;
      padding: var(--gap-size);
      box-sizing: border-box;
    }
  `,
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
    font-size: 0.8rem;
    text-wrap: nowrap;
  `,
);

const Cell = displayName(
  "Cell",
  styled.span`
    cursor: pointer;

    &:hover {
      background: var(--selection);
    }
  `,
);

interface TableProps {
  colWidths: number[];
  headers: string[];
  onCellClick?: (row: number, col: number) => void;
  onRowEnter?: (row: number) => void;
  rows: (string | ReactNode)[][];
  search: string[];
  tool: React.FC<ToolProps>;
}

export const Table: FC<TableProps> = ({
  colWidths,
  headers,
  onCellClick,
  onRowEnter,
  rows,
  search,
  tool,
}) => {
  const [filter, setFilter] = usePersistedState(tool, "filter", "");
  const filterLower = filter.toLowerCase();

  const onClick: MouseEventHandler<HTMLElement> = useCallback(
    (event) => {
      if (!(event.target instanceof HTMLElement)) return;
      const cell = event.target.classList.contains("cell")
        ? event.target
        : event.target.closest("span.cell");
      if (!(cell instanceof HTMLElement)) return;
      const { row, col } = cell.dataset;
      if (!row || !col) return;
      onCellClick?.(Number(row), Number(col));
    },
    [onCellClick],
  );

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (event.code !== "Enter") return;
      const first = document.querySelector<HTMLElement>("span.cell");
      if (!(first instanceof HTMLElement)) return;
      const { row } = first.dataset;
      if (!row) return;
      onRowEnter?.(Number(row));
    },
    [onRowEnter],
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
      <Grid onClick={onClick} $colWidths={colWidths}>
        {headers.map((header) => (
          <Header key={header} className="header">
            {header}
          </Header>
        ))}

        {rows.flatMap((cells, rowIndex) => {
          if (!search[rowIndex].includes(filterLower)) {
            return undefined;
          }
          return cells.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex},${colIndex}`}
              data-row={rowIndex}
              data-col={colIndex}
              className="cell"
            >
              {cell}
            </Cell>
          ));
        })}
      </Grid>
    </Container>
  );
};
