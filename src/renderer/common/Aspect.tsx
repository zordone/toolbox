import React, { FC, ReactNode } from "react";
import styled from "styled-components";
import { displayName } from "../utils";

interface AspectOuterProps {
  $aspectRatio: string;
}

const AspectOuter = displayName(
  "AspectOuter",
  styled.div<AspectOuterProps>`
    position: relative;
    height: 0;
    padding-top: ${({ $aspectRatio }) => {
      const [w, h] = $aspectRatio.split(":").map(Number);
      return (h / w) * 100;
    }}%;
  `
);

const AspectInner = displayName(
  "AspectInner",
  styled.div`
    position: absolute;
    inset: 0;
  `
);

interface AspectProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio: string;
  children: ReactNode;
}

const Aspect: FC<AspectProps> = ({
  aspectRatio = "1:1",
  children,
  ...rest
}) => (
  <AspectOuter $aspectRatio={aspectRatio}>
    <AspectInner {...rest}>{children}</AspectInner>
  </AspectOuter>
);

export default Aspect;
