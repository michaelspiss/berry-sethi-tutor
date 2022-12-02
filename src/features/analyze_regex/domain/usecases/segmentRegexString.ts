export type formatType = "quantifier"|"error"|"terminal"|"group"|"alteration"|"escaped";

/**
 * Segments a regex string by symbol type. Expects the string to be a valid regex
 * @param regex
 * @param errorPos
 */
export default function segmentRegexString(regex: string, errorPos: number) {
    let lastType = "";
    const formattedRegex : {type: formatType, symbols: string, key: string}[] = [];

    function insertSymbol(type: formatType, symbol: string) {
        if(lastType === type) {
            formattedRegex[formattedRegex.length - 1].symbols += symbol
        } else {
            formattedRegex.push({type: type, symbols: symbol, key: "segment_"+formattedRegex.length});
            lastType = type;
        }
    }

    for(let i = 0; i<regex.length; i++) {
        const symbol = regex.at(i);

        if(i === errorPos) {
            insertSymbol("error", symbol!);
            continue;
        }

        switch (symbol) {
            case '*':
            case '?':
            case '+':
                insertSymbol("quantifier", symbol);
                break;
            case '|':
                insertSymbol("alteration", symbol);
                break;
            case '(':
            case ')':
                insertSymbol("group", symbol);
                break;
            case '\\':
                insertSymbol("escaped", symbol);
                let nextSymbol = regex.at(++i);
                if(nextSymbol) {
                    insertSymbol("escaped", nextSymbol);
                }
                break;
            default:
                insertSymbol("terminal", symbol!);
        }
    }

    return formattedRegex;
}
