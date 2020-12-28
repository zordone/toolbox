import React, { useState, useCallback } from "react";
import styled from "styled-components";
import _ from "lodash";
import TextAnalyzer from "../components/TextAnalyzer";
import { reindent } from "../utils";
import { displayName } from "../utils";

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

const sumHours = (hours) =>
  hours
    .map(parseFloat)
    .filter(Boolean)
    .reduce((sum, item) => sum + item, 0);

const sumHoursBy = (collecion, key) => {
  const grouped = _.groupBy(collecion, key);
  Object.keys(grouped).forEach((key) => {
    grouped[key] = sumHours(grouped[key].map(({ hours }) => hours));
  });
  return grouped;
};

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

const Value = displayName(
  "Value",
  styled.span`
    font-weight: 700;
  `
);

const Unit = displayName(
  "Unit",
  styled.span`
    margin-right: ${({ gap }) => (gap ? 0.8 : 0.3)}rem;
    opacity: 0.5;
  `
);

const GroupedSection = ({ title, groupedData }) => (
  <>
    <RowTitle key="foo">{title}</RowTitle>
    <Row>
      {Object.entries(groupedData).map(([group, hours]) => [
        <Key key={`key-${group}`} children={group} />,
        <Unit key={`sep-${group}`} children=":" />,
        <Value key={`val-${group}`} children={hours.toFixed(2)} />,
        <Unit key={`uni-${group}`} gap children="h" />,
      ])}
    </Row>
  </>
);

const KimbleCalculator = (props) => {
  const [itemsByDay, setItemsByDay] = useState({});
  const [itemsByCat, setItemsByCat] = useState({});

  const analyze = useCallback((text) => {
    // get total hours
    const sum = sumHours(text.match(reAllHours) || []);

    // get hours grouped by day and category
    let day = "?";
    const items = [];
    text.split(reEol).forEach((line) => {
      const [, newDay] = line.match(reDay) || [];
      if (newDay) {
        day = newDay;
      }
      const [, hours, category] = line.match(reLine) || [];
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
        title: "Hours left from the dily 8h",
        value: (8 - sum).toFixed(2),
        unit: "h to go today,",
      },
      {
        title: "Hours left from the weekly 40h",
        value: (40 - sum).toFixed(2),
        unit: "h to go tis week.",
      },
    ];
  }, []);

  return (
    <>
      <TextAnalyzer
        label="Paste the Kimble time log here"
        name="kimble log"
        initialText={initialText}
        onUpdateResults={analyze}
        toolComp={KimbleCalculator}
        {...props}
      />
      <GroupedSection title="Hours per day" groupedData={itemsByDay} />
      <GroupedSection title="Hours per category" groupedData={itemsByCat} />
    </>
  );
};

export default KimbleCalculator;
