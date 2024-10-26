import React, { ComponentProps, FC } from "react";
import { JsonView, darkStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import styled from "styled-components";
import { displayName } from "../utils";

const shouldExpandNode = (level: number) => level < 2;

const Container = displayName(
  "Container",
  styled.div`
    &&& * {
      border: none;
      box-shadow: none;
      vertical-align: middle;
    }

    &&& ul {
      padding-inline-start: 1rem;
      margin-block: 0;
      border-inline-start: 1px solid #fff2;
    }

    .container {
      background: transparent;
      font-size: 0.7rem;
      font-family: "PT Sans", -apple-system, system-ui, "Segoe UI", Roboto,
        Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
        sans-serif;
    }

    .basic {
      padding: 0;
      margin: 0;
    }

    .value {
      color: var(--input-fg);
      font-weight: 900;
    }

    .label {
      color: var(--main-fg);
      opacity: 0.5;
      margin-right: 1ch;
    }

    .punctuation {
      margin-right: 1ch;
      opacity: 1;
      color: var(--main-fg);
      font-size: 0.8rem;
    }

    .icon {
      color: var(--main-fg);
      font-size: 1.5rem;
      margin: 0;
      line-height: 0;
      opacity: 0.5;
      display: inline-block;
    }
  `
);

darkStyles.basicChildStyle = "basic";
darkStyles.container = "container";
darkStyles.nullValue = "value";
darkStyles.undefinedValue = "value";
darkStyles.stringValue = "value";
darkStyles.booleanValue = "value";
darkStyles.numberValue = "value";
darkStyles.otherValue = "value";
darkStyles.label = "label";
darkStyles.punctuation = "punctuation";
darkStyles.collapseIcon += " icon";
darkStyles.expandIcon += " icon";

interface JsonViewerProps {
  data: ComponentProps<typeof JsonView>["data"];
}

const JsonViewer: FC<JsonViewerProps> = ({ data }) => (
  <Container>
    <JsonView
      data={data}
      shouldExpandNode={shouldExpandNode}
      style={darkStyles}
    />
  </Container>
);

export default JsonViewer;
