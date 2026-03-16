import { useState } from 'react'
import { PRESET_AMENITIES } from '../../../data/roomUtils'

type Props = {
    amenities: string[]
    onAdd: (amenity: string) => void
    onRemove: (amenity: string) => void
}

export default function RoomAmenitiesSection({ amenities, onAdd, onRemove }: Props) {
    const [input, setInput] = useState('')

    function handleAdd() {
        const trimmed = input.trim()
        if (!trimmed || amenities.includes(trimmed)) return
        onAdd(trimmed)
        setInput('')
    }

    const customAmenities = amenities.filter((a) => !PRESET_AMENITIES.includes(a))

    return (
        <div className="bg-white rounded-xl shadow-sm border border-[#E8C9A0]/50 overflow-hidden">
            <div className="bg-[#FAF5EE] border-b border-[#E8C9A0]/50 px-6 py-4">
                <h2 className="font-heading text-lg text-[#3B2010] font-medium">Servizi Inclusi</h2>
                <p className="text-xs text-[#9A6840] mt-0.5">
                    Seleziona dalla lista o aggiungi servizi personalizzati
                </p>
            </div>
            <div className="p-6 space-y-5">

                {/* Chip preset */}
                <div className="flex flex-wrap gap-2">
                    {PRESET_AMENITIES.map((amenity) => {
                        const selected = amenities.includes(amenity)
                        return (
                            <button
                                key={amenity}
                                type="button"
                                onClick={() => selected ? onRemove(amenity) : onAdd(amenity)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-150 ${
                                    selected
                                        ? 'bg-[#3B2010] text-[#E8C9A0] border-[#3B2010]'
                                        : 'bg-white text-[#6B4828] border-[#C4A070] hover:border-[#9A6840]'
                                }`}
                            >
                                {selected ? '✓ ' : ''}{amenity}
                            </button>
                        )
                    })}
                </div>

                {/* Input custom */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd() } }}
                        placeholder="Aggiungi servizio personalizzato..."
                        className="flex-1 border border-[#E8C9A0] rounded-lg px-3 py-2 text-sm text-[#3B2010] placeholder:text-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#C4A070] transition"
                    />
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="bg-[#FAF5EE] text-[#6B4828] border border-[#C4A070] px-4 py-2 rounded-lg text-sm hover:bg-[#E8C9A0] transition-colors"
                    >
                        Aggiungi
                    </button>
                </div>

                {/* Servizi custom aggiunti */}
                {customAmenities.length > 0 && (
                    <div>
                        <p className="text-xs text-[#9A6840] mb-2">Servizi personalizzati:</p>
                        <div className="flex flex-wrap gap-2">
                            {customAmenities.map((amenity) => (
                                <span
                                    key={amenity}
                                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-[#3B2010] text-[#E8C9A0] border border-[#3B2010]"
                                >
                                    {amenity}
                                    <button
                                        type="button"
                                        onClick={() => onRemove(amenity)}
                                        className="hover:text-white transition-colors leading-none"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {amenities.length === 0 && (
                    <p className="text-xs text-[#C4A070] italic">Nessun servizio selezionato.</p>
                )}

            </div>
        </div>
    )
}
