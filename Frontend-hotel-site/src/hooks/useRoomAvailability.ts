import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/apiClient'

type AvailabilityResponse = { available: boolean }

export function useRoomAvailability(
    roomId: string | undefined,
    checkIn: string | undefined,
    checkOut: string | undefined,
) {
    const [available, setAvailable] = useState<boolean | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const validInputs = !!(roomId && checkIn && checkOut && checkOut > checkIn)

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (!validInputs) return

        let cancelled = false
        setLoading(true)

        apiFetch<AvailabilityResponse>(
            `/reservations/availability?idRoom=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`,
        )
            .then((data) => {
                if (!cancelled) setAvailable(data.available)
            })
            .catch(() => {
                if (!cancelled) setAvailable(null)
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [validInputs, roomId, checkIn, checkOut])
    /* eslint-enable react-hooks/set-state-in-effect */

    return {
        available: validInputs ? available : null,
        loading: validInputs ? loading : false,
    }
}
