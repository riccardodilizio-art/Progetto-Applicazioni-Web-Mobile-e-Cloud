import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { rooms } from '../data/Rooms'
import { typeLabels } from '../data/roomUtils'
import { useBooking } from '../hooks/useBooking'
import { nightsBetween } from '../hooks/useRoomBooking'
import { formatDate } from '../lib/dateUtils'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'

export default function RoomDetail() {
    const { id } = useParams<{ id: string }>()
    const room = rooms.find((r) => r.id === Number(id))
    const [currentImage, setCurrentImage] = useState(0)

    const { checkIn, checkOut, guests, isInCart, addToCart, setPendingRoom } = useBooking()
    const isAuthenticated = useIsAuthenticated()
    const navigate = useNavigate()

    if (!room) {
        return (
            <div className="min-h-screen bg-[#FAF0E6] flex flex-col items-center justify-center px-4 text-center">
                <h1 className="text-5xl font-bold text-[#6B4828] mb-4">Camera non trovata</h1>
                <p className="text-gray-600 mb-6">La camera richiesta non esiste.</p>
                <Link to="/camere" className="text-[#6B4828] underline hover:opacity-70 transition">
                    ← Torna alle camere
                </Link>
            </div>
        )
    }

    const hasSearch = Boolean(checkIn && checkOut)
    const nights = nightsBetween(checkIn, checkOut)
    const total = nights * room.pricePerNight
    const alreadyInCart = isInCart(room.id)

    function handleAddToCart() {
        if (!room || !hasSearch || !room.available) return

        if (!isAuthenticated) {
            setPendingRoom(room)
            navigate('/accedi')
            return
        }

        addToCart(room)
        navigate('/carrello')
    }

    return (
        <div className="min-h-screen bg-[#FAF0E6]">
            <div className="max-w-6xl mx-auto px-4 pt-6">
                <Link to="/camere" className="text-[#6B4828] hover:opacity-70 transition text-sm font-medium">
                    ← Torna alle camere
                </Link>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Banner soggiorno selezionato */}
                {hasSearch && (
                    <div className="bg-[#FAF5EE] border border-[#E8C9A0] rounded-xl px-4 py-3 mb-6 flex items-center justify-between flex-wrap gap-2">
                        <p className="text-sm text-[#6B4828]">
                            <span className="font-semibold">Soggiorno selezionato:</span> {formatDate(checkIn)} →{' '}
                            {formatDate(checkOut)} · {guests} {guests === 1 ? 'ospite' : 'ospiti'} · {nights}{' '}
                            {nights === 1 ? 'notte' : 'notti'}
                        </p>
                        <Link to="/camere" className="text-xs text-[#9A6840] hover:text-[#6B4828] hover:underline">
                            Modifica date
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Galleria */}
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
                                        className={`rounded-lg overflow-hidden border-2 transition ${currentImage === i ? 'border-[#6B4828]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img
                                            loading="lazy"
                                            src={img}
                                            alt={`Miniatura ${i + 1}`}
                                            className="w-20 h-14 object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
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
                                    aria-hidden="true"
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
                                    aria-hidden="true"
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
                                    aria-hidden="true"
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
                                    aria-hidden="true"
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
                                            aria-hidden="true"
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

                        {/* Stato 1: camera non disponibile */}
                        {!room.available && (
                            <button
                                disabled
                                className="w-full py-3 rounded-lg font-semibold text-white bg-gray-400 cursor-not-allowed"
                            >
                                Non disponibile
                            </button>
                        )}

                        {/* Stato 2: date non selezionate */}
                        {room.available && !hasSearch && (
                            <>
                                <button
                                    disabled
                                    className="w-full py-3 rounded-lg font-semibold text-white bg-[#6B4828]/50 cursor-not-allowed"
                                >
                                    Prenota ora
                                </button>
                                <p className="text-sm text-[#9A6840] mt-2 text-center">
                                    <Link to="/camere" className="underline hover:text-[#6B4828]">
                                        ← Seleziona le date del soggiorno
                                    </Link>{' '}
                                    per prenotare
                                </p>
                            </>
                        )}

                        {/* Stato 3: già in carrello */}
                        {room.available && hasSearch && alreadyInCart && (
                            <Link
                                to="/carrello"
                                className="w-full py-3 rounded-lg font-semibold text-white bg-green-600 flex items-center justify-center gap-2"
                            >
                                <svg
                                    aria-hidden="true"
                                    className="w-5 h-5"
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
                                Vai al carrello
                            </Link>
                        )}

                        {/* Stato 4: pronto per prenotare (loggato o no) */}
                        {room.available && hasSearch && !alreadyInCart && (
                            <button
                                onClick={handleAddToCart}
                                className="w-full py-3 rounded-lg font-semibold text-white bg-[#6B4828] hover:bg-[#3B2010] cursor-pointer transition"
                            >
                                Prenota ora
                            </button>
                        )}

                        {/* Riepilogo carrello */}
                        {room.available && alreadyInCart && hasSearch && (
                            <div className="bg-[#FAF5EE] border border-[#C4A070] rounded-xl p-4 mt-4">
                                <p className="font-semibold text-[#3B2010] mb-1">Camera aggiunta al carrello</p>
                                <p className="text-sm text-[#6B4828]">
                                    {nights} {nights === 1 ? 'notte' : 'notti'} · €{room.pricePerNight} / notte
                                </p>
                                <p className="text-[#3B2010] font-bold text-lg mt-1">Totale: €{total}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
