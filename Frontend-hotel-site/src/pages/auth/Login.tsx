import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import useSignIn from 'react-auth-kit/hooks/useSignIn'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import type { UserState } from '../../types/User'
import { useBooking } from '../../hooks/useBooking'
import { apiFetch } from '../../lib/apiClient'

type AuthResponse = {
    idUser: string
    nome: string
    cognome: string
    email: string
    ruolo: string
    token: string
}

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const signIn = useSignIn<UserState>()
    const isAuthenticated = useIsAuthenticated()
    const navigate = useNavigate()
    const { pendingRoom, addToCart, clearPendingRoom } = useBooking()

    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const res = await apiFetch<AuthResponse>('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                skipAuthRedirect: true,
            })

            const success = signIn({
                auth: {
                    token: res.token,
                    type: 'Bearer',
                },
                userState: {
                    id: res.idUser,
                    email: res.email,
                    role: res.ruolo.toLowerCase() as 'client' | 'admin',
                    name: res.nome,
                    surname: res.cognome,
                },
            })

            if (success) {
                if (pendingRoom) {
                    addToCart(pendingRoom)
                    clearPendingRoom()
                    navigate('/carrello')
                } else {
                    navigate('/profilo')
                }
            } else {
                setError('Errore durante il login')
            }
        } catch {
            setError('Email o password non validi')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF5EE] px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h1 className="font-heading text-3xl font-semibold text-[#3B2010] text-center mb-2">
                    Accedi al tuo account
                </h1>
                <p className="text-[#9A6840] text-center mb-8">Bentornato all'Hotel Excelsior</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-[#3B2010] mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tuaemail@esempio.it"
                            className="w-full border border-[#C4A070] rounded-lg px-4 py-2 text-[#3B2010] placeholder-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#9A6840] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#3B2010] mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="La tua password"
                            className="w-full border border-[#C4A070] rounded-lg px-4 py-2 text-[#3B2010] placeholder-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#9A6840] focus:border-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-[#3B2010] text-white font-medium py-2.5 rounded-lg transition-colors
    ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#6B4828] cursor-pointer'}`}
                    >
                        {isLoading ? 'Accesso in corso...' : 'Accedi'}
                    </button>
                </form>

                <p className="text-center text-sm text-[#6B4828] mt-6">
                    Non hai un account?{' '}
                    <Link to="/registrazione" className="text-[#9A6840] font-medium hover:underline">
                        Registrati
                    </Link>
                </p>

                <div className="flex items-center my-5">
                    <div className="flex-1 h-px bg-[#C4A070]" />
                    <span className="px-3 text-xs text-[#9A6840]">oppure</span>
                    <div className="flex-1 h-px bg-[#C4A070]" />
                </div>

                <Link to="/admin/accedi" className="block text-center text-sm text-[#9A6840] hover:underline">
                    Accedi come amministratore
                </Link>
            </div>
        </div>
    )
}
