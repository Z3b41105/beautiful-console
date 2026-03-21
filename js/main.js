import { createConsoleUI } from "./console.js";
import { createCommandHandler } from "./commandHandler.js";
import { setupDragDrop } from "./dragDrop.js";

document.addEventListener("DOMContentLoaded", () => {
  const outputEl = document.getElementById("console-output");
  const formEl = document.getElementById("console-form");
  const inputEl = document.getElementById("console-input");

  if (!outputEl || !formEl || !inputEl) return;

  const consoleUI = createConsoleUI({ outputEl, inputEl });
  const commandHandler = createCommandHandler({
    consoleUI,
    scriptBasePath: "/public/scripts",
  });

  const commandHistory = [];
  let historyIndex = -1;

  formEl.addEventListener("submit", async (event) => {
    event.preventDefault();

    const command = inputEl.value;
    inputEl.value = "";

    if (command.trim() !== "") {
      commandHistory.push(command);
      historyIndex = commandHistory.length;
    }

    await commandHandler.handleCommand(command);
    inputEl.focus();
  });

  inputEl.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (commandHistory.length === 0) return;

      if (historyIndex > 0) {
        historyIndex--;
      } else {
        historyIndex = 0;
      }

      inputEl.value = commandHistory[historyIndex] ?? "";
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (commandHistory.length === 0) return;

      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        inputEl.value = commandHistory[historyIndex] ?? "";
      } else {
        historyIndex = commandHistory.length;
        inputEl.value = "";
      }
    }
  });

  setupDragDrop(
    document.body,
    async ({ name, content }) => {
      consoleUI.system(`File loaded: ${name}`);
      await commandHandler.runScriptText(content, name);
    },
    (message) => consoleUI.error(message)
  );

  inputEl.focus();

  document.addEventListener("keydown", (event) => {
    const isAlt = event.altKey;
    const isCtrl = event.ctrlKey;
    const isShift = event.shiftKey;

    if (event.code === "KeyL" && isShift && (isCtrl || isAlt)) {
      event.preventDefault();
      consoleUI.clear();
      inputEl.focus();
    }
  });
});