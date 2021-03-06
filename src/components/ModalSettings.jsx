import React, { useState } from "react";
import styled from "styled-components";
import { displayName, noop } from "../utils";
import Modal, { ModalBody, ModalFooter, ModalTitle } from "./Modal";
import Button from "./Buttons";
import { TextField, IntegerField, FloatField } from "./Fields";
import { saveSettings, useSettings } from "../settings";

const Name = displayName(
  "Name",
  styled.div`
    margin: 1rem 0 0.2rem 0;
  `
);

const TypeToInput = {
  text: TextField,
  integer: IntegerField,
  float: FloatField,
};

const ModalSettings = ({ modalState, tool, onSave = noop }) => {
  const config = tool.settings;
  const saved = useSettings(tool);
  const [values, setValues] = useState(saved);

  const onSaveClick = () => {
    saveSettings(tool, values);
    modalState.close();
    onSave();
  };

  const onKeyDown = ({ key }) => {
    if (key === "Enter") {
      onSaveClick();
    }
  };

  return (
    <Modal isOpen={modalState.isOpen} onClose={modalState.close}>
      <ModalTitle>{tool.name} Settings</ModalTitle>
      <ModalBody autoFocus onKeyDown={onKeyDown}>
        {config.map(({ key, title, type }, index) => {
          const Input = TypeToInput[type] || TypeToInput.text;
          return (
            <React.Fragment key={key}>
              <Name>{title}:</Name>
              <Input
                state={values[key]}
                setState={(newValue) =>
                  setValues({ ...values, [key]: newValue })
                }
                fullWidth
                tabIndex={0}
                autoFocus={index === 0}
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
