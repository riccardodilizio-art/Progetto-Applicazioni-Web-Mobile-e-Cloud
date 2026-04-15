import { useState } from 'react'
import StatusBadge from '../../reservations/StatusBadge'
import { formatDate } from '../../../lib/dateUtils'
import type { DinnerReservationAdmin } from '../../../types/Reservation'

interface Props {
    reservations: DinnerReservationAdmin[]
    onDelete: (id: string) => void
}

export default function DinnerReservationTable({ reservations, onDelete }: Props) {
    const [expanded, setExpanded] = useState<Set<string>>(new Set())

    function toggle(id: string) {
        setExpanded((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    if (reservations.length === 0) {
        return (
            <div className="text-center py-16 text-[#9A6840]">
                Nessuna prenotazione cena corrisponde ai filtri.
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-[#E8C9A0]/50 overflow-hidden">
            <div className="divide-y divide-[#E8C9A0]/30">
                {reservations.map((r) => {
                    const isOpen = expanded.has(r.id)
                    return (
                        <div key={r.id}>
                            <div className="px-4 sm:px-6 py-4 hover:bg-[#FAF5EE]/50 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-3">
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-[#9A6840] mb-0.5">
                                                Codice
                                            </p>
                                            <p className="text-sm font-medium text-[#3B2010]">{r.dinnerCode}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-[#9A6840] mb-0.5">
                                                Camera
                                            </p>
                                            <p className="text-sm text-[#3B2010]">
                                                {r.roomNumber ?? <span className="text-[#9A6840]">—</span>}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-[#9A6840] mb-0.5">
                                                Data
                                            </p>
                                            <p className="text-sm text-[#3B2010]">{formatDate(r.date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-[#9A6840] mb-0.5">
                                                Coperti
                                            </p>
                                            <p className="text-sm text-[#3B2010]">{r.totalCovers}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-[#9A6840] mb-0.5">
                                                Stato
                                            </p>
                                            <StatusBadge status={r.status} />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => toggle(r.id)}
                                            aria-expanded={isOpen}
                                            className="text-xs text-[#6B4828] border border-[#C4A070] px-3 py-1.5 rounded-lg hover:bg-[#FAF5EE] transition-colors cursor-pointer"
                                        >
                                            {isOpen ? 'Nascondi ordini' : 'Mostra ordini'}
                                        </button>
                                        <button
                                            onClick={() => onDelete(r.id)}
                                            className="text-xs text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                        >
                                            Elimina
                                        </button>
                                    </div>
                                </div>
                                {r.userEmail && (
                                    <p className="text-xs text-[#9A6840] mt-2">Ospite: {r.userEmail}</p>
                                )}
                            </div>

                            {isOpen && (
                                <div className="px-4 sm:px-6 pb-5 bg-[#FAF5EE]/40">
                                    {r.orders.length === 0 ? (
                                        <p className="text-sm text-[#9A6840] italic">Nessun ordine registrato.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {r.orders.map((o) => (
                                                <div
                                                    key={o.coverNumber}
                                                    className="border border-[#E8C9A0] rounded-lg p-3 bg-white"
                                                >
                                                    <p className="text-xs uppercase tracking-widest text-[#9A6840] mb-2">
                                                        Coperto {o.coverNumber}
                                                    </p>
                                                    <p className="text-sm text-[#3B2010]">
                                                        <span className="text-[#9A6840]">Primo:</span> {o.primo}
                                                    </p>
                                                    <p className="text-sm text-[#3B2010]">
                                                        <span className="text-[#9A6840]">Secondo:</span>{' '}
                                                        {o.secondo}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
