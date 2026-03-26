import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { apiFetch } from '../../lib/apiClient.ts'

export default function ResetPassword() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token') ?? ''
    const navigate = useNavigate()

    const [next, setNext] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Token mancante o malformato
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF5EE] px-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center space-y-4">
                    <p className="text-red-700 font-medium">Link non valido o scaduto.</p>
                    <Link to="/password-dimenticata" className="text-sm text-[#9A6840] hover:underline">
                        Richiedi un nuovo link
                    </Link>
                </div>
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (next.length < 8) {
            setError('La password deve essere di almeno 8 caratteri.')
            return
        }
        if (next !== confirm) {
            setError('Le password non coincidono.')
            return
        }

        setLoading(true)
        try {
            await apiFetch('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ token, password: next }),
            })
            navigate('/accedi')
        } catch {
            setError('Link scaduto o non valido. Richiedine uno nuovo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF5EE] px-4 py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h1 className="font-heading text-3xl font-semibold text-[#3B2010] text-center mb-2">Nuova password</h1>
                <p className="text-[#9A6840] text-center mb-8 text-sm">Minimo 8 caratteri.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#3B2010] mb-1">Nuova password</label>
                        <input
                            type="password"
                            required
                            value={next}
                            onChange={(e) => setNext(e.target.value)}
                            className="w-full border border-[#C4A070] rounded-lg px-4 py-2
                                text-[#3B2010] focus:outline-none focus:ring-2 focus:ring-[#9A6840]
                                focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#3B2010] mb-1">Conferma password</label>
                        <input
                            type="password"
                            required
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="w-full border border-[#C4A070] rounded-lg px-4 py-2
                                text-[#3B2010] focus:outline-none focus:ring-2 focus:ring-[#9A6840]
                                focus:border-transparent"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#3B2010] text-white font-medium py-2.5 rounded-lg
                            hover:bg-[#6B4828] transition-colors cursor-pointer
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Salvataggio…' : 'Imposta nuova password'}
                    </button>
                </form>
            </div>
        </div>
    )
}
