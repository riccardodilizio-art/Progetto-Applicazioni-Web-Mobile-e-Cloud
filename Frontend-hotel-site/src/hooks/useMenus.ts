import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../lib/apiClient'
import type { ApiMenuResponse } from '../types/Menu'

export function useMenus() {
    const [menus, setMenus] = useState<ApiMenuResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    useEffect(() => {
        apiFetch<ApiMenuResponse[]>('/menus')
            .then(setMenus)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const handleDelete = useCallback(async () => {
        if (!deleteId) return
        try {
            await apiFetch(`/menus/${deleteId}`, { method: 'DELETE' })
            setMenus((prev) => prev.filter((m) => m.idMenu !== deleteId))
        } catch (err) {
            console.error('Errore eliminazione menu:', err)
        } finally {
            setDeleteId(null)
        }
    }, [deleteId])

    return { menus, loading, deleteId, setDeleteId, handleDelete }
}
