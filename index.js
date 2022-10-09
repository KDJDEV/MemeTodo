const { app, BrowserWindow } = require("electron");
try {
  require('electron-reloader')(module);
} catch { }
const path = require("path");

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 600, height: 600,
    minWidth: 600, minHeight: 300,
    autoHideMenuBar: true,
    webPreferences: {
      enableRemoteModule: true,
      devTools: false
    },
    icon: __dirname + '/public/build/icon.ico',
  });
  mainWindow.removeMenu()
  mainWindow.loadFile(path.join(__dirname, "public/index.html"));
  mainWindow.setBackgroundColor('#FFF');
  mainWindow.webContents.on('new-window', function (e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });
  //mainWindow.webContents.openDevTools();
});