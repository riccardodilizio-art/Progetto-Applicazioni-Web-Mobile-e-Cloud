import { createContext } from 'react'
import type { Room } from '../types/Room'

export interface CartItem {
    room: Room
    checkIn: string
    checkOut: string
    guests: number
    nights: number
    totalPrice: number
}

export interface BookingContextType {
    checkIn: string
    checkOut: string
    guests: number
    today: string
    minCheckOut: string
    handleCheckInChange: (v: string) => void
    setCheckOut: (v: string) => void
    setGuests: (v: number) => void
    resetSearch: () => void
    cart: CartItem[]
    addToCart: (room: Room) => void
    removeFromCart: (roomId: string) => void
    isInCart: (roomId: string) => boolean
    pendingRoom: Room | null
    setPendingRoom: (room: Room | null) => void
    clearPendingRoom: () => void
}

export const BookingContext = createContext<BookingContextType | null>(null)
