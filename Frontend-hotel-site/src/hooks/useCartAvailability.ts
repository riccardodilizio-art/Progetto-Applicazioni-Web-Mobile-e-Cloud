import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../lib/apiClient'

type AvailabilityResponse = { available: boolean }

type CartItemKey = { roomId: string; checkIn: string; checkOut: string }

/**
 * Ritorna una mappa { roomId: isAvailable } per ogni voce del carrello.
 * Fa un fetch per ogni camera tenendo conto delle date proprie dell'item.
 */
export function useCartAvailability(items: CartItemKey[]) {
    const [availability, setAvailability] = useState<Record<string, boolean>>({})
    const [loading, setLoading] = useState(false)

    // chiave stabile per evitare re-fetch ad ogni render
    const depKey = useMemo(
        () => items.map((i) => `${i.roomId}|${i.checkIn}|${i.checkOut}`).join(','),
        [items],
    )

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (items.length === 0) {
            setAvailability({})
            return
        }

        let cancelled = false
        setLoading(true)

        Promise.all(
            items.map((it) =>
                apiFetch<AvailabilityResponse>(
                    `/reservations/availability?idRoom=${it.roomId}&checkIn=${it.checkIn}&checkOut=${it.checkOut}`,
                )
                    .then((res) => ({ id: it.roomId, ok: res.available }))
                    .catch(() => ({ id: it.roomId, ok: true })),   // in dubbio assumiamo disponibile
            ),
        )
            .then((results) => {
                if (cancelled) return
                const map: Record<string, boolean> = {}
                for (const r of results) map[r.id] = r.ok
                setAvailability(map)
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => {
            cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depKey])
    /* eslint-enable react-hooks/set-state-in-effect */

    return { availability, loading }
}
