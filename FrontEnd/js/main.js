const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), 
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../html/login.html'));

  mainWindow.webContents.openDevTools();

  ipcMain.on('open-register', () => {
    mainWindow.loadFile(path.join(__dirname, '../html/register.html'));
  });

  ipcMain.on('open-create', () => {
    mainWindow.loadFile(path.join(__dirname, '../html/createGame.html'));
  });

  ipcMain.on('open-login', () => {
    mainWindow.loadFile(path.join(__dirname, '../html/login.html'));
  });

  ipcMain.on('open-choose-game', () => {
    mainWindow.loadFile(path.join(__dirname, '../html/chooseGame.html'));
  });

  ipcMain.on('run-game', () => {
    mainWindow.loadFile(path.join(__dirname, '../html/runGame.html'));
  });


}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
