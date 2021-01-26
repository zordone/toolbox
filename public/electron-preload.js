// exposing an API for the renderer process

const { contextBridge, ipcRenderer } = require("electron");
const { Api } = require("./electron-api");

// generic api call through IPC
const callApi = async (apiName, args) =>
  new Promise((resolve, reject) => {
    ipcRenderer.once(`${apiName}-result`, (_, { error, result }) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
    ipcRenderer.send(apiName, args);
  });

// expose the API - only what we really need
contextBridge.exposeInMainWorld("electronApi", {
  showOpenDialog: async (options) =>
    await callApi(Api.ShowOpenDialog, { options }),
  showSaveDialog: async (content, options) =>
    await callApi(Api.ShowSaveDialog, { content, options }),
});
