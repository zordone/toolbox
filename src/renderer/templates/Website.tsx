import React, { FC, useState } from "react";
import styled from "styled-components";
import { displayName } from "../utils";
import Spinner from "../common/Spinner";

interface FrameBgProps {
  $invert: boolean;
}

const FrameBg = displayName(
  "FrameBg",
  styled.div<FrameBgProps>`
    width: 100%;
    height: 100%;
    background: ${({ $invert }) => ($invert ? "#DDD" : "inherit")};
    border: 1px solid var(--header-bg);
  `
);

interface FrameProps {
  $invert: boolean;
  $isVisible: boolean;
}

const Frame = displayName(
  "Frame",
  styled.iframe<FrameProps>`
    width: 100%;
    height: 100%;
    border: none;
    mix-blend-mode: ${({ $invert }) => ($invert ? "difference" : "normal")};
    opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
    transition: opacity 1.5s;
  `
);

interface WebsiteProps {
  invert?: boolean;
  title?: string;
  url: string;
}

const Website: FC<WebsiteProps> = ({ invert = false, title = "", url }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const onLoad = () => {
    setIsLoaded(true);
  };

  return (
    <FrameBg $invert={invert}>
      {!isLoaded && <Spinner />}
      <Frame
        $invert={invert}
        $isVisible={isLoaded}
        onLoad={onLoad}
        src={url}
        title={title}
      ></Frame>
    </FrameBg>
  );
};

export default Website;
