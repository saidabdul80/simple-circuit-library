const DMMjs = require('..');
const Util = require('./util');

(async () => {

    const my34401 = new DMMjs(Util.findxNixSerialPort());

    await my34401.open();
    await my34401.linkDevice();

    console.log('DC Volt:', await my34401.readDCVoltage());
    console.log('AC Volt:', await my34401.readACVoltage());
    console.log('DC amps:', await my34401.readDCCurrent());
    console.log('AC amps:', await my34401.readACCurrent());
    console.log('Frequency:', await my34401.readFrequency());
    console.log('Resistance:', await my34401.readResistance());

    await my34401.unlinkDevice();
    await my34401.close();

})();