import type { DayMenu } from '../types/Menu'
import type { DinnerReservation, RoomReservation } from '../types/Reservation'
import { weeklyMenu } from '../data/Menu'

// ── Menu ─────────────────────────────────────────────────────────
export function getMenuForDate(dateStr: string): DayMenu {
    // Parsiamo manualmente per evitare conversioni UTC → locale off-by-one
    const [year, month, day] = dateStr.split('-').map(Number)
    const jsDay = new Date(year, month - 1, day).getDay() // costruttore locale, no UTC
    const menuIndex = (jsDay + 6) % 7 // 0=Lun … 6=Dom
    return weeklyMenu[menuIndex]
}

// ── Date / Soggiorno ─────────────────────────────────────────────
export function isBeforeCutoff(): boolean {
    return new Date().getHours() < 18
}

export function isTodayInStay(checkIn: string, checkOut: string): boolean {
    const today = new Date().toISOString().split('T')[0]
    return today >= checkIn && today < checkOut
}

// ── Lookup prenotazioni ──────────────────────────────────────────
export function findReservationByCode(
    code: string,
    roomNumber: string,
    reservations: RoomReservation[],
): RoomReservation | undefined {
    return reservations.find((r) => r.dinnerCode === code && r.roomNumber === roomNumber && r.status !== 'annullata')
}

export function findDinnerByDate(
    date: string,
    dinnerCode: string,
    dinners: DinnerReservation[],
): DinnerReservation | undefined {
    return dinners.find((d) => d.date === date && d.dinnerCode === dinnerCode && d.status !== 'annullata')
}

// ── Rate Limiting (localStorage) ─────────────────────────────────
// NOTA: questa è una protezione lato client. In produzione va
// replicata lato server per essere efficace contro utenti maliziosi.

const RL_KEY = 'hotel_dinner_rl'
const MAX_ATTEMPTS = 5
const BLOCK_MS = 15 * 60 * 1000 // 15 minuti

interface RLEntry {
    attempts: number
    blockedUntil: number | null
}

function loadRL(): RLEntry {
    try {
        const raw = localStorage.getItem(RL_KEY)
        return raw ? JSON.parse(raw) : { attempts: 0, blockedUntil: null }
    } catch {
        return { attempts: 0, blockedUntil: null }
    }
}

function saveRL(entry: RLEntry) {
    localStorage.setItem(RL_KEY, JSON.stringify(entry))
}

export interface RLStatus {
    blocked: boolean
    remainingAttempts: number
    unblockAt: Date | null
}

/** Controlla lo stato attuale senza modificarlo. */
export function getRLStatus(): RLStatus {
    const entry = loadRL()
    const now = Date.now()

    if (entry.blockedUntil && now < entry.blockedUntil) {
        return { blocked: true, remainingAttempts: 0, unblockAt: new Date(entry.blockedUntil) }
    }

    // Il blocco è scaduto: reset automatico
    if (entry.blockedUntil && now >= entry.blockedUntil) {
        saveRL({ attempts: 0, blockedUntil: null })
        return { blocked: false, remainingAttempts: MAX_ATTEMPTS, unblockAt: null }
    }

    return {
        blocked: false,
        remainingAttempts: MAX_ATTEMPTS - entry.attempts,
        unblockAt: null,
    }
}

/** Registra un tentativo fallito e restituisce il nuovo stato. */
export function recordFailedAttempt(): RLStatus {
    const entry = loadRL()
    const now = Date.now()
    const newAttempts = entry.attempts + 1

    if (newAttempts >= MAX_ATTEMPTS) {
        const blockedUntil = now + BLOCK_MS
        saveRL({ attempts: newAttempts, blockedUntil })
        return { blocked: true, remainingAttempts: 0, unblockAt: new Date(blockedUntil) }
    }

    saveRL({ attempts: newAttempts, blockedUntil: null })
    return { blocked: false, remainingAttempts: MAX_ATTEMPTS - newAttempts, unblockAt: null }
}

/** Resetta il contatore dopo un accesso riuscito. */
export function recordSuccess() {
    localStorage.removeItem(RL_KEY)
}
