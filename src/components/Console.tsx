import React, { useState, useRef, useEffect } from 'react'
import { createConsoleUI } from '../utils/console.ts'
import { createCommandHandler } from '../utils/commandHandler.ts'
import { setupDragDrop } from '../utils/dragDrop.ts'

const formatValue = (value: any): string => {
  if (typeof value === "string") return value
  if (value instanceof Error) return value.stack || value.message
  if (typeof value === "object" && value !== null) {
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

const Console: React.FC = () => {
  const joinArgs = (args: any[]): string => args.map(formatValue).join(" ")

  const [output, setOutput] = useState<Array<{text: string, class: string}>>([])
  const [inputValue, setInputValue] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const consoleUI = createConsoleUI({
    echoCommand: (command: string) => setOutput(prev => [...prev, {text: `> ${command}`, class: "text-green-300"}]),
    log: (...args: any[]) => setOutput(prev => [...prev, {text: joinArgs(args), class: "text-green-100"}]),
    info: (...args: any[]) => setOutput(prev => [...prev, {text: `INFO: ${joinArgs(args)}`, class: "text-green-300"}]),
    warn: (...args: any[]) => setOutput(prev => [...prev, {text: `WARN: ${joinArgs(args)}`, class: "text-yellow-300"}]),
    error: (...args: any[]) => setOutput(prev => [...prev, {text: `ERROR: ${joinArgs(args)}`, class: "text-red-400"}]),
    system: (...args: any[]) => setOutput(prev => [...prev, {text: `SYSTEM: ${joinArgs(args)}`, class: "text-green-500/80"}]),
    clear: () => setOutput([]),
  })

  const commandHandler = createCommandHandler({
    consoleUI,
    scriptBasePath: "/scripts"
  })

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.code === 'KeyL') {
        event.preventDefault()
        consoleUI.clear()
        inputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [consoleUI])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const command = inputValue.trim()
    if (!command) return

    setInputValue('')

    if (command) {
      setCommandHistory(prev => [...prev, command])
      setHistoryIndex(commandHistory.length + 1)
    }

    await commandHandler.handleCommand(command)
    inputRef.current?.focus()
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex > 0 ? historyIndex - 1 : 0
        setHistoryIndex(newIndex)
        setInputValue(commandHistory[newIndex] || '')
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : commandHistory.length
        setHistoryIndex(newIndex)
        setInputValue(newIndex < commandHistory.length ? commandHistory[newIndex] : '')
      }
    }
  }

  useEffect(() => {
    setupDragDrop(
      document.body,
      async ({ name, content }: { name: string; content: string }) => {
        consoleUI.system(`File loaded: ${name}`)
        await commandHandler.runScriptText(content, name)
      },
      (message: string) => consoleUI.error(message)
    )
  }, [consoleUI, commandHandler])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <section className="w-full h-full overflow-hidden rounded-2xl border border-green-500/25 bg-black/80 shadow-2xl shadow-green-950/20 flex flex-col">
      <header className="flex items-center justify-between border-b border-green-500/20 px-5 py-3">
        <div>
          <h1 className="text-lg font-semibold tracking-wide text-green-300">Beautiful Console</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500/90"></span>
          <span className="h-3 w-3 rounded-full bg-yellow-400/90"></span>
          <span className="h-3 w-3 rounded-full bg-green-500/90"></span>
        </div>
      </header>

      <div ref={outputRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
        {output.map((line, index) => (
          <div key={index} className={`whitespace-pre-wrap break-words ${line.class}`}>
            {line.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-green-500/20 p-4">
        <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-zinc-950 px-4 py-3">
          <span className="text-green-300 select-none">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
            placeholder="Type a command..."
            className="w-full bg-transparent text-green-100 placeholder:text-green-700 outline-none"
          />
        </div>
      </form>
    </section>
  )
}

export default Console