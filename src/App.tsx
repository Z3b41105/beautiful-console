import React from 'react'
import Console from './components/Console'

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-green-400 font-mono p-[clamp(8px,1vw,10px)] box-border">
      <main className="h-[calc(100vh-2*clamp(8px,1vw,10px))] w-full">
        <Console />
      </main>
    </div>
  )
}

export default App