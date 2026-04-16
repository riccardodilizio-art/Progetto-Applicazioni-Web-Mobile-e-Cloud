import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import useSignOut from 'react-auth-kit/hooks/useSignOut'
import type { UserState } from '../../types/User'
import type {
    DinnerReservationAdmin,
    DinnerReservationStatus,
    RoomReservationAdmin,
    RoomReservationStatus,
} from '../../types/Reservation'
import { useAdminReservations } from '../../hooks/useAdminReservations'
import AdminNav from '../../components/admin/AdminNav'
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal'
import RoomReservationTable from '../../components/admin/reservations/RoomReservationTable'
import DinnerReservationTable from '../../components/admin/reservations/DinnerReservationTable'

type SubTab = 'rooms' | 'dinners'

const ROOM_STATUSES: { value: RoomReservationStatus | ''; label: string }[] = [
    { value: '', label: 'Tutti gli stati' },
    { value: 'confermata', label: 'Confermate' },
    { value: 'in_attesa', label: 'In attesa' },
    { value: 'annullata', label: 'Annullate' },
]

const DINNER_STATUSES: { value: DinnerReservationStatus | ''; label: string }[] = [
    { value: '', label: 'Tutti gli stati' },
    { value: 'bozza', label: 'Bozze' },
    { value: 'confermata', label: 'Confermate' },
    { value: 'annullata', label: 'Annullate' },
]

export default function ReservationsDashboard() {
    const signOut = useSignOut()
    const navigate = useNavigate()
    const authUser = useAuthUser<UserState>()
    const {
        roomReservations,
        dinnerReservations,
        loading,
        deleteTarget,
        setDeleteTarget,
        handleDelete,
        changeRoomStatus,
        changeDinnerStatus,
    } = useAdminReservations()


    const [tab, setTab] = useState<SubTab>('rooms')
    const [search, setSearch] = useState('')
    const [roomStatusFilter, setRoomStatusFilter] = useState<RoomReservationStatus | ''>('')
    const [dinnerStatusFilter, setDinnerStatusFilter] = useState<DinnerReservationStatus | ''>('')

    const filteredRooms = useMemo<RoomReservationAdmin[]>(() => {
        const q = search.trim().toLowerCase()
        return roomReservations.filter((r) => {
            if (roomStatusFilter && r.status !== roomStatusFilter) return false
            if (!q) return true
            return (
                r.roomName.toLowerCase().includes(q) ||
                String(r.roomNumber).includes(q) ||
                r.userEmail.toLowerCase().includes(q) ||
                r.dinnerCode.toLowerCase().includes(q) ||
                `${r.userName} ${r.userSurname}`.toLowerCase().includes(q)
            )
        })
    }, [roomReservations, roomStatusFilter, search])

    const filteredDinners = useMemo<DinnerReservationAdmin[]>(() => {
        const q = search.trim().toLowerCase()
        return dinnerReservations.filter((r) => {
            if (dinnerStatusFilter && r.status !== dinnerStatusFilter) return false
            if (!q) return true
            return (
                r.dinnerCode.toLowerCase().includes(q) ||
                (r.userEmail ?? '').toLowerCase().includes(q) ||
                String(r.roomNumber ?? '').includes(q)
            )
        })
    }, [dinnerReservations, dinnerStatusFilter, search])

    const deleteLabel = (() => {
        if (!deleteTarget) return ''
        if (deleteTarget.kind === 'room') {
            const r = roomReservations.find((x) => x.id === deleteTarget.id)
            return r ? `prenotazione di ${r.userEmail} per ${r.roomName}` : 'prenotazione'
        }
        const r = dinnerReservations.find((x) => x.id === deleteTarget.id)
        return r ? `cena ${r.dinnerCode}` : 'cena'
    })()

    const handleLogout = () => {
        signOut()
        navigate('/admin/accedi')
    }

    return (
        <div className="min-h-screen bg-[#FAF5EE]">
            <div className="bg-white border-b border-[#E8C9A0] px-6 py-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl text-[#3B2010] font-light font-heading">Dashboard Admin</h1>
                        <p className="text-sm text-[#9A6840]">{authUser?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <AdminNav />

            <div className="max-w-6xl mx-auto px-6 py-8">
                <h2 className="text-xl font-semibold text-[#3B2010] mb-6">Gestione Prenotazioni</h2>

                {/* Sub-tab Camere / Cene */}
                <div className="flex gap-2 mb-6 border-b border-[#E8C9A0]">
                    {(
                        [
                            { id: 'rooms', label: `Camere (${roomReservations.length})` },
                            { id: 'dinners', label: `Cene (${dinnerReservations.length})` },
                        ] as const
                    ).map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                                tab === t.id
                                    ? 'border-[#3B2010] text-[#3B2010]'
                                    : 'border-transparent text-[#9A6840] hover:text-[#6B4828]'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Filtri */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input
                        type="text"
                        placeholder={
                            tab === 'rooms'
                                ? 'Cerca per camera, ospite, email, codice cena...'
                                : 'Cerca per codice cena, email, numero camera...'
                        }
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 border border-[#C4A070] rounded-lg px-4 py-2 text-sm text-[#3B2010] placeholder-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#9A6840] bg-white"
                    />
                    {tab === 'rooms' ? (
                        <select
                            value={roomStatusFilter}
                            onChange={(e) => setRoomStatusFilter(e.target.value as RoomReservationStatus | '')}
                            className="border border-[#C4A070] rounded-lg px-4 py-2 text-sm text-[#3B2010] focus:outline-none focus:ring-2 focus:ring-[#9A6840] bg-white cursor-pointer"
                        >
                            {ROOM_STATUSES.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <select
                            value={dinnerStatusFilter}
                            onChange={(e) =>
                                setDinnerStatusFilter(e.target.value as DinnerReservationStatus | '')
                            }
                            className="border border-[#C4A070] rounded-lg px-4 py-2 text-sm text-[#3B2010] focus:outline-none focus:ring-2 focus:ring-[#9A6840] bg-white cursor-pointer"
                        >
                            {DINNER_STATUSES.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {loading ? (
                    <p className="text-center text-[#9A6840] py-12">Caricamento prenotazioni...</p>
                ) : tab === 'rooms' ? (
                    <RoomReservationTable
                        reservations={filteredRooms}
                        onDelete={(id) => setDeleteTarget({ id, kind: 'room' })}
                        onStatusChange={changeRoomStatus}
                    />
                ) : (
                    <DinnerReservationTable
                        reservations={filteredDinners}
                        onDelete={(id) => setDeleteTarget({ id, kind: 'dinner' })}
                        onStatusChange={changeDinnerStatus}
                    />
                )}

            </div>

            {deleteTarget && (
                <DeleteConfirmModal
                    title="Elimina prenotazione"
                    itemName={deleteLabel}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    )
}
