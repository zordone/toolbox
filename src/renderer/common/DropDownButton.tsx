import React, { FC, ReactNode, useState } from "react";
import styled from "styled-components";
import { displayName } from "../utils";
import { IconButton } from "./Buttons";
import { cssShadow } from "./styledCss";

interface ContainerProps {
  $fade: boolean;
}

const Container = displayName(
  "Container",
  styled.div<ContainerProps>`
    position: relative;
    background: inherit;

    &:not(:hover) {
      opacity: ${({ $fade }) => ($fade ? 0.2 : 1)};
    }
  `,
);

interface DropDownProps {
  $isVisible: boolean;
}

const DropDown = displayName(
  "DropDown",
  styled.ul<DropDownProps>`
    ${cssShadow};
    position: absolute;
    z-index: 1;
    display: ${({ $isVisible }) => ($isVisible ? "flex" : "none")};
    flex-direction: column;
    top: 100%;
    right: 0;
    background: var(--modal-bg);
    gap: 0.2rem;
    padding: 0.2rem 0;
    border-radius: var(--border-radius);
    width: max-content;
    margin: 0;
    border: 1px solid var(--selection);
  `,
);

const Item = displayName(
  "Item",
  styled.li`
    display: contents;

    & > button {
      background: none;
      border: none;
      outline: none;
      color: inherit;
      text-align: left;
      padding: 0.2rem 0.5rem;
      cursor: pointer;

      &:hover {
        background: var(--selection);
      }

      &:disabled {
        opacity: 0.4;
        background: none;
        cursor: default;
      }
    }
  `,
);

interface DropDownButtonProps {
  children: ReactNode;
}

const DropDownButton: FC<DropDownButtonProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onToggle = () => setIsOpen(!isOpen);
  const onHide = () => setIsOpen(false);

  return (
    <Container onMouseLeave={onHide} $fade={!isOpen}>
      <IconButton icon="fa-cog" chromeless onClick={onToggle} />
      <DropDown $isVisible={isOpen}>
        {React.Children.map(children, (child) => (
          <Item>{child}</Item>
        ))}
      </DropDown>
    </Container>
  );
};

export default DropDownButton;
