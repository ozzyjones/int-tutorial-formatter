
import cheerio = require('cheerio');
import titlecase = require('titlecase');
import { CodeFormatter } from './CodeFormatter';

export class TutorialFormatter {

    private _warnings: string[];

    /**
     * Format Tutorial Text
     * @returns {string} reformatted tutorial text
     * @throws {ESLintMessagesError}
     */
    public format(input: string, option = 'all'): string {
        this._clearWarnings();
        let output = input.slice();

        // Only apply these changes in the format option === 'all'
        if (option === 'all') {
            output = this._titleCaseHeading(output);
            output = this._titleCaseSubHeadings(output);
            output = this._addCodeCollapseSnippets(output);
            output = this._renameReferencesLink(output);
        }

        // Format Code Snippets
        output = this._editCodeSnippets(output);

        return output;
    }

    /**
     * Get warnings raised by the tutorial formatting
     * @returns {string[]} warnings
     */
    public getWarnings(): string[] {
        return this._warnings;
    }

    /**
     * Clear warnings raised by the tutorial formatting
     */
    private _clearWarnings() {
        this._warnings = [];
    }

    /**
     * Title case the main header (h2) on the page
     *
     * @example "Real-time Demo" => "Real-Time Demo"
     * @param input all text to process
     */
    private _titleCaseHeading(input: string): string {
        const $ = cheerio.load(input, {'decodeEntities': false});
        $('h2').text(function() {
            return titlecase($(this).text());
        });
        return $.html();
    }

    /**
     * Title case the table of contents and sub-headers
     *
     * @param input all text to process
     */
    private _titleCaseSubHeadings(input: string): string {
        const $ = cheerio.load(input, {'decodeEntities': false});

        // Table of Contents
        $('li>a').text(function() {
            return titlecase($(this).text());
        });

        // Sub Headers
        $('h3>a').text(function() {
            return titlecase($(this).text());
        });

        return $.html();
    }

    /**
     * Extract JS Code snippets from the HTML tutorial
     *
     * @param input HTML Tutorial
     * @returns {string} Tutorial with formatted code snippets
     * @throws {ESLintMessagesError}
     */
    private _editCodeSnippets(input: string): string {
        const codeFormatter = new CodeFormatter();
        const $ = cheerio.load(input, {'decodeEntities': false});
        const codeSelector = 'div>pre>code.javascript';
        if ($(codeSelector).length === 0) {
            this._warnings.push(
                `No code snippets found; verify that the following selector has matches: ${codeSelector}`);
        }
        $(codeSelector).each(function(index) {
            let prettyCodeSnippet;
            const uglyCodeSnippet = $(this).text();
            try {
                prettyCodeSnippet = codeFormatter.format(uglyCodeSnippet);
            } catch (error) {
                throw error;
            }
            $(this).text(prettyCodeSnippet);
        });
        return $.html();
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

    /**
     * Add 'collapsed' class to javascript code blocks
     *
     * @example <div class="code collapsed"><pre><code class="javascript">
     * @param input
     */
    private _makeCodeBlocksCollapsible(input: string): string {
        const $ = cheerio.load(input, {'decodeEntities': false});
        $('div.code>pre>code.javascript').parent().parent().addClass('collapsed');
        return $.html();
    }

    /**
     * Add "Show More/Less Code..." snipppets
     *
     * @example
     *   });</code></pre></div>
     *      <div ...See More...></div>
     *      <div ...See Less...></div>
     *   </div>
     * @param input
     */
    private _addSeeMoreLessCode(input: string): string {
        const $ = cheerio.load(input, {'decodeEntities': false});
        const $row = $('div.code>pre>code.javascript').parent().parent().parent();
        if ($row.children().length === 1) {
            $row.append(
                '<div class="see-more-container" onclick="togglecode(event)"><a>See More Code...</a></div>'
            );
            $row.append(
                '<div class="see-less-container hidden" onclick="togglecode(event)"><a>See Less Code...</a></div>'
            );
        }
        return $.html();
    }

    /**
     * Rename references link if it is not named 'References'
     *
     * @param input all text to process
     */
    private _renameReferencesLink(input: string): string {
        const $ = cheerio.load(input, {'decodeEntities': false});
        $('li>a[href*="References"]').text('References');
        return $.html();
    }
}
