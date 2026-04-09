import { useState } from 'react'
import { rooms } from '../data/Rooms'
import RoomCard from '../components/RoomCard'
import type { RoomType } from '../types/Room'
import { useBooking } from '../hooks/useBooking'
import { formatDate } from '../lib/dateUtils'

const filters: { label: string; value: RoomType | 'all' }[] = [
    { label: 'Tutte', value: 'all' },
    { label: 'Singola', value: 'singola' },
    { label: 'Doppia', value: 'doppia' },
    { label: 'Deluxe', value: 'deluxe' },
    { label: 'Suite', value: 'suite' },
]

export default function Rooms() {
    const [activeFilter, setActiveFilter] = useState<RoomType | 'all'>('all')
    const { checkIn, checkOut, guests, today, minCheckOut, handleCheckInChange, setCheckOut, setGuests, resetSearch } =
        useBooking()

    const hasSearch = Boolean(checkIn && checkOut)

    // Filtro per tipo
    let filteredRooms = activeFilter === 'all' ? rooms : rooms.filter((r) => r.type === activeFilter)

    // Filtro per disponibilità + capienza (solo se date selezionate)
    if (hasSearch) {
        filteredRooms = filteredRooms.filter((r) => r.available && r.capacity >= guests)
    } else if (guests > 1) {
        filteredRooms = filteredRooms.filter((r) => r.capacity >= guests)
    }

    return (
        <div className="min-h-screen bg-[#FAF0E6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-[#3B2010] to-[#6B4828] text-white pt-16 pb-14 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">Le Nostre Camere</h1>
                <p className="text-lg text-white/80 max-w-xl mx-auto">
                    Scopri le camere dell'Hotel Excelsior: comfort, eleganza e vista mare per ogni esigenza.
                </p>
            </div>

            {/* Card "Seleziona il tuo soggiorno" — sovrapposta al bordo inferiore dell'hero */}
            <div className="px-4">
                <div className="bg-[#FAF5EE] border border-[#C4A070] rounded-2xl shadow-md p-6 max-w-4xl mx-auto -mt-8 relative z-10">
                <h2 className="font-[var(--font-heading)] text-xl font-semibold text-[#3B2010] mb-5">
                        Seleziona il tuo soggiorno
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Check-in */}
                        <div>
                            <label
                                htmlFor="rooms-checkin"
                                className="block text-xs font-semibold text-[#3B2010] uppercase tracking-wide mb-1"
                            >
                                Check-in
                            </label>
                            <input
                                id="rooms-checkin"
                                type="date"
                                min={today}
                                value={checkIn}
                                onChange={(e) => handleCheckInChange(e.target.value)}
                                className="w-full border border-[#C4A070] rounded-lg px-3 py-2 text-sm text-[#3B2010] focus:outline-none focus:ring-2 focus:ring-[#9A6840] bg-white"
                            />
                        </div>

                        {/* Check-out */}
                        <div>
                            <label
                                htmlFor="rooms-checkout"
                                className="block text-xs font-semibold text-[#3B2010] uppercase tracking-wide mb-1"
                            >
                                Check-out
                            </label>
                            <input
                                id="rooms-checkout"
                                type="date"
                                min={minCheckOut}
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                disabled={!checkIn}
                                className="w-full border border-[#C4A070] rounded-lg px-3 py-2 text-sm text-[#3B2010] focus:outline-none focus:ring-2 focus:ring-[#9A6840] bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Ospiti */}
                        <div>
                            <label
                                htmlFor="rooms-guests"
                                className="block text-xs font-semibold text-[#3B2010] uppercase tracking-wide mb-1"
                            >
                                Ospiti
                            </label>
                            <select
                                id="rooms-guests"
                                value={guests}
                                onChange={(e) => setGuests(Number(e.target.value))}
                                className="w-full border border-[#C4A070] rounded-lg px-3 py-2 text-sm text-[#3B2010] focus:outline-none focus:ring-2 focus:ring-[#9A6840] bg-white cursor-pointer"
                            >
                                {[1, 2, 3, 4].map((n) => (
                                    <option key={n} value={n}>
                                        {n} {n === 1 ? 'ospite' : 'ospiti'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Reset / info */}
                    {(checkIn || checkOut || guests > 1) && (
                        <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                            {hasSearch && (
                                <p className="text-sm text-[#6B4828]">
                                    <span className="font-semibold">Disponibilità per:</span>{' '}
                                    {formatDate(checkIn)} → {formatDate(checkOut)} · {guests}{' '}
                                    {guests === 1 ? 'ospite' : 'ospiti'}
                                </p>
                            )}
                            <button
                                onClick={resetSearch}
                                className="text-sm text-[#9A6840] hover:text-[#6B4828] underline cursor-pointer ml-auto"
                            >
                                Cancella filtri
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Filtri tipologia */}
            <div className="flex flex-wrap justify-center gap-3 py-8 px-4">
                {filters.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setActiveFilter(f.value)}
                        aria-pressed={activeFilter === f.value}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                            activeFilter === f.value
                                ? 'bg-[#6B4828] text-white shadow-md'
                                : 'bg-white text-[#6B4828] border border-[#6B4828]/30 hover:bg-[#6B4828]/10'
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Griglia camere */}
            <div className="max-w-6xl mx-auto px-4 pb-16">
                {filteredRooms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRooms.map((room) => (
                            <RoomCard key={room.id} room={room} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-12 text-lg">
                        {hasSearch
                            ? 'Nessuna camera disponibile per le date e gli ospiti selezionati.'
                            : 'Nessuna camera trovata per questa categoria.'}
                    </p>
                )}
            </div>
        </div>
    )
}