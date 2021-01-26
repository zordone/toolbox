const { ipcMain, dialog } = require("electron");
const fs = require("fs");

const Api = {
  ShowOpenDialog: "ShowOpenDialog",
  ShowSaveDialog: "ShowSaveDialog",
};

const setupApi = (browserWindow) => {
  // remove previous listeners
  ipcMain.removeAllListeners();

  // add a promisified api handler, receiving & sending through IPC
  const addApiHandler = (apiName, handler) => {
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
  // see options here: https://www.electronjs.org/docs/api/dialog#dialogshowopendialogbrowserwindow-options
  addApiHandler(Api.ShowOpenDialog, async ({ options }) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(browserWindow, {
      properties: ["openFile"],
      ...options,
    });
    if (canceled || !filePaths?.length) {
      return { name: null, content: null };
    }
    const filePath = filePaths[0];
    const content = fs.readFileSync(filePath, { encoding: "utf8" });
    return { name: filePath, content };
  });

  // ShowSaveDialog: save file dialog, save file contents
  // see options here: https://www.electronjs.org/docs/api/dialog#dialogshowsavedialogbrowserwindow-options
  addApiHandler(Api.ShowSaveDialog, async ({ content, options }) => {
    const { canceled, filePath } = await dialog.showSaveDialog(browserWindow, {
      properties: ["openFile"],
      ...options,
    });
    if (canceled || !filePath) {
      return { name: null };
    }
    fs.writeFileSync(filePath, content, { encoding: "utf8" });
    return { name: filePath };
  });

  // ...
};

module.exports = {
  Api,
  setupApi,
};
