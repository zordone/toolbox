import React from "react";
import styled, { keyframes } from "styled-components";
import logoPng from "../logo.png";
import { displayName } from "../utils";

const SpinnerContainer = displayName(
  "SpinnerContainer",
  styled.div`
    display: inline-block;
    position: relative;
    width: 4rem;
    height: 4rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    opacity: 0.5;
  `
);

const SpinnerLogo = displayName(
  "SpinnerLogo",
  styled.img`
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 1rem;
  `
);

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerSvg = displayName(
  "SpinnerSvg",
  styled.svg`
    position: absolute;
    inset: 0;
    fill: none;
    stroke: var(--main-fg);
    stroke-width: 0.1rem;
    animation: ${rotate} 1s infinite linear;
  `
);

const Spinner = () => {
  return (
    <SpinnerContainer>
      <SpinnerLogo src={logoPng} />
      <SpinnerSvg viewBox="0 0 100 100">
        <path d="m 5 50 a 45 45 0 0 1 90 0" />
      </SpinnerSvg>
    </SpinnerContainer>
  );
};

export default Spinner;
