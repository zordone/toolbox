import React from "react";
import styled from "styled-components";
import { displayName } from "../utils";

import { JsonView, darkStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

const shouldExpandNode = (level) => level < 2;

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

const JsonViewer = ({ src }) => (
  <Container>
    <JsonView
      data={src}
      style={darkStyles}
      shouldExpandNode={shouldExpandNode}
      className="hello"
    />
  </Container>
);

export default JsonViewer;
