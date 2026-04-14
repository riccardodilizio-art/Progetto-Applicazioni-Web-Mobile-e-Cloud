import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../lib/apiClient'
import { mapApiRoom, roomToApiRequest } from '../lib/mappers'
import type { Room, ApiRoom } from '../types/Room'
import { useRoomFilter } from './useRoomFilter'

export function useRooms() {
    const [rooms, setRooms] = useState<Room[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const { searchQuery, setSearchQuery, filterType, setFilterType, filteredRooms, reset } = useRoomFilter(rooms)

    useEffect(() => {
        apiFetch<ApiRoom[]>('/rooms')
            .then((data) => setRooms(data.map(mapApiRoom)))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const handleDelete = useCallback(async () => {
        if (deleteId === null) return
        try {
            await apiFetch(`/rooms/${deleteId}`, { method: 'DELETE' })
            setRooms((prev) => prev.filter((r) => r.id !== deleteId))
        } catch (err) {
            console.error('Errore eliminazione camera:', err)
        } finally {
            setDeleteId(null)
        }
    }, [deleteId])

    const handleToggleAvailability = useCallback(async (id: string) => {
        const room = rooms.find((r) => r.id === id)
        if (!room) return
        const updated = { ...room, available: !room.available }
        try {
            await apiFetch(`/rooms/${id}`, {
                method: 'PUT',
                body: JSON.stringify(roomToApiRequest(updated)),
            })
            setRooms((prev) => prev.map((r) => (r.id === id ? updated : r)))
        } catch (err) {
            console.error('Errore toggle disponibilità:', err)
        }
    }, [rooms])

    return {
        rooms,
        loading,
        filteredRooms,
        deleteId,
        setDeleteId,
        searchQuery,
        setSearchQuery,
        filterType,
        setFilterType,
        handleDelete,
        handleToggleAvailability,
        clearFilters: reset,
    }
}
