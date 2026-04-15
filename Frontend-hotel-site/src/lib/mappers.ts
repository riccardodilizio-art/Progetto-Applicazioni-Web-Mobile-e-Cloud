import type { ApiRoom, Room, RoomType } from '../types/Room'
import type {
    ApiRoomReservation,
    ApiRoomReservationAdmin,
    ApiDinnerReservation,
    ApiDinnerReservationAdmin,
    RoomReservation,
    RoomReservationStatus,
    RoomReservationAdmin,
    DinnerReservation,
    DinnerReservationStatus,
    DinnerReservationAdmin,
} from '../types/Reservation'

import type {
    ApiMenuResponse,
    ApiDishResponse,
    ApiMenuRequest,
    ApiDishRequest,
    ApiDayOfWeek,
    ApiDishCategory,
    DayMenu,
    Dish,
    DishCategory,
    MenuFormData,
    MenuFormDishEntry,
} from '../types/Menu'


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

const statusMap: Record<string, RoomReservationStatus> = {
    CONFERMATO: 'confermata',
    IN_ATTESA: 'in_attesa',
    ANNULLATO: 'annullata',
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

const dinnerStatusMap: Record<string, DinnerReservationStatus> = {
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
// ── Menu admin (form ↔ API) ──

export function apiMenuToForm(m: ApiMenuResponse): MenuFormData {
    const toEntry = (d: ApiDishResponse): MenuFormDishEntry => ({
        id: d.idDish,
        name: d.nome,
        description: d.descrizione,
        category: d.categoria.toLowerCase() as DishCategory,
    })
    return {
        day: m.giornoSettimana as ApiDayOfWeek,
        primi: m.primi.map(toEntry),
        secondi: m.secondi.map(toEntry),
    }
}

export function menuFormToApiRequest(form: MenuFormData): ApiMenuRequest {
    const toApi = (d: MenuFormDishEntry, tipoPiatto: 'PRIMO' | 'SECONDO'): ApiDishRequest => ({
        nome: d.name.trim(),
        descrizione: d.description.trim(),
        categoria: d.category.toUpperCase() as ApiDishCategory,
        tipoPiatto,
    })
    return {
        giorno: form.day,
        piatti: [
            ...form.primi.map((d) => toApi(d, 'PRIMO')),
            ...form.secondi.map((d) => toApi(d, 'SECONDO')),
        ],
    }
}

// ── Admin reservations ──

export function mapApiRoomReservationAdmin(r: ApiRoomReservationAdmin): RoomReservationAdmin {
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
        userEmail: r.userEmail,
        userName: r.userNome,
        userSurname: r.userCognome,
        roomNumber: r.numeroCamera,
    }
}

export function mapApiDinnerReservationAdmin(r: ApiDinnerReservationAdmin): DinnerReservationAdmin {
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
        roomNumber: r.numeroCamera,
        userEmail: r.userEmail,
    }
}

