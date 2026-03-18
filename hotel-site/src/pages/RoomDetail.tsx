import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { rooms } from '../data/Rooms'
import LoadingSpinner from '../components/LoadingSpinner'
import BookingModal from '../components/BookingModal'
import { useRoomBooking } from '../hooks/useRoomBooking'

export default function RoomDetail() {
    const { id } = useParams<{ id: string }>()
    const room = rooms.find((r) => r.id === Number(id))
    const [currentImage, setCurrentImage] = useState(0)
    const [isLoading] = useState(false)

    const booking = useRoomBooking(room?.capacity ?? 1)

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

    if (isLoading) return <LoadingSpinner message="Caricamento camere..." />

    return (
        <div className="min-h-screen bg-[#FAF0E6]">
            <div className="max-w-6xl mx-auto px-4 pt-6">
                <Link to="/rooms" className="text-[#6B4828] hover:opacity-70 transition text-sm font-medium">
                    ← Torna alle camere
                </Link>
            </div>
            <div className="max-w-6xl mx-auto px-4 py-8">
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
                                        <img src={img} alt={`Miniatura ${i + 1}`} className="w-20 h-14 object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Info */}
                    <div>
                        {/* ... stesso markup info camera ... */}
                        <button
                            onClick={() => room.available && booking.setShowModal(true)}
                            disabled={!room.available}
                            className={`w-full py-3 rounded-lg font-semibold text-white transition ${room.available ? 'bg-[#6B4828] hover:bg-[#3B2010] cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            {room.available ? 'Prenota ora' : 'Non disponibile'}
                        </button>
                    </div>
                </div>
            </div>
            {booking.showModal && (
                <BookingModal
                    room={room}
                    checkIn={booking.checkIn}
                    checkOut={booking.checkOut}
                    guests={booking.guests}
                    nights={booking.nights}
                    today={booking.today}
                    minCheckOut={booking.minCheckOut}
                    bookingDone={booking.bookingDone}
                    onCheckInChange={booking.handleCheckInChange}
                    onCheckOutChange={booking.setCheckOut}
                    onGuestsChange={booking.setGuests}
                    onSubmit={booking.handleBook}
                    onClose={booking.handleClose}
                />
            )}
        </div>
    )
}
