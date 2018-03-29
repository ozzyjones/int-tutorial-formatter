
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
        output = this._addCodeCollapseSnippets(output);
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

    /**
     * Beautify all JS snippets via the NPM package "js-beautify"
     * 
     * @param input all text to process
     */
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
                    const prettyCodeSnippet = beautify(uglyCodeSnippet, {
                        break_chained_methods: true,
                        jslint_happy: true,
                        wrap_line_length: 100
                    });
                    input = input.replace(uglyCodeSnippet, prettyCodeSnippet.trim());
                }
            });

            m = regex.exec(input);
        }
        return input;
    }

    /**
     * Add HTML code collapse snippets below every code block
     * (Note: The JS definitions 'tutorialpagelogic' and 'jquery' still need to be added)
     * 
     * @param input all text to process
     */
    private _addCodeCollapseSnippets(input: string): string {
        input = this._makeCodeBlocksCollapsible(input);
        input = this._addSeeMoreLessCode(input);
        return input;
    }

    private _makeCodeBlocksCollapsible(input: string): string {
        // Matching this regex means that the "Show/Hide More Code..." snippets must be added
        const regex = /<div\s.*?class="code">\s*<pre>\s*<code\s.*?class="javascript">/g;
        let m = regex.exec(input);

        while (m !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            const snippet = '<div class="code collapsed"><pre><code class="javascript">';
            input = input.replace(m[0], snippet);

            m = regex.exec(input);
        }
        return input;
    }

    private _addSeeMoreLessCode(input: string): string {
        // Matching this regex means that the "Show/Hide More Code..." snippets must be added
        const regex = /([^\n]*)<\/code>\s*<\/pre>\s*<\/div>(\s*)<\/div>/g;
        let m = regex.exec(input);

        while (m !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // let codeLeftPadding = m[1].length;  // Number of characters on the line before the code block
            let divLeftPadding = m[2]           // Number of characters on the line before the div element
            .replace('\n','')
            .replace('\r','').length;
            let codeLeftPadding = divLeftPadding + 4;   // 4 spaces indented from the closing div

            // Example:
            // });</code></pre></div>
            // ___<div ...See More...></div>
            // ___<div ...See Less...></div>
            // </div>

            let snippet = m[1] + '</code></pre></div>\n' + 
            ' '.repeat(codeLeftPadding) + '<div class="see-more-container" onclick="togglecode(event)"><a>See More Code...</a></div>\n' + 
            ' '.repeat(codeLeftPadding) + '<div class="see-less-container hidden" onclick="togglecode(event)"><a>See Less Code...</a></div>\n' + 
            ' '.repeat(divLeftPadding) + '</div>';

            input = input.replace(m[0], snippet);

            m = regex.exec(input);
        }
        return input;
    }
}
