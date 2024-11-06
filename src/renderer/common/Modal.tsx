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
    inset: 0;
    align-items: center;
    justify-content: center;
    background: var(--modal-overlay);
    z-index: 1;
  `,
);

const ModalContent = displayName(
  "ModalContent",
  styled.div`
    ${cssShadow};
    background: var(--modal-bg);
    padding: 1rem;
    outline: none;
    border-radius: var(--border-radius);
  `,
);

export const ModalTitle = displayName(
  "ModalTitle",
  styled.h2`
    margin: 0 0 1rem;
  `,
);

export const ModalBody = displayName(
  "ModalBody",
  styled.div`
    margin: 0 0 1rem;
  `,
);

export const ModalFooter = displayName(
  "ModalFooter",
  styled.div`
    display: flex;
    justify-content: center;
    gap: var(--gap-size);
  `,
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
  const contentRef = useRef<HTMLDivElement>(null);

  const onKeyDown: KeyboardEventHandler = (event) => {
    const { key } = event;
    if (key === "Escape") {
      onClose();
      event.stopPropagation();
    }
  };

  // create and attach parent div on mount
  useEffect(() => {
    if (!modalRoot) {
      return;
    }
    const parent = document.createElement("div");
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

  if (!(isOpen && parent)) {
    return null;
  }

  return createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalContent
        onClick={stopPropagation}
        onKeyDown={onKeyDown}
        ref={contentRef}
      >
        {children}
      </ModalContent>
    </ModalOverlay>,
    parent,
  );
};

export default Modal;
