/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';
import { findWithCommonPrefix, removeLastExtension } from './util';

interface CounterpartCreationRule {
	from: string;
	to: string;
	languageId?: string;
};
// let counterpartCreationRules: CounterpartCreationRule[] = [
// 	{ "from": ".h", "to": ".c" },
// 	{ "from": ".h", "to": ".m", "languageId": "objective-c" },
// 	{ "from": ".h", "to": ".mm", "languageId": "objective-cpp" },
// 	{ "from": ".hpp", "to": ".cpp" },
// ];

function findCounterpartFilename(counterpartCreationRules: CounterpartCreationRule[], filename: string, languageId?: string): string | undefined {
	const str = filename.toLowerCase();
	
	let counterpart = undefined;
	let counterpartPriority = 0;
	for(const rule of counterpartCreationRules) {
		if(rule.languageId && rule.languageId !== languageId) {
			continue;
		}

		const from = rule.from.toLowerCase();
		const to = rule.to.toLowerCase();

		let newCounterpart = undefined;
		let newCounterpartPriority = 0;
		if(str.endsWith(from)) {
			newCounterpart = filename.slice(0, -from.length) + to;
			newCounterpartPriority = rule.languageId? 4 : 2;
		} else if(str.endsWith(to)) {
			newCounterpart = filename.slice(0, -to.length) + from;
			newCounterpartPriority = rule.languageId? 3 : 1;
		}
		
		if(newCounterpartPriority >= counterpartPriority) {
			counterpart = newCounterpart;
			counterpartPriority = newCounterpartPriority;
		}
	}

	return counterpart;
}

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('switch-to-counterpart.switch', () => {
		const activeDocument = vscode.window.activeTextEditor?.document;
		const activeLanguageId = activeDocument?.languageId;
		const activeFileUri = activeDocument?.uri;
		const activeFile = activeFileUri?.fsPath;
		if(!activeFile) {
			return;
		}

		const activeFileSplit = activeFile.split("/");
		const activeFilename = activeFileSplit.pop();
		if(!activeFilename) {
			return;
		}
		const activeFileDirectory = activeFileSplit.join("/");

		vscode.workspace.fs.readDirectory(vscode.Uri.file(activeFileDirectory)).then((directoryFiles) => {
			const directoryFilenames = directoryFiles.filter((file) => file[1] === vscode.FileType.File).map((file) => file[0]);

			const filenamesWithCommonPrefix = findWithCommonPrefix(removeLastExtension(activeFilename), directoryFilenames);

			const activeFileIndex = filenamesWithCommonPrefix.indexOf(activeFilename);
			const newIndex = (activeFileIndex + 1) % filenamesWithCommonPrefix.length;
			const newFilename = filenamesWithCommonPrefix[newIndex];

			if(newFilename !== activeFilename) {
				// Open the file
				const newFile = `${activeFileDirectory}/${newFilename}`;
				vscode.commands.executeCommand("vscode.open", vscode.Uri.file(newFile));

				return;
			}

			// At this point, we couldn't find an existing counterpart.

			// Figure out what the counterpart filename would be.
			const counterpartCreationRules = vscode.workspace.getConfiguration("switch-to-counterpart").get<CounterpartCreationRule[]>("creationRules") ?? [];
			const counterpartFilename = findCounterpartFilename(counterpartCreationRules, activeFilename, activeLanguageId);
			if(!counterpartFilename?.length) {
				return;
			}

			vscode.window.showQuickPick([`Create ${counterpartFilename}`], {
				"placeHolder": "No counterpart found."
			}).then((value) => {
				if(!value) {
					return;
				}

				// Create a file
				const newFile = `${activeFileDirectory}/${counterpartFilename}`;
				vscode.workspace.fs.writeFile(vscode.Uri.file(newFile), new Uint8Array()).then(() => {
					vscode.commands.executeCommand("vscode.open", vscode.Uri.file(newFile));
				});
			});
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
