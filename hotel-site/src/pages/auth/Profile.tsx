import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import useSignOut from 'react-auth-kit/hooks/useSignOut'
import type { UserState } from '../../types/User'

export default function Profile() {
    const user = useAuthUser<UserState>()
    const isAuthenticated = useIsAuthenticated()
    const signOut = useSignOut()
    const navigate = useNavigate()

    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(user?.name ?? '')
    const [surname, setSurname] = useState(user?.surname ?? '')
    const [phone, setPhone] = useState(user?.phone ?? '')

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: chiamata API per aggiornare il profilo
        setIsEditing(false)
    }

    const handleLogout = () => {
        signOut()
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-[#FAF5EE] px-4 py-12">
            <div className="max-w-2xl mx-auto">

                <h1 className="font-heading text-3xl font-semibold text-[#3B2010] text-center mb-8">
                    Il mio Profilo
                </h1>

                {/* Card profilo */}
                <div className="bg-white rounded-2xl shadow-lg p-8">

                    {/* Avatar + nome */}
                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#E8C9A0]">
                        <div className="w-16 h-16 rounded-full bg-[#3B2010] flex items-center justify-center text-white text-2xl font-heading">
                            {name.charAt(0).toUpperCase()}{surname.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-xl font-semibold text-[#3B2010]">
                                {name} {surname}
                            </p>
                            <p className="text-sm text-[#9A6840]">{user.email}</p>
                        </div>
                    </div>

                    {/* Form dati */}
                    <form onSubmit={handleSave} className="space-y-5">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#3B2010] mb-1">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    disabled={!isEditing}
                                    className={`w-full border rounded-lg px-4 py-2 text-[#3B2010]
                                        ${isEditing
                                        ? 'border-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#9A6840] focus:border-transparent'
                                        : 'border-transparent bg-[#FAF5EE] cursor-default'
                                    }`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#3B2010] mb-1">
                                    Cognome
                                </label>
                                <input
                                    type="text"
                                    value={surname}
                                    onChange={e => setSurname(e.target.value)}
                                    disabled={!isEditing}
                                    className={`w-full border rounded-lg px-4 py-2 text-[#3B2010]
                                        ${isEditing
                                        ? 'border-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#9A6840] focus:border-transparent'
                                        : 'border-transparent bg-[#FAF5EE] cursor-default'
                                    }`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#3B2010] mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full border border-transparent bg-[#FAF5EE] rounded-lg px-4 py-2 text-[#9A6840] cursor-default"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#3B2010] mb-1">
                                Telefono
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                disabled={!isEditing}
                                className={`w-full border rounded-lg px-4 py-2 text-[#3B2010]
                                    ${isEditing
                                    ? 'border-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#9A6840] focus:border-transparent'
                                    : 'border-transparent bg-[#FAF5EE] cursor-default'
                                }`}
                            />
                        </div>

                        {/* Bottoni */}
                        <div className="flex gap-3 pt-4">
                            {isEditing ? (
                                <>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-[#3B2010] text-white font-medium py-2.5 rounded-lg hover:bg-[#6B4828] transition-colors cursor-pointer"
                                    >
                                        Salva modifiche
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setName(user.name ?? '')
                                            setSurname(user.surname ?? '')
                                            setPhone(user.phone ?? '')
                                            setIsEditing(false)
                                        }}
                                        className="flex-1 border border-[#C4A070] text-[#6B4828] font-medium py-2.5 rounded-lg hover:bg-[#FAF5EE] transition-colors cursor-pointer"
                                    >
                                        Annulla
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="flex-1 bg-[#3B2010] text-white font-medium py-2.5 rounded-lg hover:bg-[#6B4828] transition-colors cursor-pointer"
                                >
                                    Modifica profilo
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Logout */}
                    <div className="mt-6 pt-6 border-t border-[#E8C9A0]">
                        <button
                            onClick={handleLogout}
                            className="w-full text-red-600 font-medium py-2.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                            Esci dall'account
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}
