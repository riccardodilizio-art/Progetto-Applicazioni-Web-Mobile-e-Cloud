import StatusBadge from '../../reservations/StatusBadge'
import { formatDate } from '../../../lib/dateUtils'
import type { RoomReservationAdmin, RoomReservationStatus } from '../../../types/Reservation'

interface Props {
    reservations: RoomReservationAdmin[]
    onDelete: (id: string) => void
    onStatusChange: (id: string, newStatus: RoomReservationStatus) => void
}

export default function RoomReservationTable({ reservations, onDelete, onStatusChange }: Props) {
    if (reservations.length === 0) {
        return (
            <div className="text-center py-16 text-[#9A6840]">
                Nessuna prenotazione camera corrisponde ai filtri.
            </div>
        )
    }

    return (
        <>
            {/* Desktop */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-[#E8C9A0]/50 overflow-hidden">
                <table className="w-full">
                    <thead>
                    <tr className="bg-[#FAF5EE] border-b border-[#E8C9A0]/50">
                        <Th>Camera</Th>
                        <Th>Ospite</Th>
                        <Th>Check-in / out</Th>
                        <Th>Notti</Th>
                        <Th>Totale</Th>
                        <Th>Stato</Th>
                        <Th align="right">Azioni</Th>
                    </tr>
                    </thead>
                    <tbody>
                    {reservations.map((r) => (
                        <tr
                            key={r.id}
                            className="border-b border-[#E8C9A0]/30 hover:bg-[#FAF5EE]/50 transition-colors"
                        >
                            <td className="px-6 py-4">
                                <p className="font-medium text-[#3B2010]">{r.roomName}</p>
                                <p className="text-xs text-[#9A6840]">
                                    #{r.roomNumber} · Cod. cena {r.dinnerCode}
                                </p>
                            </td>
                            <td className="px-6 py-4">
                                <p className="text-sm text-[#3B2010]">
                                    {r.userName} {r.userSurname}
                                </p>
                                <p className="text-xs text-[#9A6840]">{r.userEmail}</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#6B4828]">
                                <p>{formatDate(r.checkIn)}</p>
                                <p className="text-xs text-[#9A6840]">→ {formatDate(r.checkOut)}</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#6B4828]">{r.nights}</td>
                            <td className="px-6 py-4">
                                    <span className="text-sm font-semibold text-[#3B2010]">
                                        €{r.totalPrice.toFixed(2)}
                                    </span>
                            </td>
                            <td className="px-6 py-4">
                                <StatusBadge status={r.status} />
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2 justify-end flex-wrap">
                                    {r.status !== 'confermata' && (
                                        <button
                                            onClick={() => onStatusChange(r.id, 'confermata')}
                                            className="text-xs text-green-700 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors cursor-pointer"
                                        >
                                            Conferma
                                        </button>
                                    )}
                                    {r.status !== 'annullata' && (
                                        <button
                                            onClick={() => onStatusChange(r.id, 'annullata')}
                                            className="text-xs text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                                        >
                                            Annulla
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onDelete(r.id)}
                                        className="text-xs text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                    >
                                        Elimina
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden space-y-4">
                {reservations.map((r) => (
                    <div key={r.id} className="bg-white rounded-xl shadow-sm border border-[#E8C9A0]/50 p-4">
                        <div className="flex justify-between items-start gap-3 mb-3">
                            <div>
                                <p className="font-medium text-[#3B2010]">{r.roomName}</p>
                                <p className="text-xs text-[#9A6840]">
                                    #{r.roomNumber} · Cod. {r.dinnerCode}
                                </p>
                            </div>
                            <StatusBadge status={r.status} />
                        </div>
                        <div className="space-y-1 text-sm text-[#6B4828] mb-3">
                            <p>
                                <span className="text-[#9A6840]">Ospite: </span>
                                {r.userName} {r.userSurname}
                            </p>
                            <p className="text-xs text-[#9A6840]">{r.userEmail}</p>
                            <p className="text-xs">
                                {formatDate(r.checkIn)} → {formatDate(r.checkOut)} ({r.nights}{' '}
                                {r.nights === 1 ? 'notte' : 'notti'})
                            </p>
                            <p className="text-sm font-semibold text-[#3B2010]">
                                Totale €{r.totalPrice.toFixed(2)}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            {r.status !== 'confermata' && (
                                <button
                                    onClick={() => onStatusChange(r.id, 'confermata')}
                                    className="w-full text-sm text-green-700 border border-green-200 py-2 rounded-lg hover:bg-green-50 transition-colors cursor-pointer"
                                >
                                    Conferma
                                </button>
                            )}
                            {r.status !== 'annullata' && (
                                <button
                                    onClick={() => onStatusChange(r.id, 'annullata')}
                                    className="w-full text-sm text-amber-700 border border-amber-200 py-2 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                                >
                                    Annulla
                                </button>
                            )}
                            <button
                                onClick={() => onDelete(r.id)}
                                className="w-full text-sm text-red-600 border border-red-200 py-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            >
                                Elimina
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
    return (
        <th className={`text-${align} text-xs font-semibold text-[#9A6840] uppercase tracking-wider px-6 py-3`}>
            {children}
        </th>
    )
}
