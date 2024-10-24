import { FC } from "react";

interface Setting {
  initial: number;
  key: string;
  title: string;
  type: "integer";
}

export interface ToolProps {
  focusSearch: (event: Event) => void | false;
  onSelectTool: (name: string) => void;
  pasted?: string;
}

export interface Tool {
  component: FC<ToolProps>;
  description: string;
  name: string;
  settings?: Setting[];
}

export interface Tools {
  [name: string]: Tool;
}

const tools: Tool[] = [];

export const registerTool = (tool: Tool) => {
  tool.component.displayName = tool.name;
  tool.settings ??= [];
  tools.push(tool);
};

export const getAllTools = (): Tools =>
  Object.fromEntries(tools.map((tool) => [tool.name, { ...tool }]));

export const getToolByComponent = (toolComponent: FC) =>
  tools.find(({ component }) => component === toolComponent);
