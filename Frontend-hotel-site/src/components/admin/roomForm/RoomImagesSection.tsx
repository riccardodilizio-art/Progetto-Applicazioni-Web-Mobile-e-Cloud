import { useState } from 'react'

const IMG_FALLBACK =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="%23C4A070"%3E%3Cpath d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/%3E%3C/svg%3E'

type Props = {
    images: string[]
    error?: string
    onAdd: (url: string) => void
    onRemove: (url: string) => void
    onMove: (index: number, direction: 'up' | 'down') => void
}

export default function RoomImagesSection({ images, error, onAdd, onRemove, onMove }: Props) {
    const [input, setInput] = useState('')

    function handleAdd() {
        const trimmed = input.trim()
        if (!trimmed || images.includes(trimmed)) return
        onAdd(trimmed)
        setInput('')
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-[#E8C9A0]/50 overflow-hidden">
            <div className="bg-[#FAF5EE] border-b border-[#E8C9A0]/50 px-6 py-4">
                <h2 className="font-heading text-lg text-[#3B2010] font-medium">Immagini</h2>
                <p className="text-xs text-[#9A6840] mt-0.5">
                    Incolla URL di immagini. La prima sarà usata come copertina.
                </p>
            </div>
            <div className="p-6 space-y-4">
                {/* Input URL */}
                <div className="flex gap-2">
                    <input
                        type="url"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                handleAdd()
                            }
                        }}
                        placeholder="https://images.unsplash.com/..."
                        className={`flex-1 border rounded-lg px-3 py-2 text-sm text-[#3B2010] placeholder:text-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#C4A070] transition ${
                            error ? 'border-red-400' : 'border-[#E8C9A0]'
                        }`}
                    />
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="bg-[#FAF5EE] text-[#6B4828] border border-[#C4A070] px-4 py-2 rounded-lg text-sm hover:bg-[#E8C9A0] transition-colors whitespace-nowrap"
                    >
                        Aggiungi
                    </button>
                </div>
                {error && <p className="text-red-500 text-xs">{error}</p>}

                {/* Lista immagini */}
                {images.length > 0 ? (
                    <div className="space-y-3">
                        {images.map((url, index) => (
                            <div
                                key={url}
                                className="flex items-center gap-3 p-3 border border-[#E8C9A0] rounded-xl bg-[#FAF5EE]"
                            >
                                <img
                                    src={url}
                                    alt={`Immagine ${index + 1}`}
                                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-[#E8C9A0]"
                                    onError={(e) => {
                                        const img = e.target as HTMLImageElement
                                        if (!img.dataset.fallback) {
                                            img.dataset.fallback = 'true'
                                            img.src = IMG_FALLBACK
                                        }
                                    }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-[#3B2010] truncate">{url}</p>
                                    {index === 0 && (
                                        <span className="text-xs text-[#6B4828] bg-[#E8C9A0] px-2 py-0.5 rounded-full mt-1 inline-block">
                                            Copertina
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1 flex-shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => onMove(index, 'up')}
                                        disabled={index === 0}
                                        className="text-[#9A6840] hover:text-[#3B2010] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs px-1.5 py-0.5 rounded"
                                        title="Sposta su"
                                    >
                                        ▲
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onMove(index, 'down')}
                                        disabled={index === images.length - 1}
                                        className="text-[#9A6840] hover:text-[#3B2010] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs px-1.5 py-0.5 rounded"
                                        title="Sposta giù"
                                    >
                                        ▼
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onRemove(url)}
                                    className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0 text-lg leading-none px-1"
                                    title="Rimuovi"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-[#E8C9A0] rounded-xl p-8 text-center">
                        <p className="text-[#C4A070] text-sm">Nessuna immagine aggiunta</p>
                        <p className="text-[#C4A070] text-xs mt-1">Incolla un URL sopra e clicca "Aggiungi"</p>
                    </div>
                )}
            </div>
        </div>
    )
}
