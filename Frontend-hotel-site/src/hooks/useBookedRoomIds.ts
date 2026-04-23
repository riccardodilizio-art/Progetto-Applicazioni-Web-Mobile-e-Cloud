import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/apiClient'

/**
 * Ritorna gli id delle camere già prenotate nel periodo selezionato.
 * Se checkIn/checkOut non sono validi ritorna array vuoto.
 */
export function useBookedRoomIds(
    checkIn: string | undefined,
    checkOut: string | undefined,
) {
    const [bookedIds, setBookedIds] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    const validInputs = !!(checkIn && checkOut && checkOut > checkIn)

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (!validInputs) return

        let cancelled = false
        setLoading(true)

        apiFetch<string[]>(
            `/reservations/booked-rooms?checkIn=${checkIn}&checkOut=${checkOut}`,
        )
            .then((data) => {
                if (!cancelled) setBookedIds(data)
            })
            .catch(() => {
                if (!cancelled) setBookedIds([])
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [validInputs, checkIn, checkOut])
    /* eslint-enable react-hooks/set-state-in-effect */

    return {
        bookedIds: validInputs ? bookedIds : [],
        loading: validInputs ? loading : false,
    }
}
