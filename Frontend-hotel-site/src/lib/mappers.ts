import type { ApiRoom, Room, RoomType } from '../types/Room'
import type { ApiRoomReservation, RoomReservation, ApiDinnerReservation, DinnerReservation } from '../types/Reservation'
import type { ApiMenuResponse, DayMenu, Dish, DishCategory } from '../types/Menu'

const STATIC_BASE = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/api$/, '')

function resolveImageUrl(url: string): string {
    if (url.startsWith('http')) return url
    return `${STATIC_BASE}${url}`
}

// ── Room ──

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

// ── Room → API request (reverse mapper per PUT) ──

export function roomToApiRequest(room: Room) {
    return {
        nome: room.name,
        tipoStanza: room.type.charAt(0).toUpperCase() + room.type.slice(1),
        descrizione: room.description,
        prezzoPerNotte: room.pricePerNight,
        capacitaMassima: room.capacity,
        dimensione: room.size,
        piano: room.floor,
        numeroCamera: room.roomNumber,
        disponibile: room.available,
        immagini: room.images,
        servizi: room.amenities,
    }
}

// ── Room Reservation ──

const statusMap: Record<string, RoomReservation['status']> = {
    CONFERMATA: 'confermata',
    IN_ATTESA: 'in_attesa',
    ANNULLATA: 'annullata',
}

export function mapApiRoomReservation(r: ApiRoomReservation): RoomReservation {
    return {
        id: r.idRoomReservation,
        roomName: r.nomeCamera,
        dinnerCode: r.codiceCena,
        checkIn: r.checkIn,
        checkOut: r.checkOut,
        nights: r.numeroNotti,
        pricePerNight: r.prezzoPerNotte,
        totalPrice: r.prezzoTotale,
        status: statusMap[r.stato.toUpperCase()] ?? 'in_attesa',
        bookedAt: r.dataPrenotazione,
    }
}

// ── Dinner Reservation ──

const dinnerStatusMap: Record<string, DinnerReservation['status']> = {
    BOZZA: 'bozza',
    CONFERMATA: 'confermata',
    ANNULLATA: 'annullata',
}

export function mapApiDinnerReservation(r: ApiDinnerReservation): DinnerReservation {
    return {
        id: r.id,
        dinnerCode: r.codiceCena,
        date: r.data,
        totalCovers: r.numeroCoperti,
        orders: r.ordini.map((o) => ({
            coverNumber: o.numeroCoperto,
            primo: o.primo,
            secondo: o.secondo,
        })),
        status: dinnerStatusMap[r.statoPrenotazione.toUpperCase()] ?? 'bozza',
    }
}

// ── Menu ──

const dayNames: Record<string, string> = {
    LUNEDI: 'Lunedì',
    MARTEDI: 'Martedì',
    MERCOLEDI: 'Mercoledì',
    GIOVEDI: 'Giovedì',
    VENERDI: 'Venerdì',
    SABATO: 'Sabato',
    DOMENICA: 'Domenica',
}

const dayOrder = ['LUNEDI', 'MARTEDI', 'MERCOLEDI', 'GIOVEDI', 'VENERDI', 'SABATO', 'DOMENICA']

function mapDish(d: ApiMenuResponse['primi'][number]): Dish {
    return {
        name: d.nome,
        description: d.descrizione,
        category: d.categoria.toLowerCase() as DishCategory,
    }
}

export function mapApiMenus(menus: ApiMenuResponse[]): DayMenu[] {
    return menus
        .sort((a, b) => dayOrder.indexOf(a.giornoSettimana) - dayOrder.indexOf(b.giornoSettimana))
        .map((m) => ({
            id: m.idMenu,
            day: dayNames[m.giornoSettimana] ?? m.giornoSettimana,
            dinner: {
                primi: m.primi.map(mapDish),
                secondi: m.secondi.map(mapDish),
            },
        }))
}
