import type { RoomType } from '../types/Room'

export const typeLabels: Record<RoomType, string> = {
    singola: 'Singola',
    doppia: 'Doppia',
    deluxe: 'Deluxe',
    suite: 'Suite',
}

export const typeBadgeColors: Record<RoomType, string> = {
    singola: 'bg-[#6B4828] text-white',
    doppia: 'bg-[#9A6840] text-white',
    deluxe: 'bg-[#C4A070] text-[#6B4828]',
    suite: 'bg-[#E8C9A0] text-[#6B4828]',
}

// ── Costanti per RoomForm ──

export const ROOM_TYPES: { value: RoomType; label: string }[] = [
    { value: 'singola', label: 'Singola' },
    { value: 'doppia', label: 'Doppia' },
    { value: 'deluxe', label: 'Deluxe' },
    { value: 'suite', label: 'Suite' },
]

export const PRESET_AMENITIES: string[] = [
    'Wi-Fi gratuito',
    'Aria condizionata',
    'TV',
    'TV 43"',
    'TV 50"',
    'TV 55" OLED',
    'TV 65" OLED',
    'Minibar',
    'Minibar premium',
    'Bagno privato',
    'Bagno con doccia',
    'Bagno con vasca e doccia',
    'Balcone privato',
    'Cassaforte',
    'Scrivania',
    'Accappatoi e pantofole',
    'Servizio in camera 24h',
    'Macchina per caffè Nespresso',
    'Accesso piscina privata',
]

export const EMPTY_ROOM_FORM: import('../types/Room').RoomFormData = {
    name: '',
    type: 'singola',
    description: '',
    pricePerNight: '',
    capacity: '',
    size: '',
    floor: '',
    roomNumber: '',
    amenities: [],
    images: [],
    available: true,
}
