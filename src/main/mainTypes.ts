import { OpenDialogOptions, SaveDialogOptions } from "electron";

declare global {
  // noinspection JSUnusedGlobalSymbols - this is definitely used
  interface Window {
    mainApi: MainApi;
  }
}

// name of the main methods
export enum MainMethodName {
  ShowOpenDialog = "ShowOpenDialog",
  ShowSaveDialog = "ShowSaveDialog",
}

// general case of a main method
export type MainMethod = (params: object) => Promise<object>;

// main method for showing the open dialog
export type ShowOpenDialog = (params: {
  options: OpenDialogOptions;
}) => Promise<{
  name: string | null;
  content: string | null;
}>;

// main method for showing the save dialog
export type ShowSaveDialog = (params: {
  content: string;
  options: SaveDialogOptions;
}) => Promise<{
  name: string | null;
}>;

// the interface from renderer to main
export interface MainApi {
  versions: string;
  showOpenDialog: ShowOpenDialog;
  showSaveDialog: ShowSaveDialog;
}
