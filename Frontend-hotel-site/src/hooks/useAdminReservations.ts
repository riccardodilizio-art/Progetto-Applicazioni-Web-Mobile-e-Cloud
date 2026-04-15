import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../lib/apiClient'
import { mapApiDinnerReservationAdmin, mapApiRoomReservationAdmin } from '../lib/mappers'
import type {
    ApiDinnerReservationAdmin,
    ApiRoomReservationAdmin,
    DinnerReservationAdmin,
    RoomReservationAdmin,
} from '../types/Reservation'

type DeleteKind = 'room' | 'dinner'
type DeleteTarget = { id: string; kind: DeleteKind } | null

export function useAdminReservations() {
    const [roomReservations, setRoomReservations] = useState<RoomReservationAdmin[]>([])
    const [dinnerReservations, setDinnerReservations] = useState<DinnerReservationAdmin[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null)

    useEffect(() => {
        Promise.all([
            apiFetch<ApiRoomReservationAdmin[]>('/reservations'),
            apiFetch<ApiDinnerReservationAdmin[]>('/dinner-reservations'),
        ])
            .then(([rooms, dinners]) => {
                setRoomReservations(rooms.map(mapApiRoomReservationAdmin))
                setDinnerReservations(dinners.map(mapApiDinnerReservationAdmin))
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const handleDelete = useCallback(async () => {
        if (!deleteTarget) return
        const { id, kind } = deleteTarget
        try {
            if (kind === 'room') {
                await apiFetch(`/reservations/${id}`, { method: 'DELETE' })
                setRoomReservations((prev) => prev.filter((r) => r.id !== id))
            } else {
                await apiFetch(`/dinner-reservations/${id}`, { method: 'DELETE' })
                setDinnerReservations((prev) => prev.filter((r) => r.id !== id))
            }
        } catch (err) {
            console.error('Errore eliminazione prenotazione:', err)
        } finally {
            setDeleteTarget(null)
        }
    }, [deleteTarget])

    return {
        roomReservations,
        dinnerReservations,
        loading,
        deleteTarget,
        setDeleteTarget,
        handleDelete,
    }
}
