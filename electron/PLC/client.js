const S7 = require('nodes7');
const connection = new S7({ silent: false });
connection.doNotOptimize = true;
let isConnected = false;
let objectsCollection = [];

function plc_connect(address) {
    connection.initiateConnection({ port: 102, host: address, rack: 0, slot: 1, timeout: 2000 }, onConnectionStart);
    connection.setTranslationCB(function(name) { return objectsCollection[name].query; });
}

async function onConnectionStart(err) {
    if (typeof(err) !== "undefined") {
        // We have an error. Maybe the PLC is not reachable.
        console.log(err);
        isConnected = false;
    }
    isConnected = true;
}

function plc_addObject(name, db, index, offset = 0, type = "X", size = 0) {
    var query = "DB";
    query += db + ",";
    switch (type) {
        case "CHAR":
            query += "C";
            break;
        case "STRING":
            query += "S";
            break;
        
        case "INT":
            query += "INT";
            break;

        case "LINT":
            query += "LINT";
            break;
    
        case "REAL":
            query += "REAL";
            break;
    
        default:
            query += "X";
            break;
    }

    query += index;

    if(offset > 0) {
        query += "." + offset;
    }

    if(size > 0) {
        query += "." + size;
    }

    

    objectsCollection[name] = {
        name,
        db,
        type,
        index,
        offset,
        size,
        query
    };

    connection.addItems(name);

    return objectsCollection[name];
}

function plc_readObjects(cb) {
    connection.readAllItems((err, values) => {
        if(err){
            console.log("[ERROR] Values read error.");
            return false;
        }else {
            cb(values)
        }
    });
}

function plc_getConnectionStatus() {
    return isConnected;
}

module.exports = { plc_connect, plc_addObject, plc_readObjects, plc_getConnectionStatus };
