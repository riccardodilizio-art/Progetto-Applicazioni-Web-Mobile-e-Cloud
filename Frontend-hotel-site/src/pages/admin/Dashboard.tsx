import { Link, useNavigate } from 'react-router-dom'
import useSignOut from 'react-auth-kit/hooks/useSignOut'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import { typeLabels } from '../../data/roomUtils'
import type { RoomType } from '../../types/Room'
import type { UserState } from '../../types/User'
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal'
import { useRooms } from '../../hooks/useRooms'
import AdminNav from '../../components/admin/AdminNav'

export default function Dashboard() {
    const signOut = useSignOut()
    const navigate = useNavigate()
    const authUser = useAuthUser<UserState>()

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
        handleToggleAvailability,
        clearFilters,
    } = useRooms()

    const handleLogout = () => {
        signOut()
        navigate('/admin/accedi')
    }


    return (
        <div className="min-h-screen bg-[#FAF5EE]">
            {/* Header */}
            <div className="bg-white border-b border-[#E8C9A0] px-6 py-4">
                <AdminNav />
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
                            value: `${rooms.length > 0 ? Math.round(rooms.reduce((s, r) => s + r.pricePerNight, 0) / rooms.length) : 0}€`,
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
                        to="/admin/camere/nuova"
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

                {/* Tabella camere - Desktop */}
                <div className="hidden md:block bg-white rounded-xl shadow-sm border border-[#E8C9A0]/50 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#FAF5EE] border-b border-[#E8C9A0]/50">
                                <th className="text-left text-xs font-semibold text-[#9A6840] uppercase tracking-wider px-6 py-3">
                                    Camera
                                </th>
                                <th className="text-left text-xs font-semibold text-[#9A6840] uppercase tracking-wider px-6 py-3">
                                    Tipo
                                </th>
                                <th className="text-left text-xs font-semibold text-[#9A6840] uppercase tracking-wider px-6 py-3">
                                    Prezzo
                                </th>
                                <th className="text-left text-xs font-semibold text-[#9A6840] uppercase tracking-wider px-6 py-3">
                                    Capacità
                                </th>
                                <th className="text-left text-xs font-semibold text-[#9A6840] uppercase tracking-wider px-6 py-3">
                                    Stato
                                </th>
                                <th className="text-right text-xs font-semibold text-[#9A6840] uppercase tracking-wider px-6 py-3">
                                    Azioni
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRooms.map((room) => (
                                <tr
                                    key={room.id}
                                    className="border-b border-[#E8C9A0]/30 hover:bg-[#FAF5EE]/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={room.images[0] ?? '/images/LogoHotel.png'}
                                                alt={room.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-[#3B2010]">{room.name}</p>
                                                <p className="text-xs text-[#9A6840]">
                                                    #{room.roomNumber} · Piano {room.floor}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-[#6B4828]">{typeLabels[room.type]}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-semibold text-[#3B2010]">
                                            €{room.pricePerNight}
                                        </span>
                                        <span className="text-xs text-[#9A6840]"> /notte</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-[#6B4828]">
                                            {room.capacity} {room.capacity === 1 ? 'ospite' : 'ospiti'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleAvailability(room.id)}
                                            className={`text-xs font-semibold px-3 py-1 rounded-full cursor-pointer transition-colors ${
                                                room.available
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                            }`}
                                        >
                                            {room.available ? 'Disponibile' : 'Non disponibile'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                to={`/admin/camere/modifica/${room.id}`}
                                                className="text-sm text-[#6B4828] border border-[#C4A070] px-3 py-1.5 rounded-lg hover:bg-[#FAF5EE] transition-colors"
                                            >
                                                Modifica
                                            </Link>
                                            <button
                                                onClick={() => setDeleteId(room.id)}
                                                className="text-sm text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                            >
                                                Elimina
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Card camere - Mobile */}
                <div className="md:hidden space-y-4">
                    {filteredRooms.map((room) => (
                        <div key={room.id} className="bg-white rounded-xl shadow-sm border border-[#E8C9A0]/50 p-4">
                            <div className="flex gap-4">
                                <img
                                    src={room.images[0] ?? '/images/LogoHotel.png'}
                                    alt={room.name}
                                    className="w-20 h-20 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <h3 className="font-medium text-[#3B2010]">{room.name}</h3>
                                    <p className="text-xs text-[#9A6840]">
                                        #{room.roomNumber} · {typeLabels[room.type]} · {room.size}m²
                                    </p>
                                    <p className="text-sm font-semibold text-[#3B2010] mt-1">
                                        €{room.pricePerNight}{' '}
                                        <span className="text-xs font-normal text-[#9A6840]">/notte</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleToggleAvailability(room.id)}
                                    className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer ${
                                        room.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}
                                >
                                    {room.available ? 'Disp.' : 'N/D'}
                                </button>
                            </div>
                            <div className="flex gap-2 mt-3 pt-3 border-t border-[#E8C9A0]/30">
                                <Link
                                    to={`/admin/camere/modifica/${room.id}`}
                                    className="flex-1 text-center text-sm text-[#6B4828] border border-[#C4A070] py-2 rounded-lg hover:bg-[#FAF5EE] transition-colors"
                                >
                                    Modifica
                                </Link>
                                <button
                                    onClick={() => setDeleteId(room.id)}
                                    className="flex-1 text-sm text-red-600 border border-red-200 py-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                >
                                    Elimina
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredRooms.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-[#9A6840] text-lg mb-4">
                            {rooms.length === 0 ? 'Nessuna camera presente' : 'Nessuna camera corrisponde ai filtri'}
                        </p>
                        {rooms.length === 0 ? (
                            <Link
                                to="/admin/camere/nuova"
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
                    title="Elimina camera"
                    itemName={rooms.find((r) => r.id === deleteId)?.name ?? ''}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}

        </div>
    )
}
