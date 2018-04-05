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

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('extension.formatTutorials', () => {
        // The code you place here will be executed every time your command is executed

        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor !== undefined) {
            const document = activeEditor.document;
            const formatter = new TutorialFormatter();
            const text = activeEditor.document.getText();

            let reformatted;
            try {
                reformatted = formatter.format(text);
            } catch (error) {
                error.getLintMessages().forEach((lintErr) => {
                    vscode.window.showErrorMessage(
                        `${error.message} - "${lintErr.message}" => ` +
                        `${lintErr.line}: "${lintErr.source}"`
                    );
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
                    reformatted
                );
            });

            vscode.debug.activeDebugConsole.appendLine('Reformatted Tutorial:');
            vscode.debug.activeDebugConsole.appendLine(reformatted);

            vscode.window.showInformationMessage('Reformatted Tutorial');
        } else {
            vscode.window.showErrorMessage('The tutorial must be open in an active editor');
        }
    });

    context.subscriptions.push(disposable);
}
