/**
 * Simple code formatter for Nuru language
 * Provides basic indentation and formatting for better code readability
 */

export function formatCode(code: string): string {
	const lines = code.split("\n");
	const formattedLines: string[] = [];
	let indentLevel = 0;
	const indentSize = 4; // 4 spaces per indent level

	// Keywords that increase indentation
	const increaseIndentKeywords = [
		"ikiwa",
		"kama",
		"wakati",
		"kwa",
		"fanya",
		"unda",
		"if",
		"for",
		"while",
		"func",
		"function",
	];

	// Keywords that decrease indentation
	const decreaseIndentKeywords = ["mwisho", "end", "}"];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();

		// Skip empty lines but preserve them
		if (line === "") {
			formattedLines.push("");
			continue;
		}

		// Check if line starts with a keyword that decreases indent
		const shouldDecreaseIndent = decreaseIndentKeywords.some((keyword) =>
			line.startsWith(keyword),
		);

		if (shouldDecreaseIndent && indentLevel > 0) {
			indentLevel--;
		}

		// Add the indented line
		const indent = " ".repeat(indentLevel * indentSize);
		formattedLines.push(indent + line);

		// Check if line contains a keyword that increases indent
		const shouldIncreaseIndent = increaseIndentKeywords.some((keyword) => {
			// Match keyword as a standalone word
			const regex = new RegExp(`\\b${keyword}\\b`);
			return regex.test(line);
		});

		if (shouldIncreaseIndent) {
			indentLevel++;
		}
	}

	return formattedLines.join("\n");
}
