import { Navigate, useNavigate, Link } from 'react-router-dom'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import useSignOut from 'react-auth-kit/hooks/useSignOut'
import type { UserState } from '../../types/User'

export default function Profile() {
    const user = useAuthUser<UserState>()
    const isAuthenticated = useIsAuthenticated()
    const signOut = useSignOut()
    const navigate = useNavigate()

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />
    }

    const handleLogout = () => {
        signOut()
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-[#FAF5EE] px-4 py-12">
            <div className="max-w-2xl mx-auto">
                <h1 className="font-heading text-3xl font-semibold text-[#3B2010] text-center mb-8">Il mio Profilo</h1>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {/* Avatar + nome */}
                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#E8C9A0]">
                        <div className="w-16 h-16 rounded-full bg-[#3B2010] flex items-center justify-center text-white text-2xl font-heading">
                            {(user.name ?? '').charAt(0).toUpperCase()}
                            {(user.surname ?? '').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-xl font-semibold text-[#3B2010]">
                                {user.name} {user.surname}
                            </p>
                            <p className="text-sm text-[#9A6840]">{user.email}</p>
                        </div>
                    </div>

                    {/* Dati in sola lettura */}
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#3B2010] mb-1">Nome</label>
                                <p className="w-full bg-[#FAF5EE] rounded-lg px-4 py-2 text-[#3B2010]">{user.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#3B2010] mb-1">Cognome</label>
                                <p className="w-full bg-[#FAF5EE] rounded-lg px-4 py-2 text-[#3B2010]">
                                    {user.surname}
                                </p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#3B2010] mb-1">Email</label>
                            <p className="w-full bg-[#FAF5EE] rounded-lg px-4 py-2 text-[#9A6840]">{user.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#3B2010] mb-1">Telefono</label>
                            <p className="w-full bg-[#FAF5EE] rounded-lg px-4 py-2 text-[#3B2010]">{user.phone}</p>
                        </div>
                    </div>

                    {/* Bottone modifica */}
                    <div className="pt-6">
                        <Link
                            to="/profile/edit"
                            className="block text-center w-full bg-[#3B2010] text-white font-medium py-2.5 rounded-lg hover:bg-[#6B4828] transition-colors"
                        >
                            Modifica profilo
                        </Link>
                    </div>

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
