import React from "react";
import ReactJson from "react-json-view";
import "./JsonViewer.css";

const style = {
  fontSize: "0.8rem",
  fontWeight: "900",
  fontFamily:
    '"PT Sans", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
};

const theme = {
  base00: "transparent", //        - Background
  base01: "#000", //               - ?
  base02: "#fff2", //              - Indentation guide lines
  base03: "#000", //               - Comments, Invisibles, Line Highlighting
  base04: "#fff2", //              - Item counts
  base05: "#fff", //               - Undefined value
  base06: "#000", //               - ?
  base07: "var(--input-fg)", //    - Identifiers
  base08: "#000", //               - ?
  base09: "var(--input-fg)", //    - String values
  base0A: "#000", //               - ?
  base0B: "#000", //               - ?
  base0C: "#fff4", //              - Array indexes
  base0D: "#fff4", //              - Expand/collapse buttons
  base0E: "var(--input-fg)", //    - Boolean values
  base0F: "var(--input-fg)", //    - Number values
};

const JsonViewer = ({ src }) => (
  <ReactJson
    src={src}
    displayDataTypes={false}
    groupArraysAfterLength={50}
    theme={theme}
    style={style}
  />
);

export default JsonViewer;
