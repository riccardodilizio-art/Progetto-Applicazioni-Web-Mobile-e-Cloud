import { mockRoomReservations, mockDinnerReservations } from '../data/Reservations'
import type { DinnerOrder, DinnerReservation, RoomReservation } from '../types/Reservation'
import type { DayMenu } from '../types/Menu'
import { useState, useMemo } from 'react'
import { apiFetch } from '../lib/apiClient'

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

    const today = useMemo(() => new Date().toISOString().split('T')[0], [])

    function handleSubmitCode(e: React.FormEvent) {
        e.preventDefault()

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
            await apiFetch('/dinner-reservations', {
                method: existingDinner?.status === 'bozza' ? 'PUT' : 'POST',
                body: JSON.stringify({
                    dinnerCode: reservation!.dinnerCode,
                    date: today,
                    day: todayMenu!.day,
                    totalCovers: covers,
                    orders,
                }),
            })
            setPageState('success')
        } catch (err) {
            // 401 già gestito da apiFetch → onUnauthorized → redirect login
            if (err instanceof Error && err.message === 'Sessione scaduta') return
            setErrorMsg('Errore durante la prenotazione. Riprova.')
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
