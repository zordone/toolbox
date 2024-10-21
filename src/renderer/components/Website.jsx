import React, { useState } from "react";
import styled from "styled-components";
import Spinner from "./Spinner";
import { displayName } from "../utils";

const FrameBg = displayName(
  "FrameBg",
  styled.div`
    width: 100%;
    height: 100%;
    background: ${({ $invert }) => ($invert ? "#DDD" : "inherit")};
    border: 1px solid var(--header-bg);
  `
);

const Frame = displayName(
  "Frame",
  styled.iframe`
    width: 100%;
    height: 100%;
    border: none;
    mix-blend-mode: ${({ $invert }) => ($invert ? "difference" : "normal")};
    opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
    transition: opacity 1.5s;
  `
);

const Website = ({ url, title = "", invert = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const onLoad = () => {
    setIsLoaded(true);
  };

  return (
    <FrameBg $invert={invert}>
      {!isLoaded && <Spinner />}
      <Frame
        src={url}
        title={title}
        onLoad={onLoad}
        $invert={invert}
        $isVisible={isLoaded}
      ></Frame>
    </FrameBg>
  );
};

export default Website;
