const { contextBridge, ipcRenderer } =  require('electron');
const os = require('os');

const API = {
    getOS: () => {
        return os.platform();
    },

    onStateChange: (callback) => {
        ipcRenderer.on('STATE-CHANGE', function (evt, state) {
            callback(state);
        });
    },

    sendCommand: (cmd) => ipcRenderer.invoke('SEND-COMMAND', cmd)
};

contextBridge.exposeInMainWorld('api', API);