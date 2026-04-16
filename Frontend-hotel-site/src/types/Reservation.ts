// ── API response (client) ──

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
    idPayment: string | null
    statoPagamento: string | null
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

// ── API response (admin) ──

export interface ApiRoomReservationAdmin extends ApiRoomReservation {
    userEmail: string
    userNome: string
    userCognome: string
    numeroCamera: number
}

export interface ApiDinnerReservationAdmin {
    id: string
    codiceCena: string
    numeroCamera: number | null
    userEmail: string | null
    data: string
    numeroCoperti: number
    statoPrenotazione: string
    ordini: ApiDinnerOrderResponse[]
}

// ── Domain types (client) ──

export type RoomReservationStatus = 'confermata' | 'in_attesa' | 'annullata'

export interface RoomReservation {
    id: string
    roomName: string
    dinnerCode: string
    checkIn: string
    checkOut: string
    nights: number
    pricePerNight: number
    totalPrice: number
    status: RoomReservationStatus
    bookedAt: string
    paymentId: string | null
    paymentStatus: 'in_attesa' | 'completato' | 'fallito' | 'rimborsato' | null
}


export type DinnerReservationStatus = 'bozza' | 'confermata' | 'annullata'

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
    status: DinnerReservationStatus
}

// ── Domain types (admin) ──

export interface RoomReservationAdmin extends RoomReservation {
    userEmail: string
    userName: string
    userSurname: string
    roomNumber: number
}

export interface DinnerReservationAdmin extends DinnerReservation {
    roomNumber: number | null
    userEmail: string | null
}
