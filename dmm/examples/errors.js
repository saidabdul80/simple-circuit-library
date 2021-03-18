const DMMjs = require('..');
const Util = require('./util');

(async () => {

    const my34401 = new DMMjs(Util.findxNixSerialPort());

    await my34401.open();
    await my34401.linkDevice(); // keepState is not set, so we'll clear previous errors here

    // create an error here (bad command)
    await my34401.writeCommand('DMM.js');

    // and another here (out of range, trigger delay is 3600 sec. max)
    await my34401.writeCommand('TRIGger:DELay 4000');

    // read errors till we don't have one anymore
    let errFlag = true;
    let errors = [];
    while (errFlag) {
        let err = await my34401.getErrors();
        if (err.code === 0) errFlag = false;
        errors.push(err);
    }
    await my34401.unlinkDevice();
    await my34401.close();

    // keep only real errors
    let trueErrors = errors.filter(e => e.code !== 0);

    console.log('Device errors:', trueErrors);

})();