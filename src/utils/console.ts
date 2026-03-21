export interface ConsoleUI {
  echoCommand: (command: string) => void;
  log: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  system: (...args: any[]) => void;
  clear: () => void;
}

export function createConsoleUI(callbacks: ConsoleUI): ConsoleUI {
  return callbacks;
}
