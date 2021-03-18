# DMM.js

Node.js RS232 API for compatible DMM (Digital Multimeter) and other SCPI-compatible devices.

![logo](media/dmmjs.png)

> **Storytime section:** I got a spare Agilent 34401A DMM at home, but the display is not working properly (some segments are faulty). I decided to perform readings through the serial port, but I cannot find any suitable library or tool under unix / macOS, so I decided to make my own one.

## Installation

```bash
npm i dmm.js-serial
```

## Quick usage

```js
const DMMjs = require('dmm.js-serial');
const my34401a = new DMMjs('/dev/tty.usbserial');

(async () => {

    await my34401.open();
    await my34401.linkDevice();
    let info = my34401.getDeviceInfo();
    console.log('Got device:', info.id, '( version', info.version, ')');

    let vMeas = await my34401.readDCVoltage();
    console.log('Read', vMeas, 'V');

    // Got device: HEWLETT-PACKARD,34401A ( version 1998.0 )
    // Read 10.6414 V

});
```

## Examples

Check the `examples` folder and try the available scripts!

- `connect` will link, read device id and version, unlink
- `errors` produces some errors, then reads the result codes
- `read` perform DC & AC voltage and current measurement, plus resistance (2W) and frequency
- `selftest` runs the device selftest and returns the pass/fail status
- `terminals` reads the current terminals position, wait for the user to switch it, displays new value
- `text` will play with the display function and show some messages

## RS232 setup

This library is based on the famous [serialport](https://www.npmjs.com/package/serialport) package and will inherit some of its config properties. After many hours, I finally found a working configuration for it so the communication can be established between the device and my laptop, but if you have issues on your side, you can pass different setting values during the DMM initialisation:

```js
const customConfig = {
    rxTimeout: 10000,   // timeout (ms) for the read command
    txPause: 500,       // delay (ms) to wait after a command
    
    // serialport library config
    baudRate: 9600,
    stopBits: 2,
    dataBits: 8,
    parity: "none",
    rtscts: true,
    xon: true,
    xoff: true,
    xany: true,

    // hardware flow config
    flowControl: {
        dsr: true,
        dtr: true,
        cts: true,
        brk: false,
        rts: false
    }
};

const myDevice = new DMMjs('/dev/serial123', customConfig);
```

Most of the time, you'll just have to change the `baudRate` and `parity` values. Under Agilent / Keysight / HP devices, you can see the current setting value under:

```
[MENU] > [E: I/O] > 3: BAUD RATE
[MENU] > [E: I/O] > 4: PARITY
[MENU] > [E: I/O] > 5: LANGUAGE (ensure SCPI is set)
```

## API

### Opening the serial port connection

```js
myDevice.open()
```

### Link device

Will set the device in remote mode (if not already), and reset / clear instrument state if the `keepState` property is set to false.

```js
myDevice.linkDevice(keepState)
```

### Unlink device

Will set the device in local mode.

```js
myDevice.unlinkDevice(keepState)
```

### Closing the serial port connection

```js
myDevice.close(keepState)
```

### Get device information

Must be done once the device has been linked.

```js
myDevice.getDeviceInfo()
```

### Display text on the DMM's screen

Depending of your device, text might be truncated

```js
setDisplayText("Hello DMM!")
```

### Clear display text

```js
clearDisplayText()
```

### Enable / disable device display

```js
setDisplayVisibility(isON)
```

### Run device selftest

Returns 0 if "PASS", -1 or -2 if failed

```js
selfTest()
```

### Get terminals position

Returns "front" or "back" depending of the terminals switch position

```js
getTerminalsPosition()
```

### Get device errors

Returns an object with the code id and error message.

Run it multiple time to read and flush all the errors.

```js
getErrors()
```

### Reset device

Only the `clearDeviceStatus` will clear the pending error buffer

```js
resetDevice()
clearDeviceStatus()
```

### Perform DMM measurements

Each value is returned as a float object, mesurements are done using the `CONF ... AUTO`, and then `READ?` commands. No range or trigger is set (immediate reading).

```js
readDCVoltage()
readACVoltage()
readDCCurrent()
readACCurrent()
readResistance()
readFrequency()
```

Please note that the `readResistance` method only uses two wires. For the 4T sensing (Kelvin mode), you'll need to use `readCommand` with `CONFigure:FRESistance` SCPI command.

### Write commands to DMM

Command must be a SCPI-compatible string (refer to the *Documentation* section below)

After each `write` command operation, a delay is applied (see `txPause` in the config object)

```js
writeCommand(command)
```

### Read commands from DMM

Command must be a SCPI-compatible string (refer to the *Documentation* section below)

If `timeout` is set (in ms), it overrides the default `rxTimeout` from the config object.

```js
readCommand(command, timeout)
```

## Debugging

Verbose can be enabled by setting the given property when passing the configuration file for the device instance:

```js
const myDevice = new DMMjs('/dev/serial123', {verbose: true});
```

This will log all commands and raw response strings shared between the device and the library.

## Documentation

- Command list: http://www.doe.carleton.ca/~nagui/labequip/meter/34401A_User's%20Guide.pdf

- Error codes: http://rfmw.em.keysight.com/spdhelpfiles/n8900/webhelp/US/Content/__A_Home_Page/SCPI_Error_Messages.htm