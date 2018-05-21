
import htmlEntities = require('html-entities');
import beautify = require('js-beautify');
import { CustomLinter } from './CustomLinter';
import { ESLintMessagesError } from './ESLintMessagesError';

export class CodeFormatter {

    /**
     * Format Tutorial Text
     * @returns {string} reformatted tutorial text
     */
    public format(codeSnippet: string): string {
        const entities = new htmlEntities.AllHtmlEntities();
        codeSnippet = entities.decode(codeSnippet);
        codeSnippet = this._makeThreeDotLinesIntoComments(codeSnippet);
        codeSnippet = this._beautifyJavascript(codeSnippet);
        codeSnippet = this._eslint(codeSnippet);
        codeSnippet = this._makeThreeDotLinesIntoComments(codeSnippet);
        codeSnippet = this._encode(codeSnippet);
        return codeSnippet;
    }

    /**
     * Encode HTML Symbols
     *
     * @description Only encode '<' and '>' symbols
     * @param {string} decoded non-encoded HTML
     */
    private _encode(decoded: string): string {
        let encoded = decoded;
        encoded = encoded.replace(/</g, '&lt;');
        encoded = encoded.replace(/>/g, '&gt;');
        return encoded;
    }

    /**
     * Beautify all JS snippets via the NPM package "js-beautify"
     *
     * @param input all text to process
     * @returns {string} pretty code snippet
     */
    private _beautifyJavascript(uglyCodeSnippet: string): string {
        const prettyCodeSnippet = beautify(uglyCodeSnippet, {
            // 'break_chained_methods': true,
            'brace_style': 'collapse,preserve-inline',
            'jslint_happy': true,
            'wrap_line_length': 110
        });
        return prettyCodeSnippet;
    }

    /**
     * ESLint Code Snippet
     *
     * @param codeSnippet Javascript code snippet
     * @throws {ESLintMessagesError}
     */
    private _eslint(codeSnippet: string): string {
        const myLinter = new CustomLinter();
        return myLinter.verifyAndFix(codeSnippet);
    }

    /**
     * Convert ellipses ('...') into comments ('// ...') if they are
     * on a line by themselves
     *
     * @param codeSnippet Javascript code snippet
     */
    private _makeThreeDotLinesIntoComments(codeSnippet: string): string {
        const re = /^\s*\.{3}\s*$/;
        const lines = codeSnippet.split('\n');
        const editedLines = lines.slice(0);
        for (let index = 0; index < lines.length; index++) {
            const editLine = editedLines[index];
            if (editLine.match(re) !== null) {
                editedLines[index] = editLine.replace('...', '// ...');
            }
        }

        return editedLines.join('\n');
    }
}
