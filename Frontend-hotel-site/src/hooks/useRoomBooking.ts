import { useState, useMemo } from 'react'

function toISODate(d: Date) {
    return d.toISOString().split('T')[0]
}
export function nightsBetween(from: string, to: string): number {
    if (!from || !to) return 0
    return Math.max(0, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000))
}

export function useRoomBooking(capacity: number) {
    const [showModal, setShowModal] = useState(false)
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [guests, setGuests] = useState(1)
    const [bookingDone, setBookingDone] = useState(false)

    // useMemo con [] → calcolato una volta sola al mount, stabile per tutta la sessione
    const today = useMemo(() => toISODate(new Date()), [])

    const minCheckOut = useMemo(() => {
        return checkIn
            ? toISODate(new Date(new Date(checkIn).getTime() + 86_400_000))
            : toISODate(new Date(new Date().getTime() + 86_400_000))
    }, [checkIn])

    const nights = nightsBetween(checkIn, checkOut)

    function handleBook(e: React.FormEvent) {
        e.preventDefault()
        // TODO: chiamata API
        setBookingDone(true)
    }

    function handleClose() {
        setShowModal(false)
        setCheckIn('')
        setCheckOut('')
        setGuests(1)
        setBookingDone(false)
    }

    function handleCheckInChange(value: string) {
        setCheckIn(value)
        if (checkOut && checkOut <= value) setCheckOut('')
    }

    return {
        showModal,
        setShowModal,
        checkIn,
        checkOut,
        guests,
        setGuests,
        bookingDone,
        today,
        minCheckOut,
        nights,
        handleBook,
        handleClose,
        handleCheckInChange,
        setCheckOut,
        capacity,
    }
}
