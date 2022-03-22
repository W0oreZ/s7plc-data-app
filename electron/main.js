const { app, ipcMain, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { get_mac } = require('./utils/platforme');

const { mqtt_connect, mqtt_publish } = require('./mqtt/Client');
const { plc_addObject, plc_readObjects, plc_connect } = require("./PLC/client");

let MainWindow = null;
const state = {
    id: null,
    dataPoints: {}
};

(async ()=>{
    await app.disableHardwareAcceleration();
    await app.whenReady();

    const clientID = get_mac()[0];
    console.log("DeviceID: ", clientID);
    state.id = clientID
    await mqtt_connect("mqtt://197.230.172.211:2005", clientID, []);
    await plc_connect("192.168.23.21");
    plc_addObject("PROGRAM_NAME",30,14,20,"STRING");
    plc_addObject("TEMPERATURE", 2, 4, 0, "REAL");
    plc_addObject("TEMPERATURE_NOMINAL", 30, 2, 0, "INT");
    //plc_addObject("PROGRAM_NUMBER", 30, 36, 0, "INT");
    plc_addObject("COOLING_PERIOD_REAL", 2, 2, 0, "REAL");
    plc_addObject("COOLING_PERIOD_NOMINAL", 30, 6, 0, "INT");
    plc_addObject("SHRINKING_TIME_REAL", 2, 0, 0, "INT");
    plc_addObject("SHRINKING_TIME_NOMINAL", 30, 4, 0, "INT");
    plc_addObject("COOL_AT_START", 30, 8, 0, "INT");
    plc_addObject("CYCLE_PER_DAY", 30, 10, 0, "INT");
    //plc_addObject("SCANNER", 30, 1579, 0, "X", 1);
    // plc_addObject("WORK", 9, 18, 2, "X", 1);
    // plc_addObject("ERROR", 9, 18, 3, "X", 1);
    //plc_addObject("TOTAL_CYCLES", 3, 0, 0, "LINT");
    setInterval(async ()=>{
        plc_readObjects(values=>{
            
            
            var dp = Object.keys(values).map((key) => ({name:key,value:values[key]}));
            state.dataPoints = dp;
            console.log(state);
            if(MainWindow){
                MainWindow.webContents.send('STATE-CHANGE', state);
                mqtt_publish("devices/dsg/events",JSON.stringify(state))
            }
            
        })
        
    },2000)
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
        minimizable: isDev,
        maximizable: true,
        closable: isDev,
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
