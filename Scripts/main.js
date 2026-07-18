exports.activate = function() {
	nova.commands.register("importClass", (editor) => {
		if (!editor) {
			nova.workspace.showErrorMessage("No active editor.");
			return;
		}

		let selectedText = editor.selectedText ? editor.selectedText.trim() : "";
		let workspace = nova.workspace.path;

		if (!selectedText) {
			nova.workspace.showErrorMessage("Select a class name first.");
			return;
		}

		let found = scan(workspace, selectedText, editor);

		if (!found) {
			nova.workspace.showErrorMessage("Class not found: " + selectedText);
		}
	});
	
	nova.commands.register("importAllClasses", (editor) => {
		if (!editor) {
			nova.workspace.showErrorMessage("No active editor.");
			return;
		}
	
		let selectedText = editor.selectedText ? editor.selectedText.trim() : "";
		let workspace = nova.workspace.path;
	
		if (!selectedText) {
			nova.workspace.showErrorMessage("Select a class name first.");
			return;
		}
	
		let found = scanAll(workspace, selectedText, editor);
	
		if (!found) {
			nova.workspace.showErrorMessage("Class not found: " + selectedText);
		}
	});
};

function scan(path, selectedText, editor) {
	let listdir = nova.fs.listdir(path);

	for (let i = 0; i < listdir.length; i++) {
		let pathFile = nova.path.join(path, listdir[i]);
		let fileType = nova.fs.stat(pathFile);

		if (fileType && fileType.isFile()) {
			if (listdir[i] === selectedText + ".php") {
				let fileContent = nova.fs.open(pathFile, "r").read();
				let classNamespace = fileContent.match(/namespace\s+([^;]+);/);

				if (!classNamespace) {
					nova.workspace.showErrorMessage("Namespace not found in " + listdir[i]);
					return true;
				}

				let fullClass = classNamespace[1] + "\\" + selectedText;
				let useLine = "use " + fullClass + ";";

				let content = editor.document.getTextInRange(new Range(0, editor.document.length));

				if (content.includes(useLine)) {
					return true;
				}

				let match = content.match(/<?php\s+[^;]+;/);

				if (!match) {
					nova.workspace.showErrorMessage("Namespace not found in current file.");
					return true;
				}

				let insertPosition = match.index + match[0].length + 1;

				editor.edit((edit) => {
					edit.insert(insertPosition, "\n" + useLine, InsertTextFormat.PlainText);
				});

				return true;
			}
		} else if (fileType && fileType.isDirectory()) {
			let found = scan(pathFile, selectedText, editor);
			if (found) return true;
		}
	}
	
	return false;
}

function scanAll(path, selectedText, editor) {
	let listdir = nova.fs.listdir(path);

	for (let i = 0; i < listdir.length; i++) {
		let pathFile = nova.path.join(path, listdir[i]);
		let fileType = nova.fs.stat(pathFile);

		if (fileType && fileType.isFile()) {
			if (listdir[i] === selectedText + ".php") {
				let fileContent = nova.fs.open(pathFile, "r").read();
				let classNamespace = fileContent.match(/namespace\s+([^;]+);/);

				if (!classNamespace) {
					continue;
				}

				let fullClass = classNamespace[1] + "\\" + selectedText;
				let useLine = "use " + fullClass + ";";

				let content = editor.document.getTextInRange(new Range(0, editor.document.length));

				if (content.includes(useLine)) {
					continue;
				}

				let match = content.match(/<?php\s+[^;]+;/);

				if (!match) {
					continue;
				}

				let insertPosition = match.index + match[0].length + 1;

				editor.edit((edit) => {
					edit.insert(insertPosition, "\n" + useLine, InsertTextFormat.PlainText);
				});

			}
		} else if (fileType && fileType.isDirectory()) {
			scanAll(pathFile, selectedText, editor);
		}
	}
	
	return false;
}

exports.deactivate = function() {
	// Clean up state before the extension is deactivated
};
