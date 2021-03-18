const Util = module.exports;
const fs = require('fs');

const DEV_ENDPOINT_PATH = '/dev';
const xNIX_SERIAL_DEVICE = 'tty.usbserial';

Util.findxNixSerialPort = () => {
    const serialDeviceToPick = fs.readdirSync(DEV_ENDPOINT_PATH).filter(d => d.startsWith(xNIX_SERIAL_DEVICE));
    if (serialDeviceToPick.length >= 1) return `${DEV_ENDPOINT_PATH}/${serialDeviceToPick}`;
    else return null;
}