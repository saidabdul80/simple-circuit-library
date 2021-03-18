const DMMjs = require('..');
const Util = require('./util');

(async () => {

    const my34401 = new DMMjs(Util.findxNixSerialPort());
    await my34401.open();
    
    await my34401.linkDevice();
    let info = my34401.getDeviceInfo();
    console.log('Got device:', info.id, '( version', info.version, ')');

    await my34401.unlinkDevice();
    await my34401.close();

})();
