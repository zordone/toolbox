import React from "react";
import BasicField, { BasicFieldProps } from "./BasicField";

interface TextAreaProps extends Omit<BasicFieldProps<string>, "onValidate"> {
  onValidate?: BasicFieldProps<string>["onValidate"];
}

const defaultOnValidate = (text: string) => ({ value: text, error: null });

const defaultOnKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
  event,
) => {
  const { altKey, key } = event;
  // move line up or down with alt + arrow keys
  if (altKey && (key === "ArrowUp" || key === "ArrowDown")) {
    event.preventDefault();
    const isUp = key === "ArrowUp";
    // initial lines and cursor index
    const textarea = event.currentTarget;
    const lines = textarea.value.split("\n");
    const selectionStart = textarea.selectionStart ?? 0;
    // find current cursor line and char index
    let currentLineIndex = 0;
    let currentCharIndex = selectionStart;
    let charCount = 0;
    for (let index = 0; index < lines.length; index++) {
      charCount += lines[index].length + 1;
      if (charCount > selectionStart) {
        currentLineIndex = index;
        break;
      }
      currentCharIndex -= lines[index].length + 1;
    }
    // no moving beyond the first or last line
    if (
      (isUp && currentLineIndex === 0) ||
      (!isUp && currentLineIndex === lines.length - 1)
    ) {
      return;
    }
    // swap the lines
    const direction = isUp ? -1 : 1;
    const temp = lines[currentLineIndex + direction];
    lines[currentLineIndex + direction] = lines[currentLineIndex];
    lines[currentLineIndex] = temp;
    textarea.value = lines.join("\n");
    // new cursor position
    const newLineIndex = isUp ? currentLineIndex - 1 : currentLineIndex + 1;
    const newCharIndex = currentCharIndex;
    // find new cursor index
    let newSelectionStart = 0;
    for (let i = 0; i < newLineIndex; i++) {
      newSelectionStart += lines[i].length + 1;
    }
    newSelectionStart += newCharIndex;
    // set the new cursor position
    textarea.setSelectionRange(newSelectionStart, newSelectionStart);
  }
};

const TextArea = ({
  onValidate = defaultOnValidate,
  onKeyDown = defaultOnKeyDown,
  ...rest
}: TextAreaProps) => (
  <BasicField<string>
    {...rest}
    as="textarea"
    onValidate={onValidate}
    onKeyDown={onKeyDown}
  />
);

export default TextArea;
