import React, { FC, useCallback, useState } from "react";
import styled from "styled-components";
import TextAnalyzer from "../templates/TextAnalyzer";
import { Unit } from "../common/Unit";
import { Value } from "../common/Value";
import { registerTool, ToolProps } from "../toolStore";
import { displayName, reindent } from "../utils";

interface Item {
  category: string;
  day: string;
  hours: string;
  ticket: "Ticket" | "Other";
}

type Grouped = Record<string, number>;

const initialText = reindent(`
  01:
  0.50 - MAI: meeting 
  1.25 - RND: other meeting
  1.00 - RND: ONEWEB-1234 - Player bug (fixed the thing)
  
  02:
  1.50 - MAI: standup
  3.25 - RND: ONEWEB-5678 - Release (released the thing)
  0.75 - RND: ONEWEB-1212 - Logo fix (fixed the logo) 
`);

const reAllHours = /^\d{1,2}\.\d{2}\b/gm;
const reEol = /[\n\r]+/;
const reDay = /^(\d\d):$/;
const reLine = /^(\d{1,2}\.\d{2}) - (\w+): (.*)$/;
const reTicket = /[A-Z]{3,8}-\d+/;
const reTicketTimeDetails = /^(\d{1,2}\.\d{2}) - \w+: ([A-Z]{3,}-\d+)/;
const reTicketTimeComment = /\(([^()]*)\)\s*$/;

const convertToYouTrack = (text: string) => {
  const lines = text.split("\n").map((line) => {
    const detailsMatch = reTicketTimeDetails.exec(line);
    if (!detailsMatch) return "";
    const [_, hours, ticket] = detailsMatch;
    const comment = reTicketTimeComment.exec(line)?.[1] ?? "";
    const [whole, partial] = hours.split(".").map(Number);
    const parts = [];
    if (whole) parts.push(`${whole}h`);
    if (partial) parts.push(`${(partial / 100) * 60}m`);
    const time = parts.join(" ");
    return `${ticket}: work Development Today ${time} ${comment}`.trim();
  });
  return text + "\n\nYouTrack:\n" + lines.filter(Boolean).join("\n");
};

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
    .map(Number.parseFloat)
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
  `
);

const RowTitle = displayName(
  "RowTitle",
  styled.div`
    margin-top: 1rem;
    margin-bottom: 0.2rem;
    font-size: 0.8rem;
    opacity: 0.5;
  `
);

const Row = displayName(
  "Row",
  styled.div`
    font-size: 0.9rem;
  `
);

const Key = displayName(
  "Key",
  styled.span`
    opacity: 0.5;
  `
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
        <Key key={`key-${group}`}>{group}:&nbsp;</Key>,
        <Value key={`val-${group}`} $small>
          {hours.toFixed(2)}
        </Value>,
        <Unit key={`uni-${group}`}>h&nbsp;&nbsp;&nbsp;</Unit>,
      ])}
    </Row>
  </>
);

const KimbleCalculator: FC<ToolProps> = (props) => {
  const [itemsByDay, setItemsByDay] = useState<Grouped>({});
  const [itemsByCat, setItemsByCat] = useState<Grouped>({});
  const [itemsByTicket, setItemsByTicket] = useState<Grouped>({});

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
      const ticket = reTicket.exec(line) ? "Ticket" : "Other";
      if (day && hours && category) {
        items.push({ day, hours, category, ticket });
      }
    });
    setItemsByDay(sumHoursBy(items, "day"));
    setItemsByCat(sumHoursBy(items, "category"));
    setItemsByTicket(sumHoursBy(items, "ticket"));

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
        transforms={[
          {
            icon: "fa-stopwatch",
            title: "Convert to YouTrack time tracking",
            transform: convertToYouTrack,
          },
        ]}
        {...props}
      />
      <GroupedSection groupedData={itemsByDay} title="Days" />
      <GroupedSection groupedData={itemsByCat} title="Categories" />
      <GroupedSection groupedData={itemsByTicket} title="Tickets" />
    </Grid>
  );
};

registerTool({
  component: KimbleCalculator,
  name: "KimbleCalculator",
  description: "Kimble time log calculator.",
});
