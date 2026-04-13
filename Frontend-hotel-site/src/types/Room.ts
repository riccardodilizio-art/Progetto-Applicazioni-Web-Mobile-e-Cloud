export type RoomType = 'singola' | 'doppia' | 'deluxe' | 'suite'

export interface Room {
    id: string
    name: string
    type: RoomType
    description: string
    pricePerNight: number
    capacity: number
    size: number
    floor: number
    roomNumber: number
    amenities: string[]
    images: string[]
    available: boolean
}

// Tipo che arriva dal backend (camelCase dal JSON serializer di .NET)
export interface ApiRoom {
    idRoom: string
    nome: string
    tipoStanza: string
    descrizione: string
    prezzoPerNotte: number
    capacitaMassima: number
    dimensione: number
    piano: number
    numeroCamera: number
    disponibile: boolean
    immagini: string[]
    servizi: string[]
}

// ── Tipi per RoomForm ──

export type RoomFormData = {
    name: string
    type: RoomType
    description: string
    pricePerNight: string
    capacity: string
    size: string
    floor: string
    roomNumber: string
    amenities: string[]
    images: string[]
    available: boolean
}

export type RoomFormErrors = Partial<Record<keyof RoomFormData, string>>
