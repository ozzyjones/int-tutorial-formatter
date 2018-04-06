
export class ESLintMessagesError extends Error {

    private _lintMessages;
    private _codeSnippet;

    /**
     * @param errMessage Error Message
     * @param eslintMessages Messages from ESLint
     * @param codeSnippet Full Code Snippet
     */
    constructor(errMessage, eslintMessages, codeSnippet) {
        super(errMessage);
        this._lintMessages = eslintMessages;
        this._codeSnippet = codeSnippet;
    }

    /**
     * Get ESLint Messages
     */
    public getLintMessages() {
        return this._lintMessages;
    }

    /**
     * Get ESLint Messages
     */
    public getCodeSnippet() {
        return this._codeSnippet;
    }
}
