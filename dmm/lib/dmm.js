const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const SCPI = require('./definitions');

const DEFAULT_CONFIG = {
    rxTimeout: 10000,
    txPause: 500,
    baudRate: 9600,
    stopBits: 2,
    dataBits: 8,
    parity: "none",
    rtscts: true,
    xon: true,
    xoff: true,
    xany: true,
    flowControl: {
        dsr: true,
        dtr: true,
        cts: true,
        brk: false,
        rts: false
    },
    verbose: false
}

class DMMjs {
    constructor(portPath, config = {}) {
        if (!portPath) throw new Error("DMMjs requires a serial port at least!");
        this.portPath = portPath;
        this.config = {...DEFAULT_CONFIG, ...config};
        this.port = null;
    }

    open() {
        return new Promise((resolve, reject) => {
            this.port = new SerialPort(this.portPath, {...this.config}, (err) => {
                if (err) return reject(err);
                this.port.set({...this.config.flowControl});
                return resolve();
            });
            this.parser = new Readline();
            this.port.pipe(this.parser);
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.port.close((err) => {
                this.parser.unpipe(this.port);
                this.port = null;
                if (err) return reject(err);
                return resolve();
            });
        });
    }

    getDeviceInfo() {
        return this.deviceInfo;
    }

    async linkDevice(keepState) {
        if (!keepState) {
            await this.resetDevice();
            await this.clearDeviceStatus();
        }
        await this.writeCommand(SCPI.REMOTE);
        this.deviceInfo = {
            id: await this.readCommand(SCPI.GET_ID),
            version: await this.readCommand(SCPI.GET_VERSION)
        }
    }

    async unlinkDevice() {
        await this.writeCommand(SCPI.LOCAL);
    }

    async setDisplayText(shortText) {
        await this.writeCommand(`${SCPI.SET_DISPLAY_TEXT} "${shortText}"`);
    }

    async clearDisplayText() {
        await this.writeCommand(SCPI.CLEAR_DISPLAY_TEXT);
    }

    async setDisplayVisibility(isON) {
        await this.writeCommand(`${SCPI.DISPLAY} ${isON ? 'ON' : 'OFF'}`);
    }

    async selfTest() {
        // +0 if success / -X if error
        return parseInt(await this.readCommand(SCPI.SELF_TEST, 45000), 10);
    }

    async getTerminalsPosition() {
        return await this.readCommand(SCPI.TERMINALS) === 'FRON' ? 'front' : 'rear';
    }

    async getErrors() {
        let errs = await this.readCommand(SCPI.GET_ERRORS);
        // parse errors if we can
        let eObj = null;
        try {
            let es = errs.split(",");
            eObj = {
                code: parseInt(es[0], 10),
                message: es[1].replace(/"/g,"")
            }
        } catch(e) {};
        return eObj || errs;
    }

    async resetDevice() {
        await this.writeCommand(SCPI.RESET);
    }

    async clearDeviceStatus() {
        await this.writeCommand(SCPI.CLEAR);
    }

    async readDCVoltage() {
        await this.writeCommand(SCPI.CONF_DCV);
        const v = await this.readCommand(SCPI.READ);
        return parseFloat(v);
    }

    async readACVoltage() {
        await this.writeCommand(SCPI.CONF_ACV);
        const v = await this.readCommand(SCPI.READ);
        return parseFloat(v);
    }

    async readDCCurrent() {
        await this.writeCommand(SCPI.CONF_DCA);
        const v = await this.readCommand(SCPI.READ);
        return parseFloat(v);
    }

    async readACCurrent() {
        await this.writeCommand(SCPI.CONF_ACA);
        const v = await this.readCommand(SCPI.READ);
        return parseFloat(v);
    }

    async readResistance() {
        await this.writeCommand(SCPI.CONF_RES);
        const v = await this.readCommand(SCPI.READ);
        return parseFloat(v);
    }

    async readFrequency() {
        await this.writeCommand(SCPI.CONF_FREQ);
        const v = await this.readCommand(SCPI.READ);
        return parseFloat(v);
    }

    writeCommand(command) {
        if (this.config.verbose) console.log('writeCommand', command);
        return new Promise((resolve, reject) => {
            this.port.write(`${command}\n`, (err) => {
                if (err) return reject(err);
                setTimeout(() => {
                    return resolve();
                }, this.config.txPause);
            });
        });
    }
    
    readCommand(command, timeout) {
        if (!timeout) timeout = this.config.rxTimeout;
        if (this.config.verbose) console.log('readCommand', command, 'with timeout', this.config.rxTimeout, 'ms');
        return new Promise((resolve, reject) => {
            this.port.write(`${command}\n`, (err) => {
                if (err) return reject(err);
                let rxTimeout = setTimeout(() => {
                    reject(new Error(`Command "${command}" failed, timeout exceeded ${timeout} ms`));
                }, timeout);
                this.parser.once('data', (line) => {
                    clearTimeout(rxTimeout);
                    setTimeout(() => {
                        if (this.config.verbose) console.log('readCommand', line);
                        return resolve(line.trim());
                    }, this.config.txPause);
                });
            });
        });
    }
}

module.exports = DMMjs;
