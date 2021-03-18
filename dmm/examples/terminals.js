const DMMjs = require('..');
const Util = require('./util');

(async () => {

    const my34401 = new DMMjs(Util.findxNixSerialPort());
    await my34401.open();
    
    await my34401.linkDevice();

    let termPos = await my34401.getTerminalsPosition(), newPos = null;
    console.log('Current device terminals position is "', termPos, '"');
    console.log('Press the Front/Rear switch on your device now...');
    
    do {
        newPos = await my34401.getTerminalsPosition();
    } while (newPos === termPos);

    console.log('Change detected! New terminals position is "', termPos, '"');

    await my34401.unlinkDevice();
    await my34401.close();

})();
