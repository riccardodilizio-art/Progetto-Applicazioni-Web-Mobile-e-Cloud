import { useState } from 'react'
import type { DinnerReservation } from '../../types/Reservation'
import StatusBadge from './StatusBadge'

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function DinnerCard({ d, onCancel }: { d: DinnerReservation; onCancel: () => void }) {
    const [confirming, setConfirming] = useState(false)
    const today = new Date().toISOString().split('T')[0]
    const isCancellable = d.status !== 'annullata' && d.date > today

    return (
        <div className="bg-white rounded-2xl border border-[#E8C9A0] shadow-sm overflow-hidden">
            <div className="bg-[#3B2010] px-5 py-4 flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs text-[#E8C9A0] mb-0.5">{formatDate(d.date)}</p>
                    <h3 className="font-heading text-lg text-white font-medium">
                        {d.day} · {d.totalCovers} {d.totalCovers === 1 ? 'coperto' : 'coperti'} · ore 19:30
                    </h3>
                </div>
                <StatusBadge status={d.status} />
            </div>
            <div className="p-5 space-y-4">
                {d.orders.map((o) => (
                    <div key={o.coverNumber} className="space-y-2">
                        <p className="text-xs text-[#9A6840] uppercase tracking-widest">Coperto {o.coverNumber}</p>
                        <div className="flex gap-3">
                            <span className="text-xs text-[#9A6840] w-14 flex-shrink-0 pt-0.5">Primo</span>
                            <span className="text-sm text-[#3B2010] leading-snug">{o.primo}</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="text-xs text-[#9A6840] w-14 flex-shrink-0 pt-0.5">Secondo</span>
                            <span className="text-sm text-[#3B2010] leading-snug">{o.secondo}</span>
                        </div>
                    </div>
                ))}
                {isCancellable && (
                    <div className="pt-3 border-t border-[#E8C9A0]">
                        {confirming ? (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-[#9A6840] flex-1">Confermi l'annullamento?</span>
                                <button
                                    onClick={() => {
                                        onCancel()
                                        setConfirming(false)
                                    }}
                                    className="text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                                >
                                    Sì, annulla
                                </button>
                                <button
                                    onClick={() => setConfirming(false)}
                                    className="text-xs px-3 py-1.5 rounded-lg border border-[#C4A070] text-[#6B4828] hover:bg-[#FAF0E6] transition-colors"
                                >
                                    Indietro
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setConfirming(true)}
                                className="text-xs text-red-600 hover:text-red-700 hover:underline transition-colors"
                            >
                                Annulla prenotazione
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
