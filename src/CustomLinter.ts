
import { ESLintMessagesError } from './ESLintMessagesError';

/**
 * A custom linter with pre- and post- code formatting
 */
export class CustomLinter {

    /**
     * A placeholder for '...' in code preformatting
     */
    private HELLIP = "'&hellip;'";

    /**
     * A placeholder for '{...}' in code preformatting
     */
    private HELLIP_OBJ = `{${this.HELLIP}: ${this.HELLIP}}`;

    /**
     * ESLint verify and fix code snippet
     * @throws {ESLintMessagesError}
     */
    public verifyAndFix(code: string): string {
        try {
            code = this._preformat(code);
            code = this._lint(code);
            code = this._postformat(code);
            return code;
        } catch (error) {
            throw error;
        }
    }

    /**
     * ESLint code snippet
     * @param codeSnippet code
     * @throws {ESLintMessagesError}
     */
    private _lint(codeSnippet: string): string {
        const Linter = require('eslint').Linter;
        const linter = new Linter();

        // Code-Base Rules
        const codeBaseRules = linter.verifyAndFix(codeSnippet, {
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
                // 'array-bracket-newline': ['error', 'consistent'],
                // 'array-bracket-spacing': ['error', 'never'],
                // 'array-element-newline': ['error', {'multiline': true}],
                'capitalized-comments': [
                    'error',
                    'always',
                    {
                        'ignoreConsecutiveComments': true,
                        'ignorePattern': '[\\w]+\\(\\)'     // Ignore method calls (e.g. "// validate()")
                    }
                ],
                // 'curly': ['error', 'multi-line'],
                'func-call-spacing': ['error', 'never'],
                'newline-per-chained-call': ['error', {'ignoreChainWithDepth': 1}],
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
                tutorialRules.messages,
                codeSnippet
            );
        }
        return tutorialRules.output;
    }

    /**
     * Format code snippet so that it can undergo ESLinting
     * @description
     * In order to undergo ESLint formatting, the code snippet must
     * be valid Javascript.  A common situation in the INT tutorials,
     * for example, is to have snippets with '...'.  This is not valid
     * and needs to (temporarily) be replaced so that the linter
     * can run correctly.
     * @param codeSnippet code
     */
    private _preformat(codeSnippet): string {

        // A regex to replace function(){...}
        const ELLIP_FUNC_REGEX = /function\s*\([^\(]*\)\s*{\s*\.{3}\s*}/g;
        codeSnippet = codeSnippet.replace(ELLIP_FUNC_REGEX, `function(){${this.HELLIP}}`);

        // A regex to capture ellipsis parameters - e.g. doSomething( ... )
        const ELLIP_PARAM_REGEX = /\(([{\s]*)\.{3}([}\s]*)\)/g;
        codeSnippet = codeSnippet.replace(ELLIP_PARAM_REGEX, (match, predots, postdots) => {
            const pre = predots.trim();
            const post = postdots.trim();

            // ({...}) => ({'&hellip;': '&hellip;'})        <= Must be valid JS
            // (...)   => ('&hellip;')
            const contents = (pre === '{' && post === '}') ? `${this.HELLIP}: ${this.HELLIP}` : this.HELLIP;
            const p = '(' + pre + contents + post + ')';
            return p;
        });
        const ELLIP_PARAM_REGEX_CURLY = /({[\s]*)\.{3}([\s]*})/g;   // { ... }
        codeSnippet = codeSnippet.replace(ELLIP_PARAM_REGEX_CURLY, `{${this.HELLIP}: ${this.HELLIP}}`);
        return codeSnippet;
    }

    /**
     * Revert preformatting
     * @param codeSnippet code
     */
    private _postformat(codeSnippet): string {
        codeSnippet = codeSnippet.replace(new RegExp(this.HELLIP_OBJ, 'g'), '{...}');
        codeSnippet = codeSnippet.replace(new RegExp(this.HELLIP, 'g'), '...');
        return codeSnippet;
    }
}
