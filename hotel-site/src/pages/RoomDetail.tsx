import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { rooms } from '../data/Rooms'
import { typeLabels } from '../data/roomUtils'
import LoadingSpinner from '../components/LoadingSpinner'
import {useMemo} from 'react'
// ── Helpers ────────────────────────────────────────────────
function toISODate(d: Date) {
    return d.toISOString().split('T')[0]
}
function nightsBetween(from: string, to: string): number {
    if (!from || !to) return 0
    return Math.max(0, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000))
}

// ───────────────────────────────────────────────────────────
export default function RoomDetail() {
    const { id } = useParams<{ id: string }>()
    const room = rooms.find((r) => r.id === Number(id))
    const [currentImage, setCurrentImage] = useState(0)

    // stato modale
    const [showModal, setShowModal] = useState(false)
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [guests, setGuests] = useState(1)
    const [bookingDone, setBookingDone] = useState(false)
    const [isLoading] = useState(false)

    const today = toISODate(new Date())
    const minCheckOut = useMemo(() => {
        return checkIn
            ? toISODate(new Date(new Date(checkIn).getTime() + 86_400_000))
            : toISODate(new Date(new Date().getTime() + 86_400_000))
    }, [checkIn])

    if (!room) {
        return (
            <div className="min-h-screen bg-[#FAF0E6] flex flex-col items-center justify-center px-4 text-center">
                <h1 className="text-5xl font-bold text-[#6B4828] mb-4">Camera non trovata</h1>
                <p className="text-gray-600 mb-6">La camera richiesta non esiste.</p>
                <Link to="/rooms" className="text-[#6B4828] underline hover:opacity-70 transition">
                    ← Torna alle camere
                </Link>
            </div>
        )
    }


    const nights = nightsBetween(checkIn, checkOut)
    const total = nights * room.pricePerNight

    const handleBook = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: chiamata API per creare la prenotazione
        setBookingDone(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setCheckIn('')
        setCheckOut('')
        setGuests(1)
        setBookingDone(false)
    }
    if (isLoading) return <LoadingSpinner message="Caricamento camere..." />

    return (
        <div className="min-h-screen bg-[#FAF0E6]">
            {/* Link ritorno */}
            <div className="max-w-6xl mx-auto px-4 pt-6">
                <Link to="/rooms" className="text-[#6B4828] hover:opacity-70 transition text-sm font-medium">
                    ← Torna alle camere
                </Link>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Galleria immagini */}
                    <div>
                        <div className="rounded-2xl overflow-hidden shadow-lg mb-3">
                            <img
                                src={room.images[currentImage]}
                                alt={`${room.name} - foto ${currentImage + 1}`}
                                className="w-full h-80 md:h-96 object-cover"
                            />
                        </div>
                        {room.images.length > 1 && (
                            <div className="flex gap-3">
                                {room.images.map((img, i) => (
                                    <button
                                        key={img}
                                        onClick={() => setCurrentImage(i)}
                                        className={`rounded-lg overflow-hidden border-2 transition ${
                                            currentImage === i
                                                ? 'border-[#6B4828]'
                                                : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img} alt={`Miniatura ${i + 1}`} className="w-20 h-14 object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info camera */}
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E8C9A0] text-[#6B4828]">
                                {typeLabels[room.type]}
                            </span>
                            <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                    room.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}
                            >
                                {room.available ? 'Disponibile' : 'Non disponibile'}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-[#6B4828] mb-2">{room.name}</h1>

                        <p className="text-[#6B4828] mb-5">
                            <span className="text-3xl font-bold">€{room.pricePerNight}</span>
                            <span className="text-gray-500"> / notte</span>
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-6">{room.description}</p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                                <svg
                                    className="w-6 h-6 mx-auto text-[#6B4828] mb-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                <p className="text-sm text-gray-500">Ospiti</p>
                                <p className="font-bold text-[#6B4828]">{room.capacity}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                                <svg
                                    className="w-6 h-6 mx-auto text-[#6B4828] mb-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                                    />
                                </svg>
                                <p className="text-sm text-gray-500">Dimensione</p>
                                <p className="font-bold text-[#6B4828]">{room.size} m²</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                                <svg
                                    className="w-6 h-6 mx-auto text-[#6B4828] mb-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                                <p className="text-sm text-gray-500">Piano</p>
                                <p className="font-bold text-[#6B4828]">{room.floor}°</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                                <svg
                                    className="w-6 h-6 mx-auto text-[#6B4828] mb-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                    />
                                </svg>
                                <p className="text-sm text-gray-500">Camera</p>
                                <p className="font-bold text-[#6B4828]">{room.roomNumber}</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-[#6B4828] mb-3">Servizi inclusi</h2>
                            <div className="flex flex-wrap gap-2">
                                {room.amenities.map((amenity) => (
                                    <span
                                        key={amenity}
                                        className="flex items-center gap-1.5 text-sm bg-white text-gray-700 px-3 py-1.5 rounded-full shadow-sm"
                                    >
                                        <svg
                                            className="w-4 h-4 text-green-500 shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* ← UNICA MODIFICA al body esistente: aggiunto onClick */}
                        <button
                            onClick={() => room.available && setShowModal(true)}
                            disabled={!room.available}
                            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                                room.available
                                    ? 'bg-[#6B4828] hover:bg-[#3B2010] cursor-pointer'
                                    : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {room.available ? 'Prenota ora' : 'Non disponibile'}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Modale prenotazione ───────────────────────────── */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal} />

                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
                        {/* Stato: prenotazione confermata */}
                        {bookingDone ? (
                            <div className="text-center py-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 h-8 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-[#3B2010] mb-2">Prenotazione confermata!</h3>
                                <p className="text-gray-600 text-sm mb-1">
                                    <strong>{room.name}</strong>
                                </p>
                                <p className="text-gray-500 text-sm mb-1">
                                    {checkIn} → {checkOut} · {nights} {nights === 1 ? 'notte' : 'notti'} · {guests}{' '}
                                    {guests === 1 ? 'ospite' : 'ospiti'}
                                </p>
                                <p className="text-[#6B4828] font-bold text-lg mb-5">Totale: €{total}</p>
                                <button
                                    onClick={handleCloseModal}
                                    className="w-full bg-[#3B2010] text-white py-2.5 rounded-lg font-medium hover:bg-[#6B4828] transition-colors cursor-pointer"
                                >
                                    Chiudi
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-start mb-5">
                                    <div>
                                        <h2 className="text-xl font-bold text-[#3B2010]">Prenota {room.name}</h2>
                                        <p className="text-sm text-[#9A6840]">€{room.pricePerNight} / notte</p>
                                    </div>
                                    <button
                                        onClick={handleCloseModal}
                                        className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
                                        aria-label="Chiudi"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                <form onSubmit={handleBook} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#3B2010] uppercase tracking-wide mb-1">
                                                Check-in
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                min={today}
                                                value={checkIn}
                                                onChange={(e) => {
                                                    setCheckIn(e.target.value)
                                                    if (checkOut && checkOut <= e.target.value) setCheckOut('')
                                                }}
                                                className="w-full border border-[#C4A070] rounded-lg px-3 py-2 text-sm text-[#3B2010] focus:outline-none focus:ring-2 focus:ring-[#9A6840]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-[#3B2010] uppercase tracking-wide mb-1">
                                                Check-out
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                min={minCheckOut}
                                                value={checkOut}
                                                onChange={(e) => setCheckOut(e.target.value)}
                                                className="w-full border border-[#C4A070] rounded-lg px-3 py-2 text-sm text-[#3B2010] focus:outline-none focus:ring-2 focus:ring-[#9A6840]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#3B2010] uppercase tracking-wide mb-1">
                                            Ospiti
                                        </label>
                                        <select
                                            value={guests}
                                            onChange={(e) => setGuests(Number(e.target.value))}
                                            className="w-full border border-[#C4A070] rounded-lg px-3 py-2 text-sm text-[#3B2010] focus:outline-none focus:ring-2 focus:ring-[#9A6840]"
                                        >
                                            {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
                                                <option key={n} value={n}>
                                                    {n} {n === 1 ? 'ospite' : 'ospiti'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {nights > 0 && (
                                        <div className="bg-[#FAF5EE] rounded-lg px-4 py-3 border border-[#E8C9A0]">
                                            <div className="flex justify-between text-sm text-[#6B4828]">
                                                <span>
                                                    €{room.pricePerNight} × {nights} {nights === 1 ? 'notte' : 'notti'}
                                                </span>
                                                <span className="font-bold text-[#3B2010]">€{total}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-1">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-[#3B2010] text-white font-semibold py-2.5 rounded-lg hover:bg-[#6B4828] transition-colors cursor-pointer"
                                        >
                                            Conferma prenotazione
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="flex-1 border border-[#C4A070] text-[#6B4828] font-medium py-2.5 rounded-lg hover:bg-[#FAF5EE] transition-colors cursor-pointer"
                                        >
                                            Annulla
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
