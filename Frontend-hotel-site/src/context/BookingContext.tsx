import { useState, useMemo } from 'react'
import type { Room } from '../types/Room'
import { nightsBetween, toISODate } from '../hooks/useRoomBooking'
import { BookingContext } from './BookingContextDef'
import type { CartItem } from './BookingContextDef'

export function BookingProvider({ children }: { children: React.ReactNode }) {
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [guests, setGuests] = useState(1)
    const [cart, setCart] = useState<CartItem[]>([])
    const [pendingRoom, setPendingRoom] = useState<Room | null>(null)

    const today = toISODate(new Date())

    const minCheckOut = useMemo(() => {
        const base = checkIn ? new Date(checkIn) : new Date()
        const next = new Date(base)
        next.setDate(next.getDate() + 1)
        return toISODate(next)
    }, [checkIn])

    function handleCheckInChange(value: string) {
        setCheckIn(value)
        if (checkOut && checkOut <= value) setCheckOut('')
    }

    function resetSearch() {
        setCheckIn('')
        setCheckOut('')
        setGuests(1)
    }

    function addToCart(room: Room) {
        const nights = nightsBetween(checkIn, checkOut)
        setCart((prev) => {
            const filtered = prev.filter((i) => i.room.id !== room.id)
            return [
                ...filtered,
                {
                    room,
                    checkIn,
                    checkOut,
                    guests,
                    nights,
                    totalPrice: nights * room.pricePerNight,
                },
            ]
        })
    }

    function removeFromCart(roomId: string) {
        setCart((prev) => prev.filter((i) => i.room.id !== roomId))
    }

    function isInCart(roomId: string) {
        return cart.some((i) => i.room.id === roomId)
    }

    function clearCart() {
        setCart([])
    }


    function clearPendingRoom() {
        setPendingRoom(null)
    }

    return (
        <BookingContext.Provider
            value={{
                checkIn,
                checkOut,
                guests,
                today,
                minCheckOut,
                clearCart,
                handleCheckInChange,
                setCheckOut,
                setGuests,
                resetSearch,
                cart,
                addToCart,
                removeFromCart,
                isInCart,
                pendingRoom,
                setPendingRoom,
                clearPendingRoom,
            }}
        >
            {children}
        </BookingContext.Provider>
    )
}
