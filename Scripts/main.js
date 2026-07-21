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

		let matches = collect(workspace, selectedText);

		if (matches.length === 0) {
			nova.workspace.showErrorMessage("Class not found: " + selectedText);
			return;
		}

		if (matches.length === 1) {
			insertUse(editor, matches[0].namespace, selectedText);
			return;
		}

		let choices = matches.map((m) => m.namespace + "\\" + selectedText);

		nova.workspace.showChoicePalette(
			choices,
			{ placeholder: "Choose which class to import" },
			(value) => {
				if (value === null) {
					nova.workspace.showInformativeMessage("Import cancelled");
					return;
				}

				let chosen = matches.find(
					(m) => (m.namespace + "\\" + selectedText) === value
				);

				if (chosen) {
					insertUse(editor, chosen.namespace, selectedText);
				}
			}
		);
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

		let matches = collect(workspace, selectedText);

		if (matches.length === 0) {
			nova.workspace.showErrorMessage("Class not found: " + selectedText);
			return;
		}

		matches.forEach((m) => {
			insertUse(editor, m.namespace, selectedText);
		});
	});
};

function collect(path, selectedText, results) {
	if (!results) results = [];

	let listdir = nova.fs.listdir(path);

	for (let i = 0; i < listdir.length; i++) {
		let pathFile = nova.path.join(path, listdir[i]);
		let fileType = nova.fs.stat(pathFile);

		if (fileType && fileType.isFile()) {
			if (listdir[i] === selectedText + ".php") {
				let fileContent = nova.fs.open(pathFile, "r").read();
				let classNamespace = fileContent.match(/namespace\s+([^;]+);/);

				if (classNamespace) {
					results.push({
						namespace: classNamespace[1],
						path: pathFile
					});
				}
			}
		} else if (fileType && fileType.isDirectory()) {
			collect(pathFile, selectedText, results);
		}
	}

	return results;
}

function insertUse(editor, namespace, selectedText) {
	let fullClass = namespace + "\\" + selectedText;
	let useLine = "use " + fullClass + ";";

	let content = editor.document.getTextInRange(
		new Range(0, editor.document.length)
	);

	if (content.includes(useLine)) {
		return;
	}

	let match = content.match(/<\?php[ \t]*\r?\n?/);

	if (!match) {
		nova.workspace.showErrorMessage("Namespace not found in current file.");
		return;
	}

	let insertPosition = match.index + match[0].length + 1;

	editor.edit((edit) => {
		edit.insert(insertPosition, "\n" + useLine, InsertTextFormat.PlainText);
	});
}

exports.deactivate = function() {
	// Clean up state before the extension is deactivated
};
