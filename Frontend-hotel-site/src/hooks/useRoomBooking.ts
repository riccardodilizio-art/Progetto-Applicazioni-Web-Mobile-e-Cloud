import { useState, useMemo } from 'react'

function toISODate(d: Date) {
    return d.toISOString().split('T')[0]
}
export function nightsBetween(from: string, to: string): number {
    if (!from || !to) return 0
    const a = new Date(from)
    const b = new Date(to)
    return Math.max(0, Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 86_400_000))
}

export function useRoomBooking(capacity: number) {
    const [showModal, setShowModal] = useState(false)
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [guests, setGuests] = useState(1)
    const [bookingDone, setBookingDone] = useState(false)

    const today = useMemo(() => toISODate(new Date()), [])

    const minCheckOut = useMemo(() => {
        const base = checkIn ? new Date(checkIn) : new Date()
        const next = new Date(base)
        next.setDate(next.getDate() + 1)
        return toISODate(next)
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
