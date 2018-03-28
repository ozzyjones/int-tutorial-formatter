
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

    private _putSpacesAfterCommentInitializations(input: string): string {
        return input.replace(/\/\/(?=[^\s])/g, '// ');
    }

    private _capitalizeFirstWordInComment(input: string): string {
        const re = /\/\/\s[a-z]/g
        input.match(re).forEach((lowercaseCommentStart) => {
            const lowerLetter = lowercaseCommentStart.charAt(3);
            input = input.replace(lowercaseCommentStart, '// ' + lowerLetter.toUpperCase());
        });
        return input;
    }
}