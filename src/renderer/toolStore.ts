import { FC } from "react";
import { Setting } from "./settings";

export interface ToolProps {
  focusSearch: (event: Event | null) => void | false;
  onSelectTool: (name: string) => void;
  pasted?: string;
}

export interface Tool {
  component: FC<ToolProps>;
  description: string;
  name: string;
  settings?: Setting[];
}

export type Tools = Record<string, Tool>;

const tools: Tool[] = [];

export const registerTool = (tool: Tool) => {
  tool.component.displayName = tool.name;
  tool.settings ??= [];
  tools.push(tool);
};

export const getAllTools = (): Tools =>
  Object.fromEntries(tools.map((tool) => [tool.name, { ...tool }]));

export const getToolByComponent = (toolComponent: FC<ToolProps>) =>
  tools.find(({ component }) => component === toolComponent);
