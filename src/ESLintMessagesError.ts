
export class ESLintMessagesError extends Error {

    private _lintMessages;

    /**
     * @param errMessage Error Message
     * @param eslintMessages Messages from ESLint
     */
    constructor(errMessage, eslintMessages) {
        super(errMessage);
        this._lintMessages = eslintMessages;
    }

    /**
     * Get ESLint Messages
     */
    public getLintMessages() {
        return this._lintMessages;
    }
}
