import { BrowserWindow, dialog, ipcMain } from "electron";
import fs from "fs";
import {
  MainMethod,
  MainMethodName,
  ShowOpenDialog,
  ShowSaveDialog,
} from "./mainTypes";

export const setupApi = (browserWindow: BrowserWindow) => {
  // remove previous listeners
  ipcMain.removeAllListeners();

  // add a promisified api handler, receiving & replying through IPC
  const addApiHandler = <THandler extends MainMethod>(
    apiName: string,
    handler: THandler
  ) => {
    ipcMain.on(apiName, async (event, args) => {
      try {
        const result = await handler(args);
        event.reply(`${apiName}-result`, { result });
      } catch (error) {
        event.reply(`${apiName}-result`, { error });
      }
    });
  };

  // OpenFileDialog: open file dialog, get file contents
  // see options here: https://www.electronjs.org/docs/latest/api/dialog#dialogshowopendialogwindow-options
  addApiHandler<ShowOpenDialog>(
    MainMethodName.ShowOpenDialog,
    async ({ options }) => {
      const { canceled, filePaths } = await dialog.showOpenDialog(
        browserWindow,
        {
          properties: ["openFile"],
          ...options,
        }
      );
      if (canceled || !filePaths?.length) {
        return { name: null, content: null };
      }
      const filePath = filePaths[0];
      const content = fs.readFileSync(filePath, { encoding: "utf8" });
      return { name: filePath, content };
    }
  );

  // ShowSaveDialog: save file dialog, save file contents
  // see options here: https://www.electronjs.org/docs/latest/api/dialog#dialogshowsavedialogwindow-options
  addApiHandler<ShowSaveDialog>(
    MainMethodName.ShowSaveDialog,
    async ({ content, options }) => {
      const { canceled, filePath } = await dialog.showSaveDialog(
        browserWindow,
        options
      );
      if (canceled || !filePath) {
        return { name: null };
      }
      fs.writeFileSync(filePath, content, { encoding: "utf8" });
      return { name: filePath };
    }
  );

  // ...
};
