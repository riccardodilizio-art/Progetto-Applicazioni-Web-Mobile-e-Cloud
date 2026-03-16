import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import type { UserState } from '../../types/User'
import type { RoomReservation, DinnerReservation } from '../../types/Reservation'
import { mockRoomReservations, mockDinnerReservations } from '../../data/Reservations'

type Tab = 'camere' | 'cene'

const roomTypeLabel: Record<string, string> = {
    singola: 'Singola',
    doppia: 'Doppia',
    deluxe: 'Deluxe',
    suite: 'Suite',
}

const statusConfig = {
    confermata: { label: 'Confermata', bg: 'bg-[#E0F0D8]', text: 'text-[#3A6B28]', border: 'border-[#B8D8A8]' },
    in_attesa:  { label: 'In attesa',  bg: 'bg-[#FEF9E7]', text: 'text-[#8A6D00]', border: 'border-[#F0DC82]' },
    annullata:  { label: 'Annullata',  bg: 'bg-[#F5E0D8]', text: 'text-[#8A3820]', border: 'border-[#E6B8A8]' },
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })
}

function StatusBadge({ status }: { status: keyof typeof statusConfig }) {
    const cfg = statusConfig[status]
    return (
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            {cfg.label}
        </span>
    )
}

function RoomCard({ r }: { r: RoomReservation }) {
    return (
        <div className="bg-white rounded-2xl border border-[#E8C9A0] shadow-sm overflow-hidden">
            <div className="bg-[#FAF0E6] border-b border-[#E8C9A0] px-5 py-4 flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs text-[#9A6840] uppercase tracking-wide font-medium mb-0.5">
                        {roomTypeLabel[r.roomType]}
                    </p>
                    <h3 className="font-heading text-lg text-[#3B2010] font-medium leading-snug">{r.roomName}</h3>
                </div>
                <StatusBadge status={r.status} />
            </div>
            <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-[#9A6840] mb-1">Check-in</p>
                        <p className="text-sm text-[#3B2010] font-medium">{formatDate(r.checkIn)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-[#9A6840] mb-1">Check-out</p>
                        <p className="text-sm text-[#3B2010] font-medium">{formatDate(r.checkOut)}</p>
                    </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#E8C9A0]">
                    <p className="text-xs text-[#9A6840]">
                        {r.nights} notti · €{r.pricePerNight}/notte
                    </p>
                    <p className="text-base font-semibold text-[#3B2010]">€{r.totalPrice.toLocaleString('it-IT')}</p>
                </div>
            </div>
        </div>
    )
}

function DinnerCard({ d }: { d: DinnerReservation }) {
    return (
        <div className="bg-white rounded-2xl border border-[#E8C9A0] shadow-sm overflow-hidden">
            <div className="bg-[#3B2010] px-5 py-4 flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs text-[#E8C9A0] mb-0.5">{formatDate(d.date)}</p>
                    <h3 className="font-heading text-lg text-white font-medium">{d.day} · ore 19:30</h3>
                </div>
                <StatusBadge status={d.status} />
            </div>
            <div className="p-5 space-y-3">
                <div className="flex gap-3">
                    <span className="text-xs text-[#9A6840] w-14 flex-shrink-0 pt-0.5">Primo</span>
                    <span className="text-sm text-[#3B2010] leading-snug">{d.primo}</span>
                </div>
                <div className="flex gap-3">
                    <span className="text-xs text-[#9A6840] w-14 flex-shrink-0 pt-0.5">Secondo</span>
                    <span className="text-sm text-[#3B2010] leading-snug">{d.secondo}</span>
                </div>
            </div>
        </div>
    )
}

export default function MyReservations() {
    const user = useAuthUser<UserState>()
    const isAuthenticated = useIsAuthenticated()
    const [activeTab, setActiveTab] = useState<Tab>('camere')

    if (!isAuthenticated || user?.role !== 'client') {
        return <Navigate to="/login" replace />
    }

    const roomReservations: RoomReservation[] = mockRoomReservations
    const dinnerReservations: DinnerReservation[] = mockDinnerReservations

    const activeRooms   = roomReservations.filter(r => r.status !== 'annullata')
    const activeDinners = dinnerReservations.filter(d => d.status !== 'annullata')

    return (
        <div className="min-h-screen bg-[#FAF0E6]">
            {/* Header */}
            <div className="bg-[#3B2010] py-12 px-4 text-center">
                <p className="text-[#E8C9A0] tracking-[0.3em] uppercase text-xs mb-3 font-light">
                    Hotel Excelsior · Pesaro
                </p>
                <h1 className="font-heading text-4xl md:text-5xl font-light text-white mb-3">
                    Le Mie Prenotazioni
                </h1>
                <p className="text-[#E8C9A0] text-sm font-light">
                    Benvenuto, {user?.name} {user?.surname}
                </p>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Riepilogo contatori */}
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

                {/* Tab */}
                <div className="flex gap-2 mb-8">
                    {(['camere', 'cene'] as Tab[]).map(tab => (
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

                {/* Contenuto tab Camere */}
                {activeTab === 'camere' && (
                    <div className="space-y-5">
                        {roomReservations.length === 0 ? (
                            <EmptyState
                                message="Nessuna prenotazione camera trovata."
                                cta={{ label: 'Esplora le camere', to: '/camere' }}
                            />
                        ) : (
                            roomReservations.map(r => <RoomCard key={r.id} r={r} />)
                        )}
                    </div>
                )}

                {/* Contenuto tab Cene */}
                {activeTab === 'cene' && (
                    <div className="space-y-5">
                        {dinnerReservations.length === 0 ? (
                            <EmptyState
                                message="Nessuna prenotazione cena trovata."
                                cta={{ label: 'Vai al menu', to: '/menu' }}
                            />
                        ) : (
                            dinnerReservations.map(d => <DinnerCard key={d.id} d={d} />)
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

function EmptyState({ message, cta }: { message: string; cta: { label: string; to: string } }) {
    return (
        <div className="bg-white rounded-2xl border border-[#E8C9A0] p-12 text-center shadow-sm">
            <p className="text-[#9A6840] text-sm mb-5">{message}</p>
            <Link
                to={cta.to}
                className="inline-block bg-[#3B2010] text-[#E8C9A0] px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#6B4828] transition-colors duration-200"
            >
                {cta.label}
            </Link>
        </div>
    )
}
