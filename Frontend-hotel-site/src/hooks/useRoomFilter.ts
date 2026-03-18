import { useState, useMemo } from 'react'
import type { Room, RoomType } from '../types/Room'

export function useRoomFilter(rooms: Room[]) {
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState<RoomType | ''>('')

    const filteredRooms = useMemo(() => {
        return rooms.filter((r) => {
            const matchesType = filterType === '' || r.type === filterType
            const matchesSearch =
                searchQuery === '' ||
                r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                String(r.roomNumber).includes(searchQuery)
            return matchesType && matchesSearch
        })
    }, [rooms, searchQuery, filterType])

    const reset = () => {
        setSearchQuery('')
        setFilterType('')
    }

    return {
        searchQuery,
        setSearchQuery,
        filterType,
        setFilterType,
        filteredRooms,
        reset,
    }
}
