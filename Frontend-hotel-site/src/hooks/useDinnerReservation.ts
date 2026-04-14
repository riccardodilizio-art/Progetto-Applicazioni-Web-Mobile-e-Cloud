import type { DinnerOrder, DinnerReservation, ApiDinnerReservation } from '../types/Reservation'
import type { DayMenu } from '../types/Menu'
import { useState } from 'react'
import { apiFetch } from '../lib/apiClient'
import { mapApiDinnerReservation } from '../lib/mappers'
import { getMenuForDate, isBeforeCutoff } from '../lib/dinnerUtils'
import { useRateLimit } from './useRateLimit'

export type PageState = 'idle' | 'loading' | 'booking' | 'locked' | 'error' | 'success'

export function useDinnerReservation() {
    const [code, setCode] = useState('')
    const [roomNumber, setRoomNumber] = useState('')
    const [pageState, setPageState] = useState<PageState>('idle')
    const [errorMsg, setErrorMsg] = useState('')
    const { status: rlStatus, onFailure, onSuccess } = useRateLimit()
    const [todayMenu, setTodayMenu] = useState<DayMenu | null>(null)
    const [existingDinner, setExistingDinner] = useState<DinnerReservation | null>(null)
    const [covers, setCovers] = useState(1)
    const [orders, setOrders] = useState<DinnerOrder[]>([])
    const [validationError, setValidationError] = useState('')

    const today = new Date().toISOString().split('T')[0]

    async function handleSubmitCode(e: React.FormEvent) {
        e.preventDefault()

        if (rlStatus.blocked) {
            setErrorMsg(
                `Accesso bloccato per troppi tentativi. Riprova alle ${rlStatus.unblockAt?.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}.`,
            )
            setPageState('error')
            return
        }

        const trimmedCode = code.trim()
        const trimmedRoom = roomNumber.trim()

        if (!trimmedCode || !trimmedRoom) {
            setErrorMsg('Inserisci codice prenotazione e numero camera.')
            setPageState('error')
            return
        }

        setPageState('loading')

        try {
            // Verifica se esiste già una prenotazione cena per oggi con questo codice
            const existing = await apiFetch<ApiDinnerReservation>(
                `/dinner-reservations/by-code/${trimmedCode}?numeroCamera=${trimmedRoom}`,
            ).catch(() => null)

            onSuccess()

            // Carica il menu di oggi
            const menu = await getMenuForDate(today)
            if (!menu) {
                setErrorMsg('Menu non disponibile per oggi.')
                setPageState('error')
                return
            }
            setTodayMenu(menu)

            if (existing) {
                const mapped = mapApiDinnerReservation(existing)
                setExistingDinner(mapped)

                if (mapped.status === 'confermata') {
                    setPageState('locked')
                    return
                }

                // Bozza → permetti modifica
                setCovers(mapped.totalCovers)
                setOrders(mapped.orders.map((o) => ({ ...o })))
            } else {
                setExistingDinner(null)

                if (!isBeforeCutoff()) {
                    setErrorMsg('Il termine per la prenotazione della cena è le 18:00. Riprova domani.')
                    setPageState('error')
                    return
                }

                setCovers(1)
                setOrders([{ coverNumber: 1, primo: '', secondo: '' }])
            }

            setPageState('booking')
        } catch {
            const newRL = onFailure()
            setErrorMsg(
                newRL.blocked
                    ? 'Troppi tentativi falliti. Riprova tra 15 minuti.'
                    : `Codice o numero di camera non validi. Tentativi rimasti: ${newRL.remainingAttempts}.`,
            )
            setPageState('error')
        }
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
        if (!todayMenu) return
        if (orders.some((o) => !o.primo || !o.secondo)) {
            setValidationError('Seleziona primo e secondo per ogni coperto.')
            return
        }
        try {
            await apiFetch('/dinner-reservations', {
                method: 'POST',
                body: JSON.stringify({
                    codiceCena: code.trim(),
                    numeroCamera: Number(roomNumber.trim()),
                    data: today,
                    numeroCoperti: covers,
                    ordini: orders.map((o) => ({
                        numeroCoperto: o.coverNumber,
                        primo: o.primo,
                        secondo: o.secondo,
                    })),
                }),
            })
            setPageState('success')
        } catch (err) {
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
