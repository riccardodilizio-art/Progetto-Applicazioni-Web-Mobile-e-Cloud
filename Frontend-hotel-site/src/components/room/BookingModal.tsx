import type { Room } from '../../types/Room'
import type { useRoomBooking } from '../../hooks/useRoomBooking'
import { useEffect, useRef } from 'react'

type BookingState = ReturnType<typeof useRoomBooking>

interface Props {
    room: Room
    booking: BookingState
}

export default function BookingModal({ room, booking }: Props) {
    const {
        checkIn,
        checkOut,
        guests,
        nights,
        today,
        minCheckOut,
        bookingDone,
        handleCheckInChange,
        setCheckOut,
        setGuests,
        handleBook,
        handleClose,
    } = booking

    const total = nights * room.pricePerNight
    const dialogRef = useRef<HTMLDivElement>(null)

    // Escape per chiudere
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose()
        }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [handleClose])

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = ''
        }
    }, [])

    // Focus trap
    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return

        dialog.focus()

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return

            const focusable = dialog.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            )
            if (focusable.length === 0) return

            const first = focusable[0]
            const last = focusable[focusable.length - 1]

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault()
                    last.focus()
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault()
                    first.focus()
                }
            }
        }

        dialog.addEventListener('keydown', handleTab)
        return () => dialog.removeEventListener('keydown', handleTab)
    }, [bookingDone])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="booking-title"
                tabIndex={-1}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10 outline-none"
            >
                {bookingDone ? (
                    <div className="text-center py-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                aria-hidden="true"
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
                        <h3 id="booking-title" className="text-xl font-bold text-[#3B2010] mb-2">
                            Prenotazione confermata!
                        </h3>
                        <p className="text-gray-600 text-sm mb-1">
                            <strong>{room.name}</strong>
                        </p>
                        <p className="text-gray-500 text-sm mb-1">
                            {checkIn} → {checkOut} · {nights} {nights === 1 ? 'notte' : 'notti'} · {guests}{' '}
                            {guests === 1 ? 'ospite' : 'ospiti'}
                        </p>
                        <p className="text-[#6B4828] font-bold text-lg mb-5">Totale: €{total}</p>
                        <button
                            onClick={handleClose}
                            className="w-full bg-[#3B2010] text-white py-2.5 rounded-lg font-medium hover:bg-[#6B4828] transition-colors cursor-pointer"
                        >
                            Chiudi
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h2 id="booking-title" className="text-xl font-bold text-[#3B2010]">
                                    Prenota {room.name}
                                </h2>
                                <p className="text-sm text-[#9A6840]">€{room.pricePerNight} / notte</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
                                aria-label="Chiudi"
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
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleBook} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label
                                        htmlFor="booking-checkin"
                                        className="block text-xs font-semibold text-[#3B2010] uppercase tracking-wide mb-1"
                                    >
                                        Check-in
                                    </label>
                                    <input
                                        id="booking-checkin"
                                        type="date"
                                        required
                                        min={today}
                                        value={checkIn}
                                        onChange={(e) => handleCheckInChange(e.target.value)}
                                        className="w-full border border-[#C4A070] rounded-lg px-3 py-2 text-sm text-[#3B2010] focus:outline-none focus:ring-2 focus:ring-[#9A6840]"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="booking-checkout"
                                        className="block text-xs font-semibold text-[#3B2010] uppercase tracking-wide mb-1"
                                    >
                                        Check-out
                                    </label>
                                    <input
                                        id="booking-checkout"
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
                                <label
                                    htmlFor="booking-guests"
                                    className="block text-xs font-semibold text-[#3B2010] uppercase tracking-wide mb-1"
                                >
                                    Ospiti
                                </label>
                                <select
                                    id="booking-guests"
                                    value={guests}
                                    onChange={(e) => setGuests(Number(e.target.value))}
                                    className="w-full border border-[#C4A070] rounded-lg px-3 py-2 text-sm text-[#3B2010] focus:outline-none focus:ring-2 focus:ring-[#9A6840] bg-white cursor-pointer"
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
                                    onClick={handleClose}
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
    )
}
