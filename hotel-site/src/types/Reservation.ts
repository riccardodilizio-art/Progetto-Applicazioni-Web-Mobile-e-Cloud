import type { RoomType } from './Room'

export interface RoomReservation {
    id: string
    userEmail: string
    roomName: string
    roomType: RoomType
    roomNumber: string
    roomCapacity: number       // capacità massima della camera
    dinnerCode: string         // codice 5 cifre consegnato al check-in
    checkIn: string            // 'YYYY-MM-DD'
    checkOut: string
    nights: number
    pricePerNight: number
    totalPrice: number
    status: 'confermata' | 'in_attesa' | 'annullata'
}


export interface DinnerOrder {
    coverNumber: number
    primo: string
    secondo: string
}

export interface DinnerReservation {
    id: string
    dinnerCode: string
    date: string // 'YYYY-MM-DD'
    day: string
    totalCovers: number
    orders: DinnerOrder[]
    status: 'bozza' |'confermata' | 'annullata'
}
