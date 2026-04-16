import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch } from '../../lib/apiClient'
import { mapApiPayment } from '../../lib/mappers'
import type { ApiPayment, Payment } from '../../types/Payment'
import { formatDate } from '../../lib/dateUtils'

export default function PaymentResult() {
    const { id } = useParams<{ id: string }>()
    const [payment, setPayment] = useState<Payment | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return
        apiFetch<ApiPayment>(`/payments/${id}`)
            .then((p) => setPayment(mapApiPayment(p)))
            .catch(() => setPayment(null))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center">
                <p className="text-[#9A6840]">Caricamento esito...</p>
            </div>
        )
    }

    const success = payment?.status === 'completato'

    return (
        <div className="min-h-screen bg-[#FAF0E6] flex flex-col items-center justify-center px-4 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${success ? 'bg-green-100' : 'bg-red-100'}`}>
                {success ? (
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
            </div>
            <h1 className="text-3xl font-bold text-[#3B2010] mb-3 font-heading">
                {success ? 'Pagamento completato' : 'Pagamento non riuscito'}
            </h1>
            {payment && success && (
                <div className="bg-white rounded-xl border border-[#E8C9A0] p-5 mb-6 max-w-md w-full">
                    <p className="text-sm text-[#9A6840] mb-2">Transazione</p>
                    <p className="text-sm font-mono text-[#3B2010] mb-3">{payment.transactionId}</p>
                    <p className="text-sm text-[#6B4828]">{payment.roomName}</p>
                    <p className="text-xs text-[#9A6840]">
                        {formatDate(payment.checkIn)} → {formatDate(payment.checkOut)}
                    </p>
                    <p className="text-2xl font-bold text-[#3B2010] mt-3">€{payment.amount.toFixed(2)}</p>
                </div>
            )}
            <Link to="/prenotazioni" className="bg-[#6B4828] text-white px-6 py-3 rounded-lg hover:bg-[#3B2010] transition">
                Vai alle mie prenotazioni
            </Link>
        </div>
    )
}
