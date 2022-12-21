import { debug } from './settings';

class Log {
    debug(params) {
        if (debug) {
            console.log(params);
        }
    }

    info(params) {
        console.log(params);
    }
}

export const log = new Log();