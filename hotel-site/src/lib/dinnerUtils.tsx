import { weeklyMenu } from '../data/Menu'
import type { DayMenu } from '../types/Menu'
import type { DinnerReservation, RoomReservation } from '../types/Reservation'

// Converte una data nel menu del giorno corrispondente
// JS: 0=Dom,1=Lun...6=Sab → noi vogliamo 0=Lun...6=Dom
export function getMenuForDate(dateStr: string): DayMenu {
    const jsDay = new Date(dateStr).getDay()
    const menuIndex = (jsDay + 6) % 7
    return weeklyMenu[menuIndex]
}

// Verifica se l'ora corrente è prima delle 18:00
export function isBeforeCutoff(): boolean {
    return new Date().getHours() < 23
}

// Verifica se la data odierna è compresa nel soggiorno (check-in incluso, check-out escluso)
export function isTodayInStay(checkIn: string, checkOut: string): boolean {
    const today = new Date().toISOString().split('T')[0]
    return today >= checkIn && today < checkOut
}

// Cerca la prenotazione camera associata al codice (esclude le annullate)
export function findReservationByCode(
    code: string,
    reservations: RoomReservation[]
): RoomReservation | undefined {
    return reservations.find(r => r.dinnerCode === code && r.status !== 'annullata')
}

// Cerca la prenotazione cena per una data specifica (esclude le annullate)
export function findDinnerByDate(
    date: string,
    dinnerCode: string,
    dinners: DinnerReservation[]
): DinnerReservation | undefined {
    return dinners.find(
        d => d.date === date && d.dinnerCode === dinnerCode && d.status !== 'annullata'
    )
}
