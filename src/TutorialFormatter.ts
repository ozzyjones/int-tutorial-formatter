
import htmlparser = require('htmlparser2');
import titlecase = require('titlecase');
import { CodeFormatter } from './CodeFormatter';

export class TutorialFormatter {

    /**
     * Format Tutorial Text
     * @returns {string} reformatted tutorial text
     */
    public format(input: string): string {
        let output;
        output = this._titleCaseHeading(input);
        output = this._titleCaseSubHeadings(output);
        output = this._addCodeCollapseSnippets(output);
        output = this._renameReferencesLink(output);

        const codeFormatter = new CodeFormatter();
        const snippets = this._getCodeSnippets(output);
        snippets.forEach((uglyCodeSnippet) => {
            const prettyCodeSnippet = codeFormatter.format(uglyCodeSnippet);
            output = output.replace(uglyCodeSnippet, prettyCodeSnippet);
        });

        return output;
    }

    /**
     * Title case the main header (h2) on the page
     *
     * @example "Real-time Demo" => "Real-Time Demo"
     * @param input all text to process
     */
    private _titleCaseHeading(input: string): string {
        const m = input.match(/<h2>([^<]+)<\/h2>/);
        if (m !== null) {
            const title = titlecase(m[1]);
            input = input.replace(m[0], `<h2>${title}</h2>`);
        }
        return input;
    }

    /**
     * Title case the table of contents
     *
     * @param input all text to process
     */
    private _titleCaseSubHeadings(input: string): string {
        const tocRegex = /<li><a\s+href="#([^"]+)">([^<]+)<\/a><\/li>/g;
        let tocMatches = tocRegex.exec(input); // Table of Contents

        while (tocMatches !== null) {
            if (tocMatches.index === tocRegex.lastIndex) {
                tocRegex.lastIndex++;
            }

            const id = tocMatches[1];
            const title = titlecase(tocMatches[2]);
            input = input.replace(tocMatches[0], `<li><a href="#${id}">${title}</a></li>`);
            tocMatches = tocRegex.exec(input);
        }

        const subheaderRegex = /<h3><a\s+id="([^"]+)">([^<]+)<\/a><\/h3>/g;
        let subheaderMatches = subheaderRegex.exec(input);
        while (subheaderMatches !== null) {
            if (subheaderMatches.index === subheaderRegex.lastIndex) {
                subheaderRegex.lastIndex++;
            }

            const id = subheaderMatches[1];
            const title = titlecase(subheaderMatches[2]);
            input = input.replace(subheaderMatches[0], `<h3><a id="${id}">${title}</a></h3>`);
            subheaderMatches = subheaderRegex.exec(input);
        }

        return input;
    }

    /**
     * Extract JS Code snippets from the HTML tutorial
     *
     * @param input HTML Tutorial
     * @returns {string[]} Array of code snippets
     */
    private _getCodeSnippets(input: string): string[] {
        const snippets = [];

        let code = '';
        let isInOpenTag = false;
        const parser = new htmlparser.Parser({
            onclosetag: (tagname) => {
                if (tagname === 'code' && isInOpenTag) {
                    isInOpenTag = false;
                    snippets.push(code);
                    code = '';
                }
            },
            onopentag: (tagname, attribs) => {
                if (tagname === 'code' && attribs.class === 'javascript') {
                    isInOpenTag = true;
                }
            },
            ontext: (text) => {
                if (isInOpenTag) {
                    code += (text !== undefined) ? text : '';
                }
            }
        }, {decodeEntities: false});
        parser.write(input);
        parser.end();

        return snippets;
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
            const divLeftPadding = m[2]           // Number of characters on the line before the div element
            .replace('\n', '')
            .replace('\r', '').length;
            const codeLeftPadding = divLeftPadding + 4;   // 4 spaces indented from the closing div

            // Example:
            // });</code></pre></div>
            // ___<div ...See More...></div>
            // ___<div ...See Less...></div>
            // </div>

            const snippet = m[1] + '</code></pre></div>\n' +
            ' '.repeat(codeLeftPadding) +
            '<div class="see-more-container" onclick="togglecode(event)"><a>See More Code...</a></div>\n' +
            ' '.repeat(codeLeftPadding) +
            '<div class="see-less-container hidden" onclick="togglecode(event)"><a>See Less Code...</a></div>\n' +
            ' '.repeat(divLeftPadding) + '</div>';

            input = input.replace(m[0], snippet);

            m = regex.exec(input);
        }
        return input;
    }

    /**
     * Rename references link if it is not named 'References'
     *
     * @param input all text to process
     */
    private _renameReferencesLink(input: string): string {
        const regex = /<li>\s*<a\s+.*?href="#References">(.*)<\/a><\/li>/;
        const m = input.match(regex);
        if (m !== null) {
            const link = m[0];
            const linkName = m[1];
            if (linkName !== 'References') {
                input = input.replace(link, '<li><a href="#References">References</a></li>');
            }
        }
        return input;
    }
}
