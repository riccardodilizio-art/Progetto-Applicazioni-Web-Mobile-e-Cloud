import type { DayMenu } from '../types/Menu'
import type { ApiMenuResponse } from '../types/Menu'
import { mapApiMenus } from './mappers'
import { apiFetch } from './apiClient'

// ── Menu ─────────────────────────────────────────────────────────

const dayNames = ['DOMENICA', 'LUNEDI', 'MARTEDI', 'MERCOLEDI', 'GIOVEDI', 'VENERDI', 'SABATO']

export async function getMenuForDate(dateStr: string): Promise<DayMenu | null> {
    const [year, month, day] = dateStr.split('-').map(Number)
    const jsDay = new Date(year, month - 1, day).getDay()
    const apiDay = dayNames[jsDay]

    try {
        const data = await apiFetch<ApiMenuResponse>(`/menus/${apiDay}`)
        const mapped = mapApiMenus([data])
        return mapped[0] ?? null
    } catch {
        return null
    }
}

// ── Date / Soggiorno ─────────────────────────────────────────────

export function isBeforeCutoff(): boolean {
    return new Date().getHours() < 23
}

export function isTodayInStay(checkIn: string, checkOut: string): boolean {
    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    return today >= checkIn && today < checkOut
}

// ── Rate Limiting (localStorage) ─────────────────────────────────

const RL_KEY = 'hotel_dinner_rl'
const MAX_ATTEMPTS = 5
const BLOCK_MS = 15 * 60 * 1000

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

export function getRLStatus(): RLStatus {
    const entry = loadRL()
    const now = Date.now()

    if (entry.blockedUntil && now < entry.blockedUntil) {
        return { blocked: true, remainingAttempts: 0, unblockAt: new Date(entry.blockedUntil) }
    }

    if (entry.blockedUntil && now >= entry.blockedUntil) {
        saveRL({ attempts: 0, blockedUntil: null })
        return { blocked: false, remainingAttempts: MAX_ATTEMPTS, unblockAt: null }
    }

    return { blocked: false, remainingAttempts: MAX_ATTEMPTS - entry.attempts, unblockAt: null }
}

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

export function recordSuccess() {
    localStorage.removeItem(RL_KEY)
}
