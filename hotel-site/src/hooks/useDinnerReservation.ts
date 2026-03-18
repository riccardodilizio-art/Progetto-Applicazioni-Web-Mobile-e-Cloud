import { useState } from 'react'
import { mockRoomReservations, mockDinnerReservations } from '../data/Reservations'
import type { DinnerOrder, DinnerReservation, RoomReservation } from '../types/Reservation'
import type { DayMenu } from '../types/Menu'
import {
    findReservationByCode,
    findDinnerByDate,
    getMenuForDate,
    isBeforeCutoff,
    isTodayInStay,
} from '../lib/dinnerUtils'
import { useRateLimit } from './useRateLimit'

export type PageState = 'idle' | 'booking' | 'locked' | 'error' | 'success'

export function useDinnerReservation() {
    const [code, setCode] = useState('')
    const [roomNumber, setRoomNumber] = useState('')
    const [pageState, setPageState] = useState<PageState>('idle')
    const [errorMsg, setErrorMsg] = useState('')
    const { status: rlStatus, onFailure, onSuccess } = useRateLimit()
    const [reservation, setReservation] = useState<RoomReservation | null>(null)
    const [todayMenu, setTodayMenu] = useState<DayMenu | null>(null)
    const [existingDinner, setExistingDinner] = useState<DinnerReservation | null>(null)
    const [covers, setCovers] = useState(1)
    const [orders, setOrders] = useState<DinnerOrder[]>([])
    const [validationError, setValidationError] = useState('')

    const today = new Date().toISOString().split('T')[0]

    // useEffect RIMOSSO: il polling è già gestito dentro useRateLimit

    function handleSubmitCode(e: React.FormEvent) {
        e.preventDefault()

        // usa rlStatus direttamente, è già aggiornato da useRateLimit
        if (rlStatus.blocked) {
            setErrorMsg(
                `Accesso bloccato per troppi tentativi. Riprova alle ${rlStatus.unblockAt?.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}.`,
            )
            setPageState('error')
            return
        }

        const found = findReservationByCode(code.trim(), roomNumber.trim(), mockRoomReservations)
        if (!found) {
            const newRL = onFailure()
            setErrorMsg(
                newRL.blocked
                    ? 'Troppi tentativi falliti. Riprova tra 15 minuti.'
                    : `Codice o numero di camera non validi. Tentativi rimasti: ${newRL.remainingAttempts}.`,
            )
            setPageState('error')
            return
        }

        onSuccess()
        setReservation(found)

        if (!isTodayInStay(found.checkIn, found.checkOut)) {
            setErrorMsg(
                'Il tuo soggiorno non è attivo oggi. La prenotazione cena è disponibile solo durante il soggiorno.',
            )
            setPageState('error')
            return
        }

        const menu = getMenuForDate(today)
        setTodayMenu(menu)

        const existing = findDinnerByDate(today, found.dinnerCode, mockDinnerReservations)
        setExistingDinner(existing ?? null)

        if (existing && existing.status === 'confermata') {
            setPageState('locked')
            return
        }

        if (!existing && !isBeforeCutoff()) {
            setErrorMsg('Il termine per la prenotazione della cena è le 18:00. Riprova domani.')
            setPageState('error')
            return
        }

        const n = existing?.totalCovers ?? 1
        setCovers(n)
        setOrders(
            existing?.status === 'bozza'
                ? existing.orders.map((o) => ({ ...o }))
                : Array.from({ length: n }, (_, i) => ({ coverNumber: i + 1, primo: '', secondo: '' })),
        )
        setPageState('booking')
    }

    function handleCoversChange(n: number) {
        setCovers(n)
        setOrders(
            Array.from({ length: n }, (_, i) => ({
                coverNumber: i + 1,
                primo: orders[i]?.primo ?? '',
                secondo: orders[i]?.secondo ?? '',
            })),
        )
    }

    function updateOrder(index: number, field: 'primo' | 'secondo', value: string) {
        setOrders((prev) => prev.map((o, i) => (i === index ? { ...o, [field]: value } : o)))
        setValidationError('')
    }

    async function handleConfirm() {
        if (orders.some((o) => !o.primo || !o.secondo)) {
            setValidationError('Seleziona primo e secondo per ogni coperto.')
            return
        }
        try {
            const response = await fetch('/api/dinner-reservations', {
                method: existingDinner?.status === 'bozza' ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dinnerCode: reservation!.dinnerCode,
                    date: today,
                    day: todayMenu!.day,
                    totalCovers: covers,
                    orders,
                }),
            })
            if (!response.ok) {
                const data = await response.json().catch(() => ({}))
                setErrorMsg(data.message ?? 'Errore durante la prenotazione. Riprova.')
                setPageState('error')
                return
            }
            setPageState('success')
        } catch {
            setErrorMsg('Errore di rete. Controlla la connessione e riprova.')
            setPageState('error')
        }
    }

    function handleReset() {
        setCode('')
        setRoomNumber('')
        setPageState('idle')
        setErrorMsg('')
        setReservation(null)
        setTodayMenu(null)
        setExistingDinner(null)
        setOrders([])
        setValidationError('')
    }

    return {
        code,
        setCode,
        roomNumber,
        setRoomNumber,
        pageState,
        errorMsg,
        rlStatus,
        reservation,
        todayMenu,
        existingDinner,
        covers,
        orders,
        validationError,
        today,
        handleSubmitCode,
        handleCoversChange,
        updateOrder,
        handleConfirm,
        handleReset,
    }
}
