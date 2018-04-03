
import htmlEntities = require('html-entities');
import beautify = require('js-beautify');

export class CodeFormatter {

    /**
     * Format Tutorial Text
     * @returns {string} reformatted tutorial text
     */
    public format(codeSnippet: string): string {
        const Entities = require('html-entities').AllHtmlEntities;
        const entities = new Entities();
        codeSnippet = entities.decode(codeSnippet);
        codeSnippet = this._putSpacesAfterCommentInitializations(codeSnippet);
        codeSnippet = this._capitalizeFirstWordInComment(codeSnippet);
        codeSnippet = this._makeThreeDotLinesIntoComments(codeSnippet);
        codeSnippet = this._beautifyJavascript(codeSnippet);
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
     * Put spaces after comment initializations
     *
     * @example "//abc" => "// abc"
     * @param input all text to process
     */
    private _putSpacesAfterCommentInitializations(input: string): string {
        return input.replace(/\/\/(?=[^\s])/g, '// ');
    }

    /**
     * Capitalize the first word in every javascript comment
     *
     * @example "// abc" => "// Abc"
     * @param input all text to process
     */
    private _capitalizeFirstWordInComment(input: string): string {
        const regex = /\/\/\s[a-z]/g;
        let m = regex.exec(input);

        while (m !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                const lowercaseCommentStart = match;
                const lowerLetter = lowercaseCommentStart.charAt(3);
                input = input.replace(lowercaseCommentStart, '// ' + lowerLetter.toUpperCase());
            });

            m = regex.exec(input);
        }
        return input;
    }

    /**
     * Beautify all JS snippets via the NPM package "js-beautify"
     *
     * @param input all text to process
     * @returns {string} pretty code snippet
     */
    private _beautifyJavascript(uglyCodeSnippet: string): string {
        const prettyCodeSnippet = beautify(uglyCodeSnippet, {
            break_chained_methods: true,
            jslint_happy: true,
            wrap_line_length: 100
        });
        return prettyCodeSnippet;
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
