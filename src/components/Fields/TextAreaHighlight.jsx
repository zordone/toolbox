import TextArea from "./TextArea";
import styled, { css } from "styled-components";
import { cssGridArea, cssFieldStyle } from "../styledCss";
import { displayName, escapeHtml } from "../../utils";
import { useCallback, useEffect, useRef, useState } from "react";

const MARK_BEGIN = "***_MARK_BEGIN_***";
const MARK_END = "***_MARK_END_***";

const cssFill = css`
  position: absolute;
  inset: 0;
  margin: 0.2rem;
`;

const Container = displayName(
  "Container",
  styled.div`
    ${cssGridArea}
    ${cssFieldStyle}
    position: relative;
    font-family: monospace;
    padding: 0;

    & textarea {
      ${cssFill}
      width: calc(100% - 0.4rem);
      padding: 0;
      border-radius: 0;
      background-color: transparent;
    }

    & mark {
      color: transparent;
      background-color: var(--input-mark);
      border-radius: 0.1rem;
      border: 0.1rem solid var(--input-mark);
      margin-left: -0.1rem;
    }
  `
);

const Backdrop = displayName(
  "Backdrop",
  styled.div`
    ${cssFill}
    font-family: monospace;
    overflow: auto;
  `
);

const Highlights = displayName(
  "Highlights",
  styled.div`
    white-space: pre-wrap;
    word-wrap: break-word;
    color: transparent;
  `
);

const TextAreaHighlight = ({ area, marks = [], ...rest }) => {
  const { state, monoSpace } = rest;
  const refBackdrop = useRef();
  const [html, setHtml] = useState(state);

  // put marks in the text
  useEffect(() => {
    // get current text
    let html = state.replace(/\n$/g, "\n\n");
    // insert `mark` markers first, to avoid them being escaped
    // reverse order keep earlier indexes correct
    marks.reverse().forEach((mark) => {
      const { index, length } = mark;
      html = [
        html.slice(0, index),
        MARK_BEGIN,
        html.slice(index, index + length),
        MARK_END,
        html.slice(index + length),
      ].join("");
    });
    // escape html, then change the markers to actual `mark` elements
    html = escapeHtml(html)
      .replaceAll(MARK_BEGIN, "<mark>")
      .replaceAll(MARK_END, "</mark>");
    setHtml(html);
  }, [state, marks]);

  // sync scrolling
  const onScroll = useCallback(({ target }) => {
    refBackdrop.current.scrollTop = target.scrollTop;
  }, []);

  return (
    <Container area={area} monoSpace={monoSpace}>
      <Backdrop ref={refBackdrop}>
        <Highlights dangerouslySetInnerHTML={{ __html: html }} />
      </Backdrop>
      <TextArea {...rest} chromeless onScroll={onScroll} />
    </Container>
  );
};

export default TextAreaHighlight;
