import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import useSignIn from 'react-auth-kit/hooks/useSignIn'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import type { UserState } from '../../types/User'

export default function Login() {
    const isAuthenticated = useIsAuthenticated()
    const signIn = useSignIn<UserState>()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    if (isAuthenticated) {
        return <Navigate to="/admin/dashboard" replace />
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // --- MOCK: sostituire con chiamata API al backend ---
        if (email === 'admin@hotelexcelsior.it' && password === 'admin123') {
            const success = signIn({
                auth: {
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBob3RlbGV4Y2Vsc2lvci5pdCIsInJvbGUiOiJhZG1pbiIsImV4cCI6OTk5OTk5OTk5OX0.dGVzdC1zaWduYXR1cmU',
                    type: 'Bearer',
                },
                userState: {
                    email: email,
                    role: 'admin' as const,
                },
            })

            if (success) {
                navigate('/admin/dashboard')
            } else {
                setError('Errore durante il login')
            }
        } else {
            setError('Credenziali non valide')
        }
        // --- FINE MOCK ---
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 bg-[#FAF5EE]">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <h1
                    className="text-3xl text-center text-[#3B2010] font-light mb-8 font-heading"
                >
                    Area Riservata
                </h1>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="admin@hotelexcelsior.it"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B2010] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B2010] focus:border-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#3B2010] text-white font-medium py-3 rounded-lg hover:bg-[#2a1709] transition text-sm tracking-wide uppercase"
                    >
                        Accedi
                    </button>
                </form>
            </div>
        </div>
    )
}
