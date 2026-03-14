import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import useSignIn from 'react-auth-kit/hooks/useSignIn'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import type { UserState } from '../../types/User'

export default function Register() {
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    const signIn = useSignIn<UserState>()
    const isAuthenticated = useIsAuthenticated()
    const navigate = useNavigate()

    if (isAuthenticated) {
        return <Navigate to="/profile" replace />
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password.length < 8) {
            setError('La password deve contenere almeno 8 caratteri')
            return
        }

        if (password !== confirmPassword) {
            setError('Le password non coincidono')
            return
        }

        signIn({
            auth: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbGllbnRAaG90ZWxleGNlbHNpb3IuaXQiLCJyb2xlIjoiY2xpZW50IiwiZXhwIjo5OTk5OTk5OTk5fQ.dGVzdC1zaWduYXR1cmU', type: 'Bearer' },
            userState: {
                email,
                role: 'client',
                name,
                surname,
                phone,
            }
        })
        navigate('/profile')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF5EE] px-4 py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

                <h1 className="font-heading text-3xl font-semibold text-[#3B2010] text-center mb-2">
                    Crea il tuo account
                </h1>
                <p className="text-[#9A6840] text-center mb-8">
                    Unisciti all'Hotel Excelsior
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#3B2010] mb-1">
                                Nome
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Mario"
                                className="w-full border border-[#C4A070] rounded-lg px-4 py-2 text-[#3B2010] placeholder-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#9A6840] focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#3B2010] mb-1">
                                Cognome
                            </label>
                            <input
                                type="text"
                                required
                                value={surname}
                                onChange={e => setSurname(e.target.value)}
                                placeholder="Rossi"
                                className="w-full border border-[#C4A070] rounded-lg px-4 py-2 text-[#3B2010] placeholder-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#9A6840] focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#3B2010] mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="tuaemail@esempio.it"
                            className="w-full border border-[#C4A070] rounded-lg px-4 py-2 text-[#3B2010] placeholder-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#9A6840] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#3B2010] mb-1">
                            Telefono
                        </label>
                        <input
                            type="tel"
                            required
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="333 1234567"
                            className="w-full border border-[#C4A070] rounded-lg px-4 py-2 text-[#3B2010] placeholder-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#9A6840] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#3B2010] mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Minimo 8 caratteri"
                            className="w-full border border-[#C4A070] rounded-lg px-4 py-2 text-[#3B2010] placeholder-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#9A6840] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#3B2010] mb-1">
                            Conferma Password
                        </label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Ripeti la password"
                            className="w-full border border-[#C4A070] rounded-lg px-4 py-2 text-[#3B2010] placeholder-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#9A6840] focus:border-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#3B2010] text-white font-medium py-2.5 rounded-lg hover:bg-[#6B4828] transition-colors cursor-pointer"
                    >
                        Registrati
                    </button>

                </form>

                <p className="text-center text-sm text-[#6B4828] mt-6">
                    Hai già un account?{' '}
                    <Link to="/login" className="text-[#9A6840] font-medium hover:underline">
                        Accedi
                    </Link>
                </p>

            </div>
        </div>
    )
}
