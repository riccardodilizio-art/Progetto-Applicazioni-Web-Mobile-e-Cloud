import { Link, useNavigate } from 'react-router-dom'
import useSignOut from 'react-auth-kit/hooks/useSignOut'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import { typeLabels } from '../../data/roomUtils'
import type { RoomType } from '../../types/Room'
import type { UserState } from '../../types/User'
import LoadingSpinner from '../../components/LoadingSpinner'
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal'
import { useRooms } from '../../hooks/useRooms'

export default function Dashboard() {
    const signOut = useSignOut()
    const navigate = useNavigate()
    const authUser = useAuthUser<UserState>()
    const [isLoading] = [false]

    const {
        rooms,
        filteredRooms,
        deleteId,
        setDeleteId,
        searchQuery,
        setSearchQuery,
        filterType,
        setFilterType,
        handleDelete,
        clearFilters,
    } = useRooms()

    if (isLoading) return <LoadingSpinner message="Caricamento camere..." />

    const handleLogout = () => {
        signOut()
        navigate('/admin/login')
    }

    return (
        <div className="min-h-screen bg-[#FAF5EE]">
            {/* Header */}
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

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Camere totali', value: rooms.length, color: 'text-[#3B2010]' },
                        {
                            label: 'Disponibili',
                            value: rooms.filter((r) => r.available).length,
                            color: 'text-green-700',
                        },
                        {
                            label: 'Non disponibili',
                            value: rooms.filter((r) => !r.available).length,
                            color: 'text-red-600',
                        },
                        {
                            label: 'Prezzo medio',
                            value: `${Math.round(rooms.reduce((s, r) => s + r.pricePerNight, 0) / rooms.length)}€`,
                            color: 'text-[#3B2010]',
                        },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-[#E8C9A0]/50">
                            <p className="text-sm text-[#9A6840]">{label}</p>
                            <p className={`text-2xl font-bold ${color}`}>{value}</p>
                        </div>
                    ))}
                </div>

                {/* Titolo + aggiungi */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-[#3B2010]">Gestione Camere</h2>
                    <Link
                        to="/admin/rooms/new"
                        className="bg-[#3B2010] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#6B4828] transition-colors"
                    >
                        + Aggiungi camera
                    </Link>
                </div>

                {/* Filtri */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Cerca per nome o numero camera..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 border border-[#C4A070] rounded-lg px-4 py-2 text-sm text-[#3B2010] placeholder-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#9A6840] focus:border-transparent bg-white"
                    />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as RoomType | '')}
                        className="border border-[#C4A070] rounded-lg px-4 py-2 text-sm text-[#3B2010] focus:outline-none focus:ring-2 focus:ring-[#9A6840] bg-white cursor-pointer"
                    >
                        <option value="">Tutti i tipi</option>
                        {(Object.keys(typeLabels) as RoomType[]).map((type) => (
                            <option key={type} value={type}>
                                {typeLabels[type]}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ... tabella desktop + card mobile identiche a prima ... */}

                {filteredRooms.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-[#9A6840] text-lg mb-4">
                            {rooms.length === 0 ? 'Nessuna camera presente' : 'Nessuna camera corrisponde ai filtri'}
                        </p>
                        {rooms.length === 0 ? (
                            <Link
                                to="/admin/rooms/new"
                                className="text-[#6B4828] underline hover:opacity-70 transition"
                            >
                                Aggiungi la prima camera
                            </Link>
                        ) : (
                            <button
                                onClick={clearFilters}
                                className="text-[#6B4828] underline hover:opacity-70 transition cursor-pointer"
                            >
                                Rimuovi filtri
                            </button>
                        )}
                    </div>
                )}
            </div>

            {deleteId !== null && (
                <DeleteConfirmModal
                    rooms={rooms}
                    deleteId={deleteId}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    )
}
