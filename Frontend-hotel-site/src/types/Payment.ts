export type PaymentStatusApi = 'IN_ATTESA' | 'COMPLETATO' | 'FALLITO' | 'RIMBORSATO'
export type PaymentMethodApi = 'CARTA_CREDITO' | 'CARTA_DEBITO' | 'PAYPAL' | 'BONIFICO'

export type PaymentStatus = 'in_attesa' | 'completato' | 'fallito' | 'rimborsato'
export type PaymentMethod = 'carta_credito' | 'carta_debito' | 'paypal' | 'bonifico'

export interface ApiPayment {
    idPayment: string
    idRoomReservation: string
    importo: number
    metodo: PaymentMethodApi | null
    stato: PaymentStatusApi
    cartaUltime4: string | null
    titolareCarta: string | null
    transactionId: string | null
    dataCreazione: string
    dataCompletamento: string | null
    nomeCamera: string
    checkIn: string
    checkOut: string
    numeroNotti: number
}

export interface Payment {
    id: string
    reservationId: string
    amount: number
    method: PaymentMethod | null
    status: PaymentStatus
    cardLast4: string | null
    cardHolder: string | null
    transactionId: string | null
    createdAt: string
    completedAt: string | null
    roomName: string
    checkIn: string
    checkOut: string
    nights: number
}
