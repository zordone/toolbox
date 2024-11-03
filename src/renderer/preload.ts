// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import {
  MainApi,
  MainMethod,
  MainMethodName,
  ShowOpenDialog,
  ShowSaveDialog,
} from "../main/mainTypes";

const { node, chrome, electron } = process.versions;
const versions = `Node ${node}, Chrome ${chrome}, Electron ${electron}`;

// generic api call through IPC
const callMethod = <
  TMethod extends MainMethod,
  TParams = Parameters<TMethod>[0],
  TReturn = Awaited<ReturnType<TMethod>>,
>(
  method: MainMethodName,
  params: TParams,
) =>
  new Promise<TReturn>((resolve, reject) => {
    ipcRenderer.once(`${method}-result`, (_, { error, result }) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
    ipcRenderer.send(method, params);
  });

// renderer will use this to call the main's methods
const mainApi: MainApi = {
  versions,
  showOpenDialog: (params) =>
    callMethod<ShowOpenDialog>(MainMethodName.ShowOpenDialog, params),
  showSaveDialog: async (params) =>
    callMethod<ShowSaveDialog>(MainMethodName.ShowSaveDialog, params),
};

contextBridge.exposeInMainWorld("mainApi", mainApi);
