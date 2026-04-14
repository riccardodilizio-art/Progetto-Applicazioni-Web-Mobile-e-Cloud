import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import type { UserState } from '../../types/User'
import type { RoomReservation } from '../../types/Reservation'
import type { ApiRoomReservation } from '../../types/Reservation'
import { mapApiRoomReservation } from '../../lib/mappers'
import { apiFetch } from '../../lib/apiClient'
import RoomCard from '../../components/reservations/RoomCard'
import EmptyState from '../../components/reservations/EmptyState'

export default function MyReservations() {
    const user = useAuthUser<UserState>()
    const isAuthenticated = useIsAuthenticated()
    const [roomReservations, setRoomReservations] = useState<RoomReservation[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user?.id) return
        apiFetch<ApiRoomReservation[]>(`/reservations/user/${user.id}`)
            .then((data) => setRoomReservations(data.map(mapApiRoomReservation)))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [user?.id])

    const handleCancelRoom = async (id: string) => {
        try {
            await apiFetch(`/reservations/${id}`, { method: 'DELETE' })
            setRoomReservations((prev) => prev.filter((r) => r.id !== id))
        } catch (err) {
            console.error('Errore annullamento:', err)
        }
    }

    if (!isAuthenticated || user?.role !== 'client') {
        return <Navigate to="/login" replace />
    }

    const activeRooms = roomReservations.filter((r) => r.status !== 'annullata')

    return (
        <div className="min-h-screen bg-[#FAF0E6]">
            <div className="bg-[#3B2010] py-12 px-4 text-center">
                <p className="text-[#E8C9A0] tracking-[0.3em] uppercase text-xs mb-3 font-light">
                    Hotel Excelsior · Pesaro
                </p>
                <h1 className="font-heading text-4xl md:text-5xl font-light text-white mb-3">Le Mie Prenotazioni</h1>
                <p className="text-[#E8C9A0] text-sm font-light">
                    Benvenuto, {user?.name} {user?.surname}
                </p>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl border border-[#E8C9A0] p-5 text-center shadow-sm mb-10">
                    <p className="text-3xl font-heading font-light text-[#3B2010] mb-1">{activeRooms.length}</p>
                    <p className="text-xs text-[#9A6840] uppercase tracking-wide">Soggiorni attivi</p>
                </div>

                {loading ? (
                    <p className="text-center text-[#9A6840] py-12">Caricamento prenotazioni...</p>
                ) : (
                    <div className="space-y-5">
                        {roomReservations.length === 0 ? (
                            <EmptyState
                                message="Nessuna prenotazione trovata."
                                cta={{ label: 'Esplora le camere', to: '/camere' }}
                            />
                        ) : (
                            roomReservations.map((r) => (
                                <RoomCard key={r.id} r={r} onCancel={() => handleCancelRoom(r.id)} />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
