
export class TutorialFormatter {

    /**
     * Format Tutorial Text
     * @returns {string} reformatted tutorial text
     */
    public format(input: string): string {
        let output;
        output = this._putSpacesAfterCommentInitializations(input);
        output = this._capitalizeFirstWordInComment(output);
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
        let m;

        while ((m = regex.exec(input)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            
            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                let lowercaseCommentStart = match;
                const lowerLetter = lowercaseCommentStart.charAt(3);
                input = input.replace(lowercaseCommentStart, '// ' + lowerLetter.toUpperCase());
            });
        }
        return input;
    }
}
