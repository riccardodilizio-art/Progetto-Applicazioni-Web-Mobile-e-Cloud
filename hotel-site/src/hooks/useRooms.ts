import { useState } from 'react'
import { rooms as initialRooms } from '../data/Rooms'
import { useRoomFilter } from './useRoomFilter'

export function useRooms() {
    const [rooms, setRooms] = useState(initialRooms)
    const [deleteId, setDeleteId] = useState<number | null>(null)

    const { searchQuery, setSearchQuery, filterType, setFilterType, filteredRooms, reset } =
        useRoomFilter(rooms)

    function handleDelete() {
        if (deleteId === null) return
        setRooms((prev) => prev.filter((r) => r.id !== deleteId))
        setDeleteId(null)
    }

    function handleToggleAvailability(id: number) {
        setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, available: !r.available } : r)))
    }

    return {
        rooms,
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
