interface FileData {
  name: string
  content: string
  file: File
}

export function setupDragDrop(
  targetElement: HTMLElement,
  onFileLoaded: (data: FileData) => Promise<void>,
  onError: (message: string) => void = () => {}
) {
  const overlay = document.createElement("div")
  overlay.className =
    "pointer-events-none fixed inset-0 z-50 hidden items-center justify-center bg-black/70 backdrop-blur-sm"
  overlay.innerHTML = `
    <div class="rounded-2xl border border-green-500/30 bg-zinc-950/90 px-6 py-4 text-center text-green-300 shadow-2xl shadow-green-950/30">
      <div class="text-lg font-semibold">Drop file here</div>
      <div class="mt-1 text-sm text-green-500/80">It will be read and executed</div>
    </div>
  `
  document.body.appendChild(overlay)

  let dragCounter = 0

  const showOverlay = () => {
    overlay.classList.remove("hidden")
    overlay.classList.add("flex")
  }

  const hideOverlay = () => {
    overlay.classList.add("hidden")
    overlay.classList.remove("flex")
    dragCounter = 0
  }

  const prevent = (event: Event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const onDragEnter = (event: DragEvent) => {
    prevent(event)
    dragCounter += 1
    showOverlay()
  }

  const onDragOver = (event: DragEvent) => {
    prevent(event)
    showOverlay()
  }

  const onDragLeave = (event: DragEvent) => {
    prevent(event)
    dragCounter -= 1

    if (dragCounter <= 0) {
      hideOverlay()
    }
  }

  const onDrop = async (event: DragEvent) => {
    prevent(event)
    hideOverlay()

    const file = event.dataTransfer?.files?.[0]

    if (!file) {
      onError("No file detected.")
      return
    }

    try {
      const content = await file.text()
      await onFileLoaded({
        name: file.name,
        content,
        file,
      })
    } catch (error) {
      onError(error instanceof Error ? error.message : String(error))
    }
  }

  targetElement.addEventListener("dragenter", onDragEnter)
  targetElement.addEventListener("dragover", onDragOver)
  targetElement.addEventListener("dragleave", onDragLeave)
  targetElement.addEventListener("drop", onDrop)

  return () => {
    targetElement.removeEventListener("dragenter", onDragEnter)
    targetElement.removeEventListener("dragover", onDragOver)
    targetElement.removeEventListener("dragleave", onDragLeave)
    targetElement.removeEventListener("drop", onDrop)
    overlay.remove()
  }
}