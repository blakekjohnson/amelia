/**
 * Main process
 * 12-20-20: Blake Johnson
 */

const { app, BrowserWindow, ipcMain } = require('electron');
const { readdir } = require('fs');
const { join } = require('path');
require('dotenv').config();

function createWindow() {
    const win = new BrowserWindow({
        width: 480,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

const fileRegex = /^[^.]*\.(gif|png|jpe?g)$/;

const filterFiles = file => fileRegex.test(file);
const addPath = file => join(process.env.MOUNT_POINT, file);

ipcMain.on('files', (event, arg) => {
    readdir(process.env.MOUNT_POINT, (err, files) => {
        let filteredFiles = files.filter(filterFiles);
        let fullFiles = filteredFiles.map(addPath);
        event.reply('files', fullFiles);
    });
});
