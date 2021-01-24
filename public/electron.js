const path = require("path");
const { app, screen, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const windowStateKeeper = require("electron-window-state");

const PORT = 3100;

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS;

if (isDev) {
  const devTools = require("electron-devtools-installer");
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require("electron-squirrel-startup")) {
  app.quit();
}

function createWindow() {
  // Default window size.
  const {
    width: screenWidth,
    height: screenHeight,
  } = screen.getPrimaryDisplay().size;
  const margins = Math.round(Math.min(screenWidth, screenHeight) * 0.1);
  const defaultWidth = screenWidth - margins;
  const defaultHeight = screenHeight - margins;

  // Load the previous state with fallback to defaults.
  let mainWindowState = windowStateKeeper({
    defaultWidth,
    defaultHeight,
  });

  // Create the browser window.
  const win = new BrowserWindow({
    backgroundColor: "#000",
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Watch window position & size.
  mainWindowState.manage(win);

  // and load the index.html of the app.
  win.loadURL(
    isDev
      ? `http://localhost:${PORT}`
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((error) => console.log(`An error occurred: , ${error}`));
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
