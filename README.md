# Beautiful Console

Beautiful Console is a browser-based terminal interface made with HTML, JavaScript, and Tailwind CSS.

It lets you:
- type and run commands
- load and execute JavaScript files
- drag and drop a file to execute it
- view logs directly in the interface

## Features

- Clean terminal-style UI
- Command input and output area
- `help`, `clear`, `run`, and `echo` commands
- Drag and drop support for `.js` files
- Command history with arrow keys

## Project Structure

- `index.html` main interface
- `js/main.js` app entry point
- `js/console.js` console rendering logic
- `js/commandHandler.js` command execution logic
- `js/dragDrop.js` drag and drop support
- `public/scripts/` scripts that can be executed with the `run` command

## Requirements

To run this project, you need a local web server.

This project will not work correctly if you just open `index.html` directly in the browser.  
Use Live Server in Visual Studio Code or any other local server tool.

## How to Run

1. Open the project in Visual Studio Code.
2. Make sure Live Server is installed.
3. Right-click `index.html`.
4. Select `Open with Live Server`.

After that, open the console in the browser and start typing commands.

## Example Usage

```txt
help
clear
run test
echo hello world