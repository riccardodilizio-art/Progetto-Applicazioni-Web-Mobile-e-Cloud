import type { DinnerOrder } from '../../types/Reservation'

interface Props {
    roomName: string
    covers: number
    orders: DinnerOrder[]
    onReset: () => void
}

export default function SuccessView({ roomName, covers, orders, onReset }: Props) {
    return (
        <div className="min-h-screen bg-[#FAF0E6] flex flex-col items-center justify-center px-4 py-16">
            <div className="text-center max-w-md w-full">
                <p className="text-5xl mb-4">🍽️</p>
                <h2 className="text-2xl font-bold text-[#3B2010] mb-2">Cena prenotata!</h2>
                <p className="text-[#6B4828] text-sm mb-1">{roomName}</p>
                <p className="text-[#9A6840] text-sm mb-6">
                    {covers} {covers === 1 ? 'coperto' : 'coperti'} · ore 19:30
                </p>
                <div className="bg-white/70 border border-[#C4A070]/40 rounded-xl p-5 text-left mb-5 space-y-4">
                    {orders.map((o) => (
                        <div key={o.coverNumber} className="border-b border-[#E8C9A0] last:border-0 pb-3 last:pb-0">
                            <p className="text-xs uppercase tracking-widest text-[#9A6840] mb-1">
                                Coperto {o.coverNumber}
                            </p>
                            <p className="text-sm text-[#3B2010] mb-0.5">🥣 {o.primo}</p>
                            <p className="text-sm text-[#3B2010]">🍖 {o.secondo}</p>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-[#9A6840] mb-6">
                    Puoi modificare la tua prenotazione fino alle 18:00 reinserendo il codice.
                </p>
                <button
                    onClick={onReset}
                    className="px-6 py-2.5 bg-[#3B2010] text-[#FAF0E6] text-sm uppercase tracking-widest rounded-lg hover:bg-[#6B4828] transition-colors"
                >
                    Torna all'inizio
                </button>
            </div>
        </div>
    )
}
