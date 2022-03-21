const { app, ipcMain, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { get_mac } = require('./utils/platforme');

const { mqtt_connect } = require('./mqtt/Client');

let MainWindow = null;
const state = {
    id: null,
    dataPoints: ["DB1"]
};

(async ()=>{
    await app.disableHardwareAcceleration();
    await app.whenReady();

    const clientID = get_mac()[0];
    console.log("DeviceID: ", clientID);
    await mqtt_connect("mqtt://197.230.172.211:2005", clientID, []);

    main();
})();

app.on('window-all-closed', () => {
    if(isDev) {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    }else {
        main();
    }
});
  
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        main()
    }
});

ipcMain.handle('SEND-COMMAND', (evt, command) => {
    try {
        switch (command.type) {
            case "HELLO":
                return "WORLD";
            case "refresh":
                MainWindow.webContents.send('STATE-CHANGE', state);
                return 
            default:
                return false;
        }
    } catch (error) {
        console.log("[ERROR] %s", error.message);
    }
});

async function main() {
    MainWindow = new BrowserWindow({
        show: false,
        autoHideMenuBar: !isDev,
        minimizable: !isDev,
        maximizable: true,
        closable: !isDev,
        kiosk: !isDev,
        width: 1024,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            preload:path.join(__dirname, "./preload.js")
        }
    });

    MainWindow.loadURL(
        isDev?"http://localhost:3000":`file://${path.join(__dirname, "../build/index.html")}`
    );

    MainWindow.on('ready-to-show', async () => {
        MainWindow.show();
        if(isDev) {
            MainWindow.webContents.openDevTools();
        }
    })
}
