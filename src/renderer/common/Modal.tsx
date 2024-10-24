import React, {
  FC,
  KeyboardEventHandler,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { displayName, noop, stopPropagation } from "../utils";
import { cssShadow } from "./styledCss";

const modalRoot = document.getElementById("modal-root");

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const ModalOverlay = displayName(
  "ModalOverlay",
  styled.div`
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    align-items: center;
    justify-content: center;
    background: var(--modal-overlay);
    z-index: 1;
  `
);

const ModalContent = displayName(
  "ModalContent",
  styled.div`
    ${cssShadow}
    background: var(--modal-bg);
    padding: 1rem;
    outline: none;
    border-radius: var(--border-radius);
  `
);

export const ModalTitle = displayName(
  "ModalTitle",
  styled.h2`
    margin: 0 0 1rem 0;
  `
);

export const ModalBody = displayName(
  "ModalBody",
  styled.div`
    margin: 0 0 1rem 0;
  `
);

export const ModalFooter = displayName(
  "ModalFooter",
  styled.div`
    display: flex;
    justify-content: center;
    gap: var(--gap-size);
  `
);

interface ModalProps {
  children: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

const Modal: FC<ModalProps> = ({
  children,
  isOpen = false,
  onClose = noop,
}) => {
  const [parent, setParent] = useState<HTMLDivElement>();
  const contentRef = useRef<HTMLDivElement>();

  const onKeyDown: KeyboardEventHandler = (event) => {
    const { key } = event;
    if (key === "Escape") {
      onClose();
      event.stopPropagation();
    }
  };

  // create and attach parent div on mount
  useEffect(() => {
    const parent = document.createElement("div");
    parent.tabIndex = 0;
    modalRoot.appendChild(parent);
    setParent(parent);
    return () => {
      modalRoot.removeChild(parent);
    };
  }, []);

  // focus modal when we show it
  useEffect(() => {
    contentRef?.current?.focus();
  }, [parent, contentRef, isOpen]);

  return (
    isOpen &&
    parent &&
    createPortal(
      <ModalOverlay onClick={onClose}>
        <ModalContent
          onClick={stopPropagation}
          onKeyDown={onKeyDown}
          ref={contentRef}
        >
          {children}
        </ModalContent>
      </ModalOverlay>,
      parent
    )
  );
};

export default Modal;
