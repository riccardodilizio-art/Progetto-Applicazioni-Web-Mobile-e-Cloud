import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useSignOut from 'react-auth-kit/hooks/useSignOut'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import { rooms as initialRooms } from '../../data/Rooms'
import { typeLabels } from '../../data/roomUtils'
import type { Room } from '../../types/Room'
import type { UserState } from '../../types/User'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function Dashboard() {
    const signOut = useSignOut()
    const navigate = useNavigate()
    const authUser = useAuthUser<UserState>()
    const [rooms, setRooms] = useState<Room[]>(initialRooms)
    const [isLoading] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)

    const handleLogout = () => {
        signOut()
        navigate('/admin/login')
    }

    const handleDelete = () => {
        if (deleteId === null) return
        // TODO: chiamata API
        setRooms(prev => prev.filter(r => r.id !== deleteId))
        setDeleteId(null)
    }

    const handleToggleAvailability = (id: number) => {
        // TODO: chiamata API per aggiornare disponibilità
        setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, available: !r.available } : r)))
    }

    if (isLoading) return <LoadingSpinner message="Caricamento camere..." />

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
                {/* Statistiche rapide */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E8C9A0]/50">
                        <p className="text-sm text-[#9A6840]">Camere totali</p>
                        <p className="text-2xl font-bold text-[#3B2010]">{rooms.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E8C9A0]/50">
                        <p className="text-sm text-[#9A6840]">Disponibili</p>
                        <p className="text-2xl font-bold text-green-700">{rooms.filter((r) => r.available).length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E8C9A0]/50">
                        <p className="text-sm text-[#9A6840]">Non disponibili</p>
                        <p className="text-2xl font-bold text-red-600">{rooms.filter((r) => !r.available).length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E8C9A0]/50">
                        <p className="text-sm text-[#9A6840]">Prezzo medio</p>
                        <p className="text-2xl font-bold text-[#3B2010]">
                            {Math.round(rooms.reduce((sum, r) => sum + r.pricePerNight, 0) / rooms.length)}€
                        </p>
                    </div>
                </div>

                {/* Titolo + bottone aggiungi */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-[#3B2010]">Gestione Camere</h2>
                    <Link
                        to="/admin/rooms/new"
                        className="bg-[#3B2010] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#6B4828] transition-colors"
                    >
                        + Aggiungi camera
                    </Link>
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
                        {rooms.map((room) => (
                            <tr
                                key={room.id}
                                className="border-b border-[#E8C9A0]/30 hover:bg-[#FAF5EE]/50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={room.images[0]}
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
                                            to={`/admin/rooms/edit/${room.id}`}
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
                    {rooms.map((room) => (
                        <div key={room.id} className="bg-white rounded-xl shadow-sm border border-[#E8C9A0]/50 p-4">
                            <div className="flex gap-4">
                                <img
                                    src={room.images[0]}
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
                                    to={`/admin/rooms/edit/${room.id}`}
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

                {/* Messaggio lista vuota */}
                {rooms.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-[#9A6840] text-lg mb-4">Nessuna camera presente</p>
                        <Link to="/admin/rooms/new" className="text-[#6B4828] underline hover:opacity-70 transition">
                            Aggiungi la prima camera
                        </Link>
                    </div>
                )}
            </div>

            {/* Modale conferma eliminazione */}
            {deleteId !== null && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setDeleteId(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-[#3B2010] text-center mb-2">Elimina camera</h3>
                        <p className="text-sm text-[#9A6840] text-center mb-6">
                            Sei sicuro di voler eliminare{' '}
                            <strong className="text-[#3B2010]">
                                {rooms.find(r => r.id === deleteId)?.name}
                            </strong>?
                            <br />Questa azione non può essere annullata.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 text-sm text-[#6B4828] border border-[#C4A070] py-2.5 rounded-xl hover:bg-[#FAF5EE] transition-colors"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 text-sm text-white bg-red-600 py-2.5 rounded-xl hover:bg-red-700 transition-colors font-medium"
                            >
                                Elimina
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
