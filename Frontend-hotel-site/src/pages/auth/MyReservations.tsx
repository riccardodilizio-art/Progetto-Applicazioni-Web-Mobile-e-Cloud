import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import type { UserState } from '../../types/User'
import type { RoomReservation, DinnerReservation } from '../../types/Reservation'
import { mockRoomReservations, mockDinnerReservations } from '../../data/Reservations'
import RoomCard from '../../components/reservations/RoomCard'
import DinnerCard from '../../components/reservations/DinnerCard'
import EmptyState from '../../components/reservations/EmptyState'

type Tab = 'camere' | 'cene'

export default function MyReservations() {
    const user = useAuthUser<UserState>()
    const isAuthenticated = useIsAuthenticated()
    const [activeTab, setActiveTab] = useState<Tab>('camere')

    const [roomReservations, setRoomReservations] = useState<RoomReservation[]>(() =>
        mockRoomReservations.filter((r) => r.userEmail === user?.email),
    )

    const userDinnerCodes = mockRoomReservations.filter((r) => r.userEmail === user?.email).map((r) => r.dinnerCode)

    const [dinnerReservations, setDinnerReservations] = useState<DinnerReservation[]>(() =>
        mockDinnerReservations.filter((d) => userDinnerCodes.includes(d.dinnerCode)),
    )

    const handleCancelRoom = (id: string) => {
        setRoomReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'annullata' } : r)))
    }

    const handleCancelDinner = (id: string) => {
        setDinnerReservations((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'annullata' } : d)))
    }

    if (!isAuthenticated || user?.role !== 'client') {
        return <Navigate to="/login" replace />
    }

    const activeRooms = roomReservations.filter((r) => r.status !== 'annullata')
    const activeDinners = dinnerReservations.filter((d) => d.status !== 'annullata')

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
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-white rounded-2xl border border-[#E8C9A0] p-5 text-center shadow-sm">
                        <p className="text-3xl font-heading font-light text-[#3B2010] mb-1">{activeRooms.length}</p>
                        <p className="text-xs text-[#9A6840] uppercase tracking-wide">Soggiorni attivi</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-[#E8C9A0] p-5 text-center shadow-sm">
                        <p className="text-3xl font-heading font-light text-[#3B2010] mb-1">{activeDinners.length}</p>
                        <p className="text-xs text-[#9A6840] uppercase tracking-wide">Cene prenotate</p>
                    </div>
                </div>

                <div className="flex gap-2 mb-8">
                    {(['camere', 'cene'] as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 capitalize ${
                                activeTab === tab
                                    ? 'bg-[#3B2010] text-[#E8C9A0] shadow-md'
                                    : 'bg-white text-[#6B4828] border border-[#C4A070] hover:bg-[#E8C9A0]'
                            }`}
                        >
                            {tab === 'camere' ? 'Camere' : 'Cene'}
                        </button>
                    ))}
                </div>

                {activeTab === 'camere' && (
                    <div className="space-y-5">
                        {roomReservations.length === 0 ? (
                            <EmptyState
                                message="Nessuna prenotazione camera trovata."
                                cta={{ label: 'Esplora le camere', to: '/rooms' }}
                            />
                        ) : (
                            roomReservations.map((r) => (
                                <RoomCard key={r.id} r={r} onCancel={() => handleCancelRoom(r.id)} />
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'cene' && (
                    <div className="space-y-5">
                        {dinnerReservations.length === 0 ? (
                            <EmptyState
                                message="Nessuna prenotazione cena trovata."
                                cta={{ label: 'Vai al menu', to: '/menu' }}
                            />
                        ) : (
                            dinnerReservations.map((d) => (
                                <DinnerCard key={d.id} d={d} onCancel={() => handleCancelDinner(d.id)} />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
