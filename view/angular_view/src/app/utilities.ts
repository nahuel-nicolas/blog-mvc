import { debug } from './settings';


export function wordToUpperCase(word: string): string {
    return word[0].toUpperCase() + word.slice(1);
}

export function getLocalDateString(utcDatetimeString: string): string {
    return new Date(utcDatetimeString).toLocaleDateString([], 
        {
            month: '2-digit', 
            day: '2-digit', 
            year: '2-digit', 
            hour: '2-digit', 
            minute:'2-digit', 
            second:'2-digit'
        }
    )
}

class Log {
    debug(params: any) {
        if (debug) {
            console.log(params);
        }
    }

    info(params: any) {
        console.log(params);
    }
}

export const log = new Log();