import styled from "styled-components";
import { displayName } from "../utils";

interface Props {
  $visible: boolean;
}

export const ErrorBanner = displayName(
  "ErrorBanner",
  styled.div<Props>`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: var(--error-bg);
    color: var(--error-fg);
    padding: 0.4rem;
    transition: transform 400ms;
    transform: ${({ $visible }) => ($visible ? "none" : "translateY(100%)")};
  `,
);
