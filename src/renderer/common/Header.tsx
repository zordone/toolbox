import React, {
  FC,
  MouseEventHandler,
  MutableRefObject,
  useCallback,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import styled from "styled-components";
import logoPng from "../logo.png";
import { clearPersistedStateFor } from "../persistedState";
import { Tools } from "../toolStore";
import { displayName, noop } from "../utils";
import DropDownButton from "./DropDownButton";
import { useModal } from "./Modal";
import ModalSettings from "./ModalSettings";
import Search from "./Search";

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

    /* extend the mouseleave area of the cog */
    & > div {
      padding-left: 2rem;
    }

    & button {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }
  `
);

const Shortcut = displayName(
  "Shortcut",
  styled.span`
    font-family: system-ui;
    opacity: 0.4;
  `
);

interface HeaderProps {
  currentToolName: string;
  onReloadTool: () => void;
  onSelectTool: (name: string) => void;
  onTitleClick: MouseEventHandler;
  searchRef: MutableRefObject<HTMLInputElement>;
  tools: Tools;
}

const Header: FC<HeaderProps> = ({
  currentToolName,
  onReloadTool = noop,
  onSelectTool = noop,
  onTitleClick = noop,
  searchRef,
  tools,
}) => {
  const tool = tools[currentToolName];
  const hasSettings = tool.settings?.length;
  const settings = useModal();

  const onLogoClick = useCallback(() => {
    onSelectTool("Help");
  }, [onSelectTool]);

  const onSettings = useCallback(() => {
    settings.open();
  }, [settings]);

  const onClearState = useCallback(() => {
    clearPersistedStateFor(tools[currentToolName]);
    onReloadTool();
  }, [currentToolName, onReloadTool, tools]);

  useHotkeys(
    "cmd+,",
    (event) => {
      if (hasSettings) {
        onSettings();
      }
      event.preventDefault();
    },
    [hasSettings, onSettings]
  );

  return (
    <Container>
      <Logo src={logoPng} onClick={onLogoClick} />
      <Title onClick={onTitleClick}>Toolbox/</Title>
      <Search
        currentToolName={currentToolName}
        onSelectTool={onSelectTool}
        searchRef={searchRef}
        tools={tools}
      />
      <Buttons>
        <DropDownButton>
          <button onClick={onSettings} disabled={!hasSettings}>
            Tool settings
            <Shortcut>⌘,</Shortcut>
          </button>
          <button onClick={onReloadTool}>
            Reload tool
            <Shortcut>⌘R</Shortcut>
          </button>
          <button onClick={onClearState}>Clear tool state</button>
        </DropDownButton>
      </Buttons>
      <ModalSettings
        key={currentToolName}
        modalState={settings}
        onSave={onReloadTool}
        tool={tool}
      />
    </Container>
  );
};

export default Header;
