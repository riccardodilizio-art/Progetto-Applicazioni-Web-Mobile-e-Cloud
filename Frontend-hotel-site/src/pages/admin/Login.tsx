import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import useSignIn from 'react-auth-kit/hooks/useSignIn'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import type { UserState } from '../../types/User'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'

export default function Login() {
    const isAuthenticated = useIsAuthenticated()
    const signIn = useSignIn<UserState>()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const user = useAuthUser<UserState>()

    if (isAuthenticated && user?.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // --- MOCK: sostituire con chiamata API al backend ---
        const mockAdmins = [
            { email: 'admin@hotelexcelsior.it', password: 'admin123', name: 'Admin', surname: 'Hotel' },
        ]

        const admin = mockAdmins.find(u => u.email === email && u.password === password)

        if (admin) {
            const success = signIn({
                auth: { token: 'mock-token-admin', type: 'Bearer' },
                userState: { email: admin.email, role: 'admin' as const, name: admin.name, surname: admin.surname },
            })
            if (success) {
                navigate('/admin/dashboard')
            } else {
                setError('Errore durante il login')
            }
        } else {
            setError('Credenziali non valide')
        }
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 bg-[#FAF5EE]">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl text-center text-[#3B2010] font-light mb-8 font-heading">Area Riservata</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded mb-6 text-center">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@hotelexcelsior.it"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B2010] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
