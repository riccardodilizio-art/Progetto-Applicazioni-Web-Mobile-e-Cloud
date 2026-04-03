import { useContext } from 'react'
import { BookingContext } from '../context/BookingContextDef'
import type { BookingContextType } from '../context/BookingContextDef'

export function useBooking(): BookingContextType {
    const ctx = useContext(BookingContext)
    if (!ctx) throw new Error('useBooking must be used inside BookingProvider')
    return ctx
}
