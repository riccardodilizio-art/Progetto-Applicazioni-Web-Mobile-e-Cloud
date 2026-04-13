import type { ApiRoom, Room, RoomType } from '../types/Room'

const STATIC_BASE = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/api$/, '')

function resolveImageUrl(url: string): string {
    if (url.startsWith('http')) return url
    return `${STATIC_BASE}${url}`
}

export function mapApiRoom(r: ApiRoom): Room {
    return {
        id: r.idRoom,
        name: r.nome,
        type: r.tipoStanza.toLowerCase() as RoomType,
        description: r.descrizione,
        pricePerNight: r.prezzoPerNotte,
        capacity: r.capacitaMassima,
        size: r.dimensione,
        floor: r.piano,
        roomNumber: r.numeroCamera,
        amenities: r.servizi,
        images: r.immagini.map(resolveImageUrl),
        available: r.disponibile,
    }
}
