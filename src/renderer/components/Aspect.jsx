import React from "react";
import styled from "styled-components";
import { displayName } from "../utils";

const AspectOuter = displayName(
  "AspectOuter",
  styled.div`
    position: relative;
    height: 0;
    padding-top: ${({ $aspectRatio }) => {
      const [w, h] = $aspectRatio.split(":").map(Number);
      const padding = (h / w) * 100;
      return padding;
    }}%;
  `
);

const AspectInner = displayName(
  "AspectInner",
  styled.div`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  `
);

const Aspect = ({ aspectRatio = "1:1", children, ...rest }) => (
  <AspectOuter $aspectRatio={aspectRatio}>
    <AspectInner {...rest}>{children}</AspectInner>
  </AspectOuter>
);

export default Aspect;
