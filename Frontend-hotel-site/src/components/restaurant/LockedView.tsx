import PageHeader from './PageHeader'
import type { DinnerReservation } from '../../types/Reservation'

interface Props {
    existingDinner: DinnerReservation
    dayName: string
    today: string
    onReset: () => void
}

export default function LockedView({ existingDinner, dayName, today, onReset }: Props) {
    return (
        <div className="min-h-screen bg-[#FAF0E6] px-4 py-16">
            <div className="max-w-2xl mx-auto">
                <PageHeader />
                <div className="bg-white/70 border border-[#C4A070]/40 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-[#9A6840]">Cena di stasera</p>
                            <h2 className="text-xl font-bold text-[#3B2010] capitalize">
                                {dayName} ·{' '}
                                {new Date(today).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}
                            </h2>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase tracking-wider font-medium">
                            Confermata
                        </span>
                    </div>
                    <p className="text-sm text-[#6B4828] mb-5">
                        {existingDinner.totalCovers} {existingDinner.totalCovers === 1 ? 'coperto' : 'coperti'} · ore
                        19:30
                    </p>
                    <div className="space-y-3">
                        {existingDinner.orders.map((o) => (
                            <div key={o.coverNumber} className="border border-[#E8C9A0] rounded-xl p-4">
                                <p className="text-xs uppercase tracking-widest text-[#9A6840] mb-2">
                                    Coperto {o.coverNumber}
                                </p>
                                <p className="text-sm text-[#3B2010] mb-1">🥣 {o.primo}</p>
                                <p className="text-sm text-[#3B2010]">🍖 {o.secondo}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-[#9A6840] mt-5 text-center">
                        La prenotazione è confermata e non può essere modificata.
                    </p>
                    <button
                        onClick={onReset}
                        className="mt-4 w-full py-2.5 border border-[#C4A070]/60 text-[#6B4828] text-sm uppercase tracking-widest rounded-xl hover:bg-[#E8C9A0]/40 transition-colors"
                    >
                        Torna all'inizio
                    </button>
                </div>
            </div>
        </div>
    )
}
