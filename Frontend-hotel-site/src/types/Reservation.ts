export interface ApiRoomReservation {
    idRoomReservation: string
    idUser: string
    idRoom: string
    nomeCamera: string
    codiceCena: string
    checkIn: string
    checkOut: string
    numeroNotti: number
    prezzoPerNotte: number
    prezzoTotale: number
    stato: string
    dataPrenotazione: string
}

export interface ApiDinnerOrderResponse {
    id: string
    numeroCoperto: number
    primo: string
    secondo: string
}

export interface ApiDinnerReservation {
    id: string
    codiceCena: string
    data: string
    numeroCoperti: number
    statoPrenotazione: string
    ordini: ApiDinnerOrderResponse[]
}

export interface RoomReservation {
    id: string
    roomName: string
    dinnerCode: string
    checkIn: string
    checkOut: string
    nights: number
    pricePerNight: number
    totalPrice: number
    status: 'confermata' | 'in_attesa' | 'annullata'
    bookedAt: string
}

export interface DinnerOrder {
    coverNumber: number
    primo: string
    secondo: string
}

export interface DinnerReservation {
    id: string
    dinnerCode: string
    date: string
    totalCovers: number
    orders: DinnerOrder[]
    status: 'bozza' | 'confermata' | 'annullata'
}
