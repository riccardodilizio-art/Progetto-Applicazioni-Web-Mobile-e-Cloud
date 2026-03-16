import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import type { UserState } from '../../types/User'
import useSignIn from 'react-auth-kit/hooks/useSignIn'

export default function Edit() {
    const user = useAuthUser<UserState>()
    const isAuthenticated = useIsAuthenticated()
    const navigate = useNavigate()
    const signIn = useSignIn<UserState>()

    const [name, setName] = useState(user?.name ?? '')
    const [surname, setSurname] = useState(user?.surname ?? '')
    const [phone, setPhone] = useState(user?.phone ?? '')

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: chiamata API per aggiornare il profilo
        // Aggiorna lo stato react-auth-kit così la Navbar legge il nuovo nome
        signIn({
            auth: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbGllbnRAaG90ZWxleGNlbHNpb3IuaXQiLCJyb2xlIjoiY2xpZW50IiwiZXhwIjo5OTk5OTk5OTk5fQ.dGVzdC1zaWduYXR1cmU',
                type: 'Bearer',
            },
            userState: {
                ...user,
                name,
                surname,
                phone,
            },
        })
        navigate('/profile')
    }

    return (
        <div className="min-h-screen bg-[#FAF5EE] px-4 py-12">
            <div className="max-w-2xl mx-auto">
                <h1 className="font-heading text-3xl font-semibold text-[#3B2010] text-center mb-8">
                    Modifica Profilo
                </h1>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <form onSubmit={handleSave} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#3B2010] mb-1">Nome</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border border-[#C4A070] rounded-lg px-4 py-2 text-[#3B2010] focus:outline-none focus:ring-2 focus:ring-[#9A6840] focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#3B2010] mb-1">Cognome</label>
                                <input
                                    type="text"
                                    required
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                    className="w-full border border-[#C4A070] rounded-lg px-4 py-2 text-[#3B2010] focus:outline-none focus:ring-2 focus:ring-[#9A6840] focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#3B2010] mb-1">Email</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full border border-transparent bg-[#FAF5EE] rounded-lg px-4 py-2 text-[#9A6840] cursor-default"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#3B2010] mb-1">Telefono</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full border border-[#C4A070] rounded-lg px-4 py-2 text-[#3B2010] focus:outline-none focus:ring-2 focus:ring-[#9A6840] focus:border-transparent"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-[#3B2010] text-white font-medium py-2.5 rounded-lg hover:bg-[#6B4828] transition-colors cursor-pointer"
                            >
                                Salva modifiche
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                className="flex-1 border border-[#C4A070] text-[#6B4828] font-medium py-2.5 rounded-lg hover:bg-[#FAF5EE] transition-colors cursor-pointer"
                            >
                                Annulla
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
