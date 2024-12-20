import React, { FC, useCallback, useState } from "react";
import styled from "styled-components";
import TextAnalyzer from "../templates/TextAnalyzer";
import { registerTool, ToolProps } from "../toolStore";
import { displayName, reindent } from "../utils";

interface Item {
  category: string;
  day: string;
  hours: string;
}

type Grouped = Record<string, number>;

const initialText = reindent(`
  01:
  0.50 - OTT: something
  1.25 - ONE: other thing

  02:
  1.50 - OTT: something else
  3.25 - ONE: yet another thing
`);

const reAllHours = /^\d{1,2}\.\d{2}\b/gm;
const reEol = /[\n\r]+/;
const reDay = /^(\d\d):$/;
const reLine = /^(\d{1,2}\.\d{2}) - (\w+):\s*(.*)$/;

// TODO: switch to Object.groupBy as soon as forge & electron upgrades to a more recent ECMAScript spec
const groupBy = (items: Item[], key: keyof Item): Record<string, Item[]> => {
  const result: Record<string, Item[]> = {};
  items.forEach((item) => {
    const group = item[key];
    result[group] ??= [];
    result[group].push(item);
  });
  return result;
};

const sumHours = (hours: string[]): number =>
  hours
    .map(parseFloat)
    .filter(Boolean)
    .reduce((sum, item) => sum + item, 0);

const sumHoursBy = (collection: Item[], key: keyof Item): Grouped => {
  const grouped = groupBy(collection, key);
  const result: Grouped = {};
  Object.keys(grouped).forEach((key) => {
    result[key] = sumHours(grouped[key].map(({ hours }) => hours));
  });
  return result;
};

const Grid = displayName(
  "Grid",
  styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    height: 100%;
  `,
);

const RowTitle = displayName(
  "RowTitle",
  styled.div`
    margin-top: 1rem;
    margin-bottom: 0.2rem;
    font-size: 0.8rem;
    opacity: 0.5;
  `,
);

const Row = displayName(
  "Row",
  styled.div`
    font-size: 0.9rem;
  `,
);

const Key = displayName(
  "Key",
  styled.span`
    opacity: 0.5;
  `,
);

const Value = displayName(
  "Value",
  styled.span`
    font-weight: 700;
  `,
);

interface UnitProps {
  $gap?: boolean;
}

const Unit = displayName(
  "Unit",
  styled.span<UnitProps>`
    margin-right: ${({ $gap }) => ($gap ? 0.8 : 0.3)}rem;
    opacity: 0.5;
  `,
);

interface GroupedSectionProps {
  groupedData: Grouped;
  title: string;
}

const GroupedSection: FC<GroupedSectionProps> = ({ groupedData, title }) => (
  <>
    <RowTitle key="foo">{title}</RowTitle>
    <Row>
      {Object.entries(groupedData).map(([group, hours]) => [
        <Key key={`key-${group}`}>{group}</Key>,
        <Unit key={`sep-${group}`}>:</Unit>,
        <Value key={`val-${group}`}>{hours.toFixed(2)}</Value>,
        <Unit key={`uni-${group}`} $gap>
          h
        </Unit>,
      ])}
    </Row>
  </>
);

const KimbleCalculator: FC<ToolProps> = (props) => {
  const [itemsByDay, setItemsByDay] = useState({});
  const [itemsByCat, setItemsByCat] = useState({});

  const analyze = useCallback((text: string) => {
    // get total hours
    const sum = sumHours(text.match(reAllHours) ?? []);

    // get hours grouped by day and category
    let day = "?";
    const items: Item[] = [];
    text.split(reEol).forEach((line) => {
      const [, newDay] = reDay.exec(line) ?? [];
      if (newDay) {
        day = newDay;
      }
      const [, hours, category] = reLine.exec(line) ?? [];
      if (day && hours && category) {
        items.push({ day, hours, category });
      }
    });
    setItemsByDay(sumHoursBy(items, "day"));
    setItemsByCat(sumHoursBy(items, "category"));

    // analyzer results
    return [
      {
        title: "Total time logged",
        value: sum.toFixed(2),
        unit: "h in total,",
      },
      {
        title: "Hours left from the daily 8h",
        value: (8 - sum).toFixed(2),
        unit: "h to go today,",
      },
      {
        title: "Hours left from the weekly 40h",
        value: (40 - sum).toFixed(2),
        unit: "h to go this week.",
      },
    ];
  }, []);

  return (
    <Grid>
      <TextAnalyzer
        initialText={initialText}
        label="Paste the Kimble time log here"
        name="kimble log"
        onUpdateResults={analyze}
        toolComp={KimbleCalculator}
        {...props}
      />
      <GroupedSection groupedData={itemsByDay} title="Hours per day" />
      <GroupedSection groupedData={itemsByCat} title="Hours per category" />
    </Grid>
  );
};

registerTool({
  component: KimbleCalculator,
  name: "KimbleCalculator",
  description: "Kimble time log calculator.",
});
