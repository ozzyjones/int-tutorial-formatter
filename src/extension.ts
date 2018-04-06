'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TutorialFormatter } from './TutorialFormatter';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    vscode.debug.activeDebugConsole.appendLine('Formatting INT Tutorials - Extension Active');
    vscode.debug.activeDebugConsole.appendLine('');

    const formatCodeDisposable = vscode.commands.registerCommand('extension.formatCode', () => {
        formatTutorial('code');     // Code Only
    });

    const formatTutorialsDisposable = vscode.commands.registerCommand('extension.formatTutorials', () => {
        formatTutorial('all');      // Code and all other attributes
    });

    function formatTutorial(option: string): void {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor !== undefined) {
            const document = activeEditor.document;
            const formatter = new TutorialFormatter();
            const text = activeEditor.document.getText();

            let previousReformatting;
            let latestReformatting = text.slice();
            try {
                do {
                    previousReformatting = latestReformatting.slice();
                    latestReformatting = formatter.format(previousReformatting, option);
                }while (previousReformatting !== latestReformatting);
            } catch (error) {
                error.getLintMessages().forEach((lintErr) => {
                    const msg =
                    `${error.message} - "${lintErr.message}" => ` +
                    `${lintErr.line}: "${lintErr.source}"`;

                    vscode.window.showErrorMessage(msg);
                    vscode.debug.activeDebugConsole.appendLine(msg);
                    vscode.debug.activeDebugConsole.appendLine(error.getCodeSnippet());
                });
                return;
            }

            // Replace all text in the active editor with the reformatted text
            activeEditor.edit((builder) => {
                builder.replace(
                    new vscode.Range(
                        document.positionAt(0),
                        document.positionAt(text.length)
                    ),
                    latestReformatting
                );
            });

            vscode.debug.activeDebugConsole.appendLine('Reformatted Tutorial:');
            vscode.debug.activeDebugConsole.appendLine(latestReformatting);

            vscode.window.showInformationMessage('Reformatted Tutorial');
        } else {
            vscode.window.showErrorMessage('The tutorial must be open in an active editor');
        }
    }

    context.subscriptions.push(formatTutorialsDisposable);
    context.subscriptions.push(formatCodeDisposable);
}
