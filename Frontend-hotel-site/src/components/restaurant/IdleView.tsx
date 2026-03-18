import { Link } from 'react-router-dom'
import type { RLStatus } from '../../lib/dinnerUtils'
import PageHeader from './PageHeader'

interface Props {
    code: string
    roomNumber: string
    rlStatus: RLStatus
    onCodeChange: (v: string) => void
    onRoomChange: (v: string) => void
    onSubmit: (e: React.FormEvent) => void
}

export default function IdleView({ code, roomNumber, rlStatus, onCodeChange, onRoomChange, onSubmit }: Props) {
    return (
        <div className="min-h-screen bg-[#FAF0E6] flex flex-col items-center justify-center px-4 py-16">
            <PageHeader />
            <form
                onSubmit={onSubmit}
                className="bg-white/70 border border-[#C4A070]/40 rounded-2xl p-8 w-full max-w-sm shadow-sm"
            >
                <label className="block text-xs uppercase tracking-widest text-[#9A6840] mb-2">Codice cena</label>
                <input
                    type="text"
                    maxLength={5}
                    value={code}
                    onChange={(e) => onCodeChange(e.target.value.replace(/\D/g, ''))}
                    placeholder="_ _ _ _ _"
                    className="w-full text-center text-3xl tracking-[0.5em] font-mono border border-[#C4A070]/60 rounded-lg px-4 py-4 bg-[#FAF0E6] text-[#3B2010] focus:outline-none focus:border-[#9A6840] transition-colors"
                />
                <label className="block text-xs uppercase tracking-widest text-[#9A6840] mt-5 mb-2">
                    Numero di camera
                </label>
                <input
                    type="text"
                    maxLength={10}
                    value={roomNumber}
                    onChange={(e) => onRoomChange(e.target.value)}
                    placeholder="es. 204"
                    className="w-full text-center text-xl border border-[#C4A070]/60 rounded-lg px-4 py-3 bg-[#FAF0E6] text-[#3B2010] focus:outline-none focus:border-[#9A6840] transition-colors"
                />
                {rlStatus.remainingAttempts < 5 && !rlStatus.blocked && (
                    <p className="mt-3 text-xs text-amber-700 text-center">
                        Tentativi rimasti: <strong>{rlStatus.remainingAttempts}</strong> su 5
                    </p>
                )}
                {rlStatus.blocked && (
                    <p className="mt-3 text-xs text-red-600 text-center">
                        Accesso bloccato. Riprova alle{' '}
                        <strong>
                            {rlStatus.unblockAt?.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                        </strong>
                    </p>
                )}
                <button
                    type="submit"
                    disabled={code.length !== 5 || roomNumber.trim() === '' || rlStatus.blocked}
                    className="mt-5 w-full py-3 bg-[#3B2010] text-[#FAF0E6] text-sm uppercase tracking-widest rounded-lg hover:bg-[#6B4828] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Continua
                </button>
                <p className="text-center mt-4 text-xs text-[#9A6840]">
                    Vuoi consultare il menu?{' '}
                    <Link to="/menu" className="underline hover:text-[#3B2010]">
                        Sfoglia il menu settimanale
                    </Link>
                </p>
            </form>
        </div>
    )
}
