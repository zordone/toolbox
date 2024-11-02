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
      font-family: Monaco, Menlo, "Ubuntu Mono", Consolas, "Source Code Pro",
        source-code-pro, monospace;
    }

    .basic {
      padding: 0;
      margin: 0;
    }

    .value {
      color: var(--input-fg);
    }

    .label {
      color: var(--main-fg);
      opacity: 0.5;
      margin-right: 1ch;
    }

    .punctuation {
      margin-right: 5px;
      opacity: 1;
      color: var(--main-fg);
      font-size: 0.8rem;
    }

    .icon {
      color: var(--main-fg);
      opacity: 0.5;
      display: inline-block;
      font-family: monospace;

      &:hover {
        opacity: 1;
      }
    }

    .collapse::after {
      content: "▶";
    }

    .expand::after {
      content: "▼";
    }
  `,
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
darkStyles.collapseIcon += " collapse icon";
darkStyles.expandIcon += " expand icon";

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
