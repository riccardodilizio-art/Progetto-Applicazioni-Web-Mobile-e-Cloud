import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiFetch } from '../../lib/apiClient'
import { mapApiPayment } from '../../lib/mappers'
import type { ApiPayment, Payment } from '../../types/Payment'
import { formatDate } from '../../lib/dateUtils'

type Metodo = 'CARTA_CREDITO' | 'CARTA_DEBITO' | 'PAYPAL' | 'BONIFICO'

export default function PaymentPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [payment, setPayment] = useState<Payment | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const [metodo, setMetodo] = useState<Metodo>('CARTA_CREDITO')
    const [numeroCarta, setNumeroCarta] = useState('')
    const [titolare, setTitolare] = useState('')
    const [scadenza, setScadenza] = useState('')
    const [cvv, setCvv] = useState('')

    useEffect(() => {
        if (!id) return
        apiFetch<ApiPayment>(`/payments/${id}`)
            .then((p) => setPayment(mapApiPayment(p)))
            .catch(() => setPayment(null))
            .finally(() => setLoading(false))
    }, [id])

    const isCard = metodo === 'CARTA_CREDITO' || metodo === 'CARTA_DEBITO'

    const formattedCard = useMemo(
        () => numeroCarta.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim(),
        [numeroCarta],
    )

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!id || !payment) return
        setSubmitting(true)
        setError('')
        try {
            await apiFetch(`/payments/${id}/confirm`, {
                method: 'POST',
                body: JSON.stringify({
                    metodo,
                    numeroCarta: isCard ? numeroCarta.replace(/\s/g, '') : undefined,
                    titolare: isCard ? titolare : undefined,
                    scadenza: isCard ? scadenza : undefined,
                    cvv: isCard ? cvv : undefined,
                }),
            })
            navigate(`/pagamento/${id}/esito`)
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Errore durante il pagamento'
            setError(msg.includes(':') ? msg.split(':').slice(1).join(':').trim() : msg)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center">
                <p className="text-[#9A6840]">Caricamento pagamento...</p>
            </div>
        )
    }

    if (!payment) {
        return (
            <div className="min-h-screen bg-[#FAF0E6] flex flex-col items-center justify-center px-4 text-center">
                <h1 className="text-3xl font-bold text-[#6B4828] mb-3">Pagamento non trovato</h1>
                <Link to="/prenotazioni" className="text-[#6B4828] underline">← Torna alle prenotazioni</Link>
            </div>
        )
    }

    if (payment.status === 'completato') {
        return (
            <div className="min-h-screen bg-[#FAF0E6] flex flex-col items-center justify-center px-4 text-center">
                <h1 className="text-3xl font-bold text-green-700 mb-2">Pagamento già completato</h1>
                <p className="text-[#6B4828] mb-6">Transazione: {payment.transactionId}</p>
                <Link to="/prenotazioni" className="bg-[#6B4828] text-white px-6 py-3 rounded-lg hover:bg-[#3B2010] transition">
                    Le mie prenotazioni
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FAF0E6]">
            <div className="max-w-2xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-[#6B4828] mb-6 font-heading">Completa il pagamento</h1>

                {/* Riepilogo */}
                <div className="bg-white rounded-xl shadow-sm border border-[#E8C9A0]/50 p-5 mb-6">
                    <p className="text-xs uppercase tracking-wide text-[#9A6840] mb-2">Riepilogo prenotazione</p>
                    <p className="text-lg font-semibold text-[#3B2010]">{payment.roomName}</p>
                    <p className="text-sm text-[#6B4828]">
                        {formatDate(payment.checkIn)} → {formatDate(payment.checkOut)} · {payment.nights}{' '}
                        {payment.nights === 1 ? 'notte' : 'notti'}
                    </p>
                    <p className="text-2xl font-bold text-[#3B2010] mt-3">€{payment.amount.toFixed(2)}</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-[#E8C9A0]/50 p-6 space-y-4">
                    <div>
                        <label className="text-sm text-[#6B4828] font-medium block mb-2">Metodo di pagamento</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { v: 'CARTA_CREDITO', l: 'Carta di credito' },
                                { v: 'CARTA_DEBITO', l: 'Carta di debito' },
                                { v: 'PAYPAL', l: 'PayPal' },
                                { v: 'BONIFICO', l: 'Bonifico' },
                            ].map((o) => (
                                <button
                                    type="button"
                                    key={o.v}
                                    onClick={() => setMetodo(o.v as Metodo)}
                                    className={`text-sm py-2.5 rounded-lg border-2 transition ${
                                        metodo === o.v
                                            ? 'border-[#6B4828] bg-[#FAF5EE] text-[#3B2010] font-semibold'
                                            : 'border-[#E8C9A0] text-[#6B4828] hover:bg-[#FAF5EE]'
                                    }`}
                                >
                                    {o.l}
                                </button>
                            ))}
                        </div>
                    </div>

                    {isCard && (
                        <>
                            <Input label="Numero carta" value={formattedCard} onChange={(v) => setNumeroCarta(v)} placeholder="4242 4242 4242 4242" inputMode="numeric" />
                            <Input label="Titolare" value={titolare} onChange={setTitolare} placeholder="Mario Rossi" />
                            <div className="grid grid-cols-2 gap-3">
                                <Input label="Scadenza (MM/YY)" value={scadenza} onChange={setScadenza} placeholder="12/28" />
                                <Input label="CVV" value={cvv} onChange={(v) => setCvv(v.replace(/\D/g, '').slice(0, 4))} placeholder="123" inputMode="numeric" />
                            </div>
                        </>
                    )}

                    {metodo === 'PAYPAL' && (
                        <p className="text-sm text-[#6B4828] bg-[#FAF5EE] rounded-lg p-3">
                            Verrai reindirizzato a PayPal (simulato).
                        </p>
                    )}
                    {metodo === 'BONIFICO' && (
                        <p className="text-sm text-[#6B4828] bg-[#FAF5EE] rounded-lg p-3">
                            Bonifico bancario simulato — confermando, la prenotazione verrà accettata.
                        </p>
                    )}

                    {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}

                    <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                            submitting ? 'bg-[#6B4828]/70' : 'bg-[#6B4828] hover:bg-[#3B2010] cursor-pointer'
                        }`}
                    >
                        {submitting ? 'Elaborazione...' : `Paga €${payment.amount.toFixed(2)}`}
                    </button>
                </form>
            </div>
        </div>
    )
}

function Input({ label, value, onChange, placeholder, inputMode }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; inputMode?: 'numeric' | 'text'
}) {
    return (
        <div>
            <label className="text-sm text-[#6B4828] font-medium block mb-1">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                inputMode={inputMode}
                className="w-full border border-[#C4A070] rounded-lg px-4 py-2.5 text-sm text-[#3B2010] focus:outline-none focus:ring-2 focus:ring-[#9A6840] bg-white"
            />
        </div>
    )
}
