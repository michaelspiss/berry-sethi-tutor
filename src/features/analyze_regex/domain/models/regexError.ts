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
