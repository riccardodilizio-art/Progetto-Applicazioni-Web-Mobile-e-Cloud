import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            // TODO: POST /auth/forgot-password  { email }
            setSent(true)
        } catch {
            // TODO: gestire errore (es. email non trovata)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF5EE] px-4 py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h1 className="font-heading text-3xl font-semibold text-[#3B2010] text-center mb-2">
                    Password dimenticata
                </h1>
                <p className="text-[#9A6840] text-center mb-8 text-sm">
                    Inserisci la tua email: ti invieremo un link per reimpostare la password.
                </p>

                {sent ? (
                    <div className="text-center space-y-4">
                        <div className="mx-auto w-14 h-14 rounded-full bg-[#F5ECD7] flex items-center justify-center">
                            {/* icona email */}
                            <svg
                                className="w-7 h-7 text-[#9A6840]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <p className="text-sm text-[#3B2010] font-medium">Email inviata!</p>
                        <p className="text-xs text-[#9A6840]">
                            Controlla la tua casella di posta. Il link scade tra 30 minuti.
                        </p>
                        <Link
                            to="/login"
                            className="block text-sm text-[#9A6840] hover:text-[#3B2010] hover:underline transition-colors"
                        >
                            ← Torna al login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#3B2010] mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tuaemail@esempio.it"
                                className="w-full border border-[#C4A070] rounded-lg px-4 py-2
                                    text-[#3B2010] placeholder-[#C4A070] focus:outline-none
                                    focus:ring-2 focus:ring-[#9A6840] focus:border-transparent"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#3B2010] text-white font-medium py-2.5 rounded-lg
                                hover:bg-[#6B4828] transition-colors cursor-pointer
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Invio…' : 'Invia link di reset'}
                        </button>

                        <p className="text-center text-sm text-[#6B4828]">
                            <Link to="/login" className="text-[#9A6840] hover:underline">
                                ← Torna al login
                            </Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    )
}
