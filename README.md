# Beautiful Console

Beautiful Console is a browser-based terminal interface built with React, Vite, TypeScript, and Tailwind CSS.

This project was created as an experimental and learning-based build, focusing on fast iteration, visual polish, and practical functionality.

### **It lets you:**
- type and run commands
- load and execute JavaScript files
- drag and drop a file to execute it
- view logs directly in the interface
- evaluate mathematical expressions
- use inline math in text with `{expression}`

## Features

- Clean terminal-style UI
- Command input and output area
- `help`, `clear`, `run`, and `echo` commands
- Mathematical expression evaluation
- Inline math interpolation in `echo`
- Drag and drop support for `.js` files
- Command history with arrow keys
- Keyboard shortcuts (Ctrl+Shift+L to clear)

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **ES Modules** - Modern JavaScript

## Project Structure

```
beautiful-console/
├── src/
│   ├── main.tsx              # App entry point
│   ├── App.tsx               # Main app component
│   ├── index.css             # Global styles
│   ├── components/
│   │   └── Console.tsx       # Main console component
│   └── utils/
│       ├── console.ts        # Console UI utilities
│       ├── commandHandler.ts # Command execution logic
│       └── dragDrop.ts       # Drag and drop support
├── public/
│   └── scripts/              # Scripts that can be executed with `run`
├── images/                   # Icons and assets
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
└── tailwind.config.js        # Tailwind configuration
```

## Requirements

- Node.js 18+
- npm or yarn

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Example Usage

```txt
help
clear
2+2*3
echo Hello {4*4}!
run test
```

## Commands

- `help` - Show available commands
- `clear` - Clear the console
- `run <file>` - Execute a JavaScript file from `public/scripts/`
- `echo <text>` - Display text (supports `{math}` expressions)
- Math expressions - Evaluate directly (e.g., `2+2`, `(3+1)*5`)

## Keyboard Shortcuts

- `Ctrl+Shift+L` - Clear console
- `Arrow Up/Down` - Navigate command history
run test
echo hello world
```