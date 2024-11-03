import React, { FC, KeyboardEventHandler, useState } from "react";
import styled from "styled-components";
import { BooleanField, FloatField, IntegerField, TextField } from "../fields";
import { saveSettings, SettingType, useSettings } from "../settings";
import { Tool } from "../toolStore";
import { displayName, noop } from "../utils";
import Button from "./Buttons";
import Modal, { ModalBody, ModalFooter, ModalTitle, useModal } from "./Modal";

const Name = displayName(
  "Name",
  styled.div`
    margin: 1rem 0 0.2rem;
  `,
);

type SettingField =
  | typeof BooleanField
  | typeof FloatField
  | typeof IntegerField
  | typeof TextField;

const TypeToInput: Record<SettingType, SettingField> = {
  float: FloatField,
  integer: IntegerField,
  text: TextField,
  boolean: BooleanField,
};

interface ModalSettingsProps {
  modalState: ReturnType<typeof useModal>;
  onSave?: () => void;
  tool: Tool;
}

const ModalSettings: FC<ModalSettingsProps> = ({
  modalState,
  onSave = noop,
  tool,
}) => {
  const config = tool.settings;
  const saved = useSettings(tool);
  const [values, setValues] = useState(saved);

  const onSaveClick = () => {
    saveSettings(tool, values);
    modalState.close();
    onSave();
  };

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = ({ key }) => {
    if (key === "Enter") {
      onSaveClick();
    }
  };

  return (
    <Modal isOpen={modalState.isOpen} onClose={modalState.close}>
      <ModalTitle>{tool.name} Settings</ModalTitle>
      <ModalBody autoFocus onKeyDown={onKeyDown}>
        {config?.map(({ key, title, type }, index) => {
          const Input = TypeToInput[type] || TypeToInput.text;
          return (
            <React.Fragment key={key}>
              <Name>{title}:</Name>
              <Input
                autoFocus={index === 0}
                fullWidth
                setState={(newValue) =>
                  setValues({ ...values, [key]: newValue })
                }
                min={0}
                state={values[key]}
                tabIndex={0}
              />
            </React.Fragment>
          );
        })}
      </ModalBody>
      <ModalFooter>
        <Button onClick={onSaveClick}>Save</Button>
        <Button onClick={modalState.close}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalSettings;
