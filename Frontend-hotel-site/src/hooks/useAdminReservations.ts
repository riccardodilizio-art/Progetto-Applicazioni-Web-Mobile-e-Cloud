import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../lib/apiClient'
import {
    mapApiDinnerReservationAdmin,
    mapApiRoomReservationAdmin,
} from '../lib/mappers'
import type {
    ApiDinnerReservationAdmin,
    ApiRoomReservationAdmin,
    DinnerReservationAdmin,
    DinnerReservationStatus,
    RoomReservationAdmin,
    RoomReservationStatus,
} from '../types/Reservation'

type DeleteKind = 'room' | 'dinner'
type DeleteTarget = { id: string; kind: DeleteKind } | null
type PagedResponse<T> = {
    items: T[]
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
}

const roomStatusToApi: Record<RoomReservationStatus, string> = {
    confermata: 'CONFERMATO',
    in_attesa: 'IN_ATTESA',
    annullata: 'ANNULLATO',
}

const dinnerStatusToApi: Record<DinnerReservationStatus, string> = {
    bozza: 'BOZZA',
    confermata: 'CONFERMATA',
    annullata: 'ANNULLATA',
}

export function useAdminReservations() {
    const [roomReservations, setRoomReservations] = useState<RoomReservationAdmin[]>([])
    const [dinnerReservations, setDinnerReservations] = useState<DinnerReservationAdmin[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null)

    useEffect(() => {
        Promise.all([
            apiFetch<PagedResponse<ApiRoomReservationAdmin>>('/reservations?page=1&pageSize=100'),
            apiFetch<ApiDinnerReservationAdmin[]>('/dinner-reservations'),
        ])
            .then(([roomsPaged, dinners]) => {
                setRoomReservations(roomsPaged.items.map(mapApiRoomReservationAdmin))
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

    const changeRoomStatus = useCallback(
        async (id: string, newStatus: RoomReservationStatus) => {
            try {
                const updated = await apiFetch<ApiRoomReservationAdmin>(
                    `/reservations/${id}/status`,
                    {
                        method: 'PATCH',
                        body: JSON.stringify({ stato: roomStatusToApi[newStatus] }),
                    },
                )
                const mapped = mapApiRoomReservationAdmin(updated)
                setRoomReservations((prev) =>
                    prev.map((r) => (r.id === id ? { ...r, ...mapped } : r)),
                )
            } catch (err) {
                console.error('Errore cambio stato prenotazione camera:', err)
            }
        },
        [],
    )

    const changeDinnerStatus = useCallback(
        async (id: string, newStatus: DinnerReservationStatus) => {
            try {
                const updated = await apiFetch<ApiDinnerReservationAdmin>(
                    `/dinner-reservations/${id}/status`,
                    {
                        method: 'PATCH',
                        body: JSON.stringify({ stato: dinnerStatusToApi[newStatus] }),
                    },
                )
                const mapped = mapApiDinnerReservationAdmin(updated)
                setDinnerReservations((prev) =>
                    prev.map((r) => (r.id === id ? { ...r, ...mapped } : r)),
                )
            } catch (err) {
                console.error('Errore cambio stato prenotazione cena:', err)
            }
        },
        [],
    )

    return {
        roomReservations,
        dinnerReservations,
        loading,
        deleteTarget,
        setDeleteTarget,
        handleDelete,
        changeRoomStatus,
        changeDinnerStatus,
    }
}
