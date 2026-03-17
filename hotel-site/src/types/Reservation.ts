import type { RoomType } from './Room'

export interface RoomReservation {
    id: string
    userEmail: string
    roomName: string
    roomType: RoomType
    checkIn: string // 'YYYY-MM-DD'
    checkOut: string
    nights: number
    pricePerNight: number
    totalPrice: number
    status: 'confermata' | 'in_attesa' | 'annullata'
}

export interface DinnerReservation {
    id: string
    userEmail: string
    date: string // 'YYYY-MM-DD'
    day: string
    primo: string
    secondo: string
    status: 'confermata' | 'annullata'
}
