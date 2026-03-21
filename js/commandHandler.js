function tokenize(input) {
  const tokens = [];
  let current = "";
  let quote = null;
  let escape = false;

  for (const char of input.trim()) {
    if (escape) {
      current += char;
      escape = false;
      continue;
    }

    if (char === "\\") {
      escape = true;
      continue;
    }

    if (quote) {
      if (char === quote) {
        quote = null;
      } else {
        current += char;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (/\s/.test(char)) {
      if (current.length > 0) {
        tokens.push(current);
        current = "";
      }
      continue;
    }

    current += char;
  }

  if (current.length > 0) tokens.push(current);
  return tokens;
}

export function createCommandHandler({ consoleUI, scriptBasePath = "/public/scripts" }) {
  const createSandboxConsole = () => ({
    log: (...args) => consoleUI.log(...args),
    info: (...args) => consoleUI.info(...args),
    warn: (...args) => consoleUI.warn(...args),
    error: (...args) => consoleUI.error(...args),
    clear: () => consoleUI.clear(),
  });

  const executeScript = async (code, label = "script") => {
    try {
      const runner = new Function("console", `"use strict";\n${code}`);
      const result = runner(createSandboxConsole());

      if (result instanceof Promise) {
        await result;
      }

      consoleUI.system(`${label} executed successfully.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      consoleUI.error(`${label}: ${message}`);
    }
  };

  const resolveScriptUrl = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return "";

    if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("/")) {
      return trimmed;
    }

    const base = scriptBasePath.replace(/\/$/, "");
    const fileName = trimmed.endsWith(".js") ? trimmed : `${trimmed}.js`;
    return `${base}/${fileName}`;
  };

  const isMathExpression = (input) => {
    const trimmed = String(input).trim();
    if (!trimmed) return false;

    // Accepted tokens: digits, dot, whitespace, parentheses, + - * /
    if (!/^[0-9+\-*/().\s]+$/.test(trimmed)) return false;

    // Prevent dangerous sequences like 2**2, 2//2, 2+-2 except unary minus
    const normalized = trimmed.replace(/\s+/g, "");
    if (/\*\*|\/\/|\+\+|--|\+\-|\-\+/.test(normalized)) return false;

    // Simple parentheses balance check
    let depth = 0;
    for (const ch of normalized) {
      if (ch === "(") depth += 1;
      if (ch === ")") {
        depth -= 1;
        if (depth < 0) return false;
      }
    }
    if (depth !== 0) return false;

    return true;
  };

  const evaluateMathExpression = (input) => {
    if (!isMathExpression(input)) {
      throw new Error("Invalid math expression");
    }

    // eslint-disable-next-line no-new-func
    const result = new Function(`return (${input});`)();
    if (typeof result !== "number" || !Number.isFinite(result)) {
      throw new Error("Expression did not return a finite number");
    }

    return result;
  };

  const interpolateMathInTemplate = (text) => {
    if (typeof text !== "string" || !text.includes("{")) return text;

    return text.replace(/\{([^}]+)\}/g, (match, inner) => {
      const expr = String(inner).trim();
      if (!expr) return match;

      if (!isMathExpression(expr)) {
        return match;
      }

      try {
        const value = evaluateMathExpression(expr);
        return String(value);
      } catch {
        return match;
      }
    });
  };

  const runFromUrl = async (scriptName) => {
    const url = resolveScriptUrl(scriptName);

    if (!url) {
      consoleUI.error('Usage: run <file>');
      return;
    }

    consoleUI.system(`Loading ${url}...`);

    try {
      const response = await fetch(url, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`Failed to load (${response.status})`);
      }

      const code = await response.text();
      await executeScript(code, scriptName);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      consoleUI.error(message);
    }
  };

  const handleCommand = async (rawCommand) => {
    const commandText = String(rawCommand ?? "").trim();

    if (!commandText) return;

    consoleUI.echoCommand(commandText);

    // Evaluate plain math expressions directly (without echo prefix)
    if (isMathExpression(commandText)) {
      try {
        const result = evaluateMathExpression(commandText);
        consoleUI.log(result);
      } catch (err) {
        consoleUI.error(`Math error: ${err.message}`);
      }
      return;
    }

    const parts = tokenize(commandText);
    const command = (parts[0] || "").toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case "help":
        consoleUI.system("Available commands:");
        consoleUI.log("help");
        consoleUI.log("clear");
        consoleUI.log("run <file>");
        consoleUI.log("echo <text>");
        break;

      case "clear":
        consoleUI.clear();
        break;

      case "run":
        await runFromUrl(args.join(" "));
        break;

      case "echo": {
        const payload = args.join(" ");

        // If the entire payload is a plain math expression, evaluate to numeric result.
        if (isMathExpression(payload)) {
          try {
            const value = evaluateMathExpression(payload);
            consoleUI.log(value);
          } catch (err) {
            consoleUI.error(`Math error: ${err.message}`);
          }
          break;
        }

        // Otherwise, interpolate any {expr} math blocks within text.
        const processed = interpolateMathInTemplate(payload);
        consoleUI.log(processed);
        break;
      }

      default:
        consoleUI.warn(`Unknown command: ${command}`);
        consoleUI.system('Type "help" to see commands.');
        break;
    }
  };

  return {
    handleCommand,
    runScriptText: executeScript,
    runFromUrl,
  };
}