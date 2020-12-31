import React from "react";
import styled from "styled-components";
import { clearPersistedStateFor } from "../persistedState";
import logoPng from "../logo.png";
import { displayName, noop } from "../utils";
import Search from "./Search";
import DropDownButton from "./DropDownButton";
import { useModal } from "./Modal";
import ModalSettings from "./ModalSettings";

const TITLE_OPACITY = 0.2;

const Container = displayName(
  "Container",
  styled.div`
    display: flex;
    background: var(--header-bg);
    align-items: center;
    user-select: none;
    font-size: 1.6rem;
    font-weight: bold;
  `
);

const Logo = displayName(
  "Logo",
  styled.img`
    padding: 0.5rem;
    width: 2.5rem;
    height: auto;
    opacity: 0.7;
    cursor: pointer;
  `
);

const Title = displayName(
  "Title",
  styled.h1`
    display: inline-block;
    margin: 0;
    font: inherit;
    opacity: ${TITLE_OPACITY};
    cursor: pointer;
  `
);

const Buttons = displayName(
  "Buttons",
  styled.div`
    font-size: 1rem;
    font-weight: 400;
    margin-right: 1rem;
    background: inherit;
  `
);

const Header = ({
  searchRef,
  tools,
  currentToolName,
  onSelectTool = noop,
  onReloadTool = noop,
  onTitleClick = noop,
}) => {
  const settings = useModal();

  const onLogoClick = () => {
    onSelectTool("Help");
  };

  const onSettings = () => {
    settings.open();
  };

  const onClearState = () => {
    clearPersistedStateFor(tools[currentToolName]);
    onReloadTool();
  };

  const tool = tools[currentToolName];
  const hasSettings = tool.settings?.length;

  return (
    <Container>
      <Logo src={logoPng} onClick={onLogoClick} />
      <Title onClick={onTitleClick}>Toolbox/</Title>
      <Search
        searchRef={searchRef}
        tools={tools}
        currentToolName={currentToolName}
        onSelectTool={onSelectTool}
      />
      <Buttons>
        <DropDownButton>
          <button onClick={onSettings} disabled={!hasSettings}>
            Tool settings
          </button>
          <button onClick={onReloadTool}>Reload tool</button>
          <button onClick={onClearState}>Clear persisted tool state</button>
        </DropDownButton>
      </Buttons>
      <ModalSettings
        key={currentToolName}
        modalState={settings}
        tool={tool}
        onSave={onReloadTool}
      />
    </Container>
  );
};

export default Header;
