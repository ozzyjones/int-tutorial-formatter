
import htmlEntities = require('html-entities');
import beautify = require('js-beautify');
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
            'break_chained_methods': true,
            'jslint_happy': true,
            'wrap_line_length': 110
        });
        return prettyCodeSnippet;
    }

    /**
     * ESLint Code Snippet
     *
     * @param input Javascript code snippet
     * @throws {ESLintMessagesError}
     */
    private _eslint(input: string): string {
        const Linter = require('eslint').Linter;
        const linter = new Linter();

        // Code-Base Rules
        const codeBaseRules = linter.verifyAndFix(input, {
            'rules': {
                'brace-style': [2, '1tbs', { 'allowSingleLine': false }],
                'comma-dangle': [2, 'never'],
                'comma-spacing': [2, {'before': false, 'after': true}],
                'dot-location': [2, 'property'],
                'eqeqeq': [2, 'smart'],
                'indent': [2, 4, {'SwitchCase': 1}],
                'key-spacing': [2, {'beforeColon': false, 'afterColon': true}],
                'no-else-return': 2,
                'no-extra-semi': 2,
                'operator-linebreak': [2, 'after'],
                'semi-spacing': [2, {'before': false, 'after': true}],
                'space-before-function-paren': [2, {
                    'anonymous': 'always',
                    'asyncArrow': 'always',
                    'named': 'always'
                }],
                'space-infix-ops': [2, {'int32Hint': false}],
                'spaced-comment': 1,
                'yoda': [2, 'never', { 'exceptRange': true }]
            }
        });

        // Custom Rules for Tutorials
        const tutorialRules = linter.verifyAndFix(codeBaseRules.output, {
            'rules': {
                'capitalized-comments': [
                    'error',
                    'always',
                    {
                        'ignoreConsecutiveComments': true,
                        'ignorePattern': '[\\w]+\\(\\)'     // Ignore method calls (e.g. "// validate()")
                    }
                ],
                'curly': ['error', 'multi-line'],
                'func-call-spacing': ['error', 'never'],
                'no-floating-decimal': 'error',
                'no-lonely-if': 'error',
                'no-multi-spaces': ['error', {'ignoreEOLComments': true}],
                'no-multiple-empty-lines': ['error', {'max': 1}],
                'no-trailing-spaces': ['error', {'ignoreComments': true}],
                'quote-props': ['error', 'consistent'],
                'quotes': ['error', 'single']
            }
        });

        if (tutorialRules.messages.length > 0) {
            throw new ESLintMessagesError(
                'ESLint Error',
                tutorialRules.messages);
        }

        return tutorialRules.output;
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
