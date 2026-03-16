export type RoomType = 'singola' | 'doppia' | 'deluxe' | 'suite'

export interface Room {
    id: number
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
