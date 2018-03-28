
import beautify = require('js-beautify');
export class TutorialFormatter {

    /**
     * Format Tutorial Text
     * @returns {string} reformatted tutorial text
     */
    public format(input: string): string {
        let output;
        output = this._putSpacesAfterCommentInitializations(input);
        output = this._capitalizeFirstWordInComment(output);
        output = this._beautifyJavascript(output);
        return output;
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

    private _beautifyJavascript(input: string): string {
        const regex = /<code\s.*?class=(["'])javascript\1.*?>([^<]*)<\/code>/g;
        let m = regex.exec(input);

        while (m !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                // Capture the code snippet, exclusively
                if (groupIndex === 2) {
                    const uglyCodeSnippet = match;
                    const prettyCodeSnippet = beautify(uglyCodeSnippet);
                    input = input.replace(uglyCodeSnippet, prettyCodeSnippet);
                }
            });

            m = regex.exec(input);
        }
        return input;
    }
}
