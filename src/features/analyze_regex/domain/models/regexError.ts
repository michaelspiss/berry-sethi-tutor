/**
 * Returned by buildRegexTree for errors within the user-supplied regex string
 */
export default class RegexError {
    /**
     * A short description of the error
     */
    readonly title: string;

    /**
     * Should include a tip on how to resolve the note's cause
     */
    readonly message: string;

    /**
     * The position of the note's cause in the original regex string
     */
    readonly position: number;

    constructor(title: string, message: string, position: number) {
        this.title = title;
        this.message = message;
        this.position = position;
    }
}

export const RegexErrors = {
    alterationMissingFirstParameter: (position: number) => {
        return new RegexError(
            "Alteration is missing its first parameter",
            "helpful hint here",
            position,
        );
    },
    alterationMissingSecondParameter: (position: number) => {
        return new RegexError(
            "Alteration is missing second parameter",
            "Helpful message",
            position,
        );
    },
    groupMissingClosingParenthesis: (position: number) => {
        return new RegexError(
            "Missing closing parenthesis for",
            "",
            position,
        );
    },
    groupMissingOpeningParenthesis: (position: number) => {
        return new RegexError(
            "Closing group that has never been opened",
            "",
            position,
        );
    },
    cannotApplyQuantifierToAlteration: (position: number) => {
        return new RegexError(
            "Quantifier cannot be applied to alteration operator",
            "message with hint",
            position,
        );
    },
    quantifierRequiresNode: (position: number) => {
        return new RegexError(
            "Quantifier requires node to quantify",
            "message with hint",
            position,
        );
    },
    cannotQuantifyQuantifier: (position: number) => {
        return new RegexError(
            "Cannot quantify quantifier",
            "mesage with hint",
            position,
        );
    }
}
