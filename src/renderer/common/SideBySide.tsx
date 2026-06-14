import { displayName } from "../utils";
import styled from "styled-components";

export const SideBySide = displayName(
  "SideBySide",
  styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--gap-size);
    height: 100%;
  `,
);
