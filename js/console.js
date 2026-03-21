export function createConsoleUI({ outputEl, inputEl }) {
  const formatValue = (value) => {
    if (typeof value === "string") return value;
    if (value instanceof Error) return value.stack || value.message;
    if (typeof value === "object" && value !== null) {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return String(value);
      }
    }
    return String(value);
  };

  const joinArgs = (args) => args.map(formatValue).join(" ");

  const scrollToBottom = () => {
    outputEl.scrollTop = outputEl.scrollHeight;
  };

  const appendLine = (text, classes = "text-green-100") => {
    const line = document.createElement("div");
    line.className = `whitespace-pre-wrap break-words ${classes}`;
    line.textContent = text;
    outputEl.appendChild(line);
    scrollToBottom();
    return line;
  };

  const echoCommand = (command) => {
    appendLine(`> ${command}`, "text-green-300");
  };

  return {
    echoCommand,
    log: (...args) => appendLine(joinArgs(args), "text-green-100"),
    info: (...args) => appendLine(joinArgs(args), "text-green-300"),
    warn: (...args) => appendLine(joinArgs(args), "text-yellow-300"),
    error: (...args) => appendLine(joinArgs(args), "text-red-400"),
    system: (...args) => appendLine(joinArgs(args), "text-green-500/80"),
    clear: () => {
      outputEl.innerHTML = "";
    },
    focus: () => inputEl.focus(),
    scrollToBottom,
  };
}