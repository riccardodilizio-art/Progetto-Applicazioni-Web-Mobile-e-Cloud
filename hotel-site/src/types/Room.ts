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
