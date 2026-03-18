import { useState } from 'react'
import { rooms as initialRooms } from '../data/Rooms'
import type { Room, RoomType } from '../types/Room'

export function useRooms() {
    const [rooms, setRooms] = useState<Room[]>(initialRooms)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState<RoomType | ''>('')

    const filteredRooms = rooms.filter((r) => {
        const matchesType = filterType === '' || r.type === filterType
        const matchesSearch =
            searchQuery === '' ||
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            String(r.roomNumber).includes(searchQuery)
        return matchesType && matchesSearch
    })

    function handleDelete() {
        if (deleteId === null) return
        setRooms((prev) => prev.filter((r) => r.id !== deleteId))
        setDeleteId(null)
    }

    function handleToggleAvailability(id: number) {
        setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, available: !r.available } : r)))
    }

    function clearFilters() {
        setSearchQuery('')
        setFilterType('')
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
        clearFilters,
    }
}
