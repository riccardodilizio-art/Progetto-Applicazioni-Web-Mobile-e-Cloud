import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import { useBooking } from '../hooks/useBooking'
import { typeLabels } from '../data/roomUtils'
import { formatDate } from '../lib/dateUtils'
import { apiFetch } from '../lib/apiClient'
import type { UserState } from '../types/User'

export default function Cart() {
    const { cart, removeFromCart, clearCart } = useBooking()
    const user = useAuthUser<UserState>()
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const grandTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0)

    async function handleCheckout() {
        if (!user) return
        setIsSubmitting(true)
        setError('')

        try {
            const created: { idPayment: string | null }[] = []
            for (const item of cart) {
                const res = await apiFetch<{ idPayment: string | null }>('/reservations', {
                    method: 'POST',
                    body: JSON.stringify({
                        idRoom: item.room.id,
                        checkIn: item.checkIn,
                        checkOut: item.checkOut,
                        prezzoPerNotte: item.room.pricePerNight,
                    }),
                })
                created.push(res)
            }
            clearCart()

            // Se c'è una sola prenotazione vado dritto al pagamento;
            // con più di una, rimando all'elenco dove pagherà una alla volta.
            const firstPaymentId = created[0]?.idPayment
            if (created.length === 1 && firstPaymentId) {
                navigate(`/pagamento/${firstPaymentId}`)
            } else {
                navigate('/prenotazioni')
            }
        } catch {
            setError('Errore durante la prenotazione. Riprova.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#FAF0E6] flex flex-col items-center justify-center px-4 text-center">
                <svg className="w-16 h-16 text-[#C4A070] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                    />
                </svg>
                <h1 className="text-2xl font-bold text-[#6B4828] mb-2">Il tuo carrello è vuoto</h1>
                <p className="text-gray-500 mb-6">Non hai ancora aggiunto nessuna camera.</p>
                <Link
                    to="/camere"
                    className="bg-[#6B4828] text-white font-medium px-6 py-3 rounded-lg hover:bg-[#3B2010] transition"
                >
                    Scopri le camere
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FAF0E6]">
            <div className="max-w-4xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-[#6B4828] mb-8 font-heading">Il tuo carrello</h1>

                <div className="flex flex-col gap-4 mb-8">
                    {cart.map((item) => (
                        <div
                            key={item.room.id}
                            className="bg-white rounded-xl shadow-sm border border-[#E8C9A0]/50 flex flex-col sm:flex-row overflow-hidden"
                        >
                            <img
                                src={item.room.images[0]}
                                alt={item.room.name}
                                className="w-full sm:w-48 h-40 sm:h-auto object-cover"
                            />
                            <div className="flex-1 p-5 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-lg font-bold text-[#6B4828]">{item.room.name}</h2>
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E8C9A0] text-[#6B4828]">
                                            {typeLabels[item.room.type]}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(item.checkIn)} → {formatDate(item.checkOut)} · {item.guests}{' '}
                                        {item.guests === 1 ? 'ospite' : 'ospiti'}
                                    </p>
                                    <p className="text-sm text-[#6B4828] mt-1">
                                        {item.nights} {item.nights === 1 ? 'notte' : 'notti'} × €
                                        {item.room.pricePerNight}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-xl font-bold text-[#3B2010]">€{item.totalPrice}</p>
                                    <button
                                        onClick={() => removeFromCart(item.room.id)}
                                        className="text-sm text-red-500 hover:text-red-700 font-medium cursor-pointer transition"
                                    >
                                        Rimuovi
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-[#E8C9A0]/50 p-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                            {error}
                        </div>
                    )}
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-lg text-[#6B4828]">
                            Totale ({cart.length} {cart.length === 1 ? 'camera' : 'camere'})
                        </span>
                        <span className="text-2xl font-bold text-[#3B2010]">€{grandTotal}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={isSubmitting}
                        className={`w-full py-3 rounded-lg font-semibold text-white transition
                            ${isSubmitting ? 'bg-[#6B4828]/70 cursor-not-allowed' : 'bg-[#6B4828] hover:bg-[#3B2010] cursor-pointer'}`}
                    >
                        {isSubmitting ? 'Prenotazione in corso...' : 'Conferma prenotazione'}
                    </button>
                    <Link to="/camere" className="block text-center text-sm text-[#9A6840] hover:underline mt-3">
                        ← Continua a cercare camere
                    </Link>
                </div>
            </div>
        </div>
    )
}
