import { useMemo, useState } from 'react'
import type { RoomReservation } from '../../types/Reservation'
import StatusBadge from './StatusBadge'
import { formatDate } from '../../lib/dateUtils'
import { typeLabels } from '../../data/roomUtils'
import type { RoomType } from '../../types/Room'

export default function RoomCard({ r, onCancel }: { r: RoomReservation; onCancel: () => void }) {
    const [confirming, setConfirming] = useState(false)
    const today = useMemo(() => new Date().toISOString().split('T')[0], [])
    const isCancellable = r.status !== 'annullata' && r.checkIn > today

    return (
        <div className="bg-white rounded-2xl border border-[#E8C9A0] shadow-sm overflow-hidden">
            <div className="bg-[#FAF0E6] border-b border-[#E8C9A0] px-5 py-4 flex items-center justify-between gap-3">
                <div>
                    <p className="...">
                        {typeLabels[r.roomType as RoomType]}
                    </p>
                    <h3 className="font-heading text-lg text-[#3B2010] font-medium leading-snug">{r.roomName}</h3>
                </div>
                <StatusBadge status={r.status} />
            </div>
            <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-[#9A6840] mb-1">Check-in</p>
                        <p className="text-sm text-[#3B2010] font-medium">{formatDate(r.checkIn)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-[#9A6840] mb-1">Check-out</p>
                        <p className="text-sm text-[#3B2010] font-medium">{formatDate(r.checkOut)}</p>
                    </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#E8C9A0]">
                    <p className="text-xs text-[#9A6840]">
                        {r.nights} notti · €{r.pricePerNight}/notte
                    </p>
                    <p className="text-base font-semibold text-[#3B2010]">€{r.totalPrice.toLocaleString('it-IT')}</p>
                </div>
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
