const DMMjs = require('..');
const Util = require('./util');

(async () => {

    const my34401 = new DMMjs(Util.findxNixSerialPort());

    await my34401.open();
    await my34401.linkDevice();

    let st = await my34401.selfTest();
    console.log('Self test result:', st, '=>', (st === 0 ? 'OK!': 'FAIL...'));

    await my34401.unlinkDevice();
    await my34401.close();

})();