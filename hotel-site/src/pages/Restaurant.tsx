import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { mockRoomReservations, mockDinnerReservations } from '../data/Reservations'
import type { DinnerOrder, DinnerReservation, RoomReservation } from '../types/Reservation'
import type { DayMenu, Dish } from '../types/Menu'
import {
    findReservationByCode,
    findDinnerByDate,
    getMenuForDate,
    isBeforeCutoff,
    isTodayInStay,
    getRLStatus,
    recordFailedAttempt,
    recordSuccess,
    type RLStatus,
} from '../lib/dinnerUtils'

// ── Stili badge per categoria piatto ────────────────────────────
const CATEGORY_STYLE: Record<string, string> = {
    pesce: 'bg-blue-100 text-blue-700',
    carne: 'bg-red-100 text-red-700',
    vegetariano: 'bg-green-100 text-green-700',
}

// ── Tipi interni ─────────────────────────────────────────────────
type PageState = 'idle' | 'booking' | 'locked' | 'error' | 'success'

// ── Header comune a tutte le pagine ─────────────────────────────
function PageHeader() {
    return (
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[#3B2010] mb-3">Ristorante</h1>
            <p className="text-[#6B4828] max-w-md mx-auto text-sm leading-relaxed">
                Prenota la tua cena inserendo il codice a 5 cifre ricevuto al check-in. Il termine per la prenotazione è
                le <strong>18:00</strong>.
            </p>
        </div>
    )
}

// ════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPALE
// ════════════════════════════════════════════════════════════════
export default function Restaurant() {
    const [code, setCode] = useState('')
    const [roomNumber, setRoomNumber] = useState('')
    const [pageState, setPageState] = useState<PageState>('idle')
    const [errorMsg, setErrorMsg] = useState('')
    const [rlStatus, setRlStatus] = useState<RLStatus>(() => getRLStatus())

    useEffect(() => {
        if (!rlStatus.blocked) return
        const interval = setInterval(() => {
            const status = getRLStatus()
            setRlStatus(status)
            if (!status.blocked) clearInterval(interval)
        }, 30_000)
        return () => clearInterval(interval)
    }, [rlStatus.blocked])

    const [reservation, setReservation] = useState<RoomReservation | null>(null)
    const [todayMenu, setTodayMenu] = useState<DayMenu | null>(null)
    const [existingDinner, setExistingDinner] = useState<DinnerReservation | null>(null)
    const [covers, setCovers] = useState(1)
    const [orders, setOrders] = useState<DinnerOrder[]>([])
    const [validationError, setValidationError] = useState('')

    const today = new Date().toISOString().split('T')[0]

    // ── Validazione codice ───────────────────────────────────────
    function handleSubmitCode(e: React.FormEvent) {
        e.preventDefault()

        const currentRL = getRLStatus()
        if (currentRL.blocked) {
            setRlStatus(currentRL)
            setErrorMsg(
                `Accesso bloccato per troppi tentativi. Riprova alle ${currentRL.unblockAt?.toLocaleTimeString(
                    'it-IT',
                    {
                        hour: '2-digit',
                        minute: '2-digit',
                    },
                )}.`,
            )
            setPageState('error')
            return
        }

        const found = findReservationByCode(code.trim(), roomNumber.trim(), mockRoomReservations)
        if (!found) {
            const newRL = recordFailedAttempt()
            setRlStatus(newRL)
            if (newRL.blocked) {
                setErrorMsg('Troppi tentativi falliti. Riprova tra 15 minuti.')
            } else {
                setErrorMsg(`Codice o numero di camera non validi. Tentativi rimasti: ${newRL.remainingAttempts}.`)
            }
            setPageState('error')
            return
        }

        recordSuccess()
        setRlStatus({ blocked: false, remainingAttempts: 5, unblockAt: null })
        setReservation(found)

        if (!isTodayInStay(found.checkIn, found.checkOut)) {
            setErrorMsg(
                'Il tuo soggiorno non è attivo oggi. La prenotazione cena è disponibile solo durante il soggiorno.',
            )
            setPageState('error')
            return
        }

        const menu = getMenuForDate(today)
        setTodayMenu(menu)

        const existing = findDinnerByDate(today, found.dinnerCode, mockDinnerReservations)
        setExistingDinner(existing ?? null)

        if (existing && existing.status === 'confermata') {
            setPageState('locked')
            return
        }

        if (!existing && !isBeforeCutoff()) {
            setErrorMsg('Il termine per la prenotazione della cena è le 18:00. Riprova domani.')
            setPageState('error')
            return
        }

        const n = existing?.totalCovers ?? 1
        setCovers(n)
        if (existing?.status === 'bozza') {
            setOrders(existing.orders.map((o) => ({ ...o })))
        } else {
            setOrders(
                Array.from({ length: n }, (_, i) => ({
                    coverNumber: i + 1,
                    primo: '',
                    secondo: '',
                })),
            )
        }

        setPageState('booking')
    }

    // ── Gestione coperti ─────────────────────────────────────────
    function handleCoversChange(n: number) {
        setCovers(n)
        setOrders(
            Array.from({ length: n }, (_, i) => ({
                coverNumber: i + 1,
                primo: orders[i]?.primo ?? '',
                secondo: orders[i]?.secondo ?? '',
            })),
        )
    }

    // ── Aggiornamento singolo ordine ─────────────────────────────
    function updateOrder(index: number, field: 'primo' | 'secondo', value: string) {
        setOrders((prev) => prev.map((o, i) => (i === index ? { ...o, [field]: value } : o)))
        setValidationError('')
    }

    // ── Conferma prenotazione ────────────────────────────────────
    async function handleConfirm() {
        if (orders.some((o) => !o.primo || !o.secondo)) {
            setValidationError('Seleziona primo e secondo per ogni coperto.')
            return
        }

        try {
            const response = await fetch('/api/dinner-reservations', {
                method: existingDinner?.status === 'bozza' ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dinnerCode: reservation!.dinnerCode,
                    date: today,
                    day: todayMenu!.day,
                    totalCovers: covers,
                    orders,
                }),
            })

            if (!response.ok) {
                const data = await response.json().catch(() => ({}))
                setErrorMsg(data.message ?? 'Errore durante la prenotazione. Riprova.')
                setPageState('error')
                return
            }

            setPageState('success')
        } catch {
            setErrorMsg('Errore di rete. Controlla la connessione e riprova.')
            setPageState('error')
        }
    }

    // ── Reset completo ───────────────────────────────────────────
    function handleReset() {
        setCode('')
        setRoomNumber('')
        setPageState('idle')
        setErrorMsg('')
        setReservation(null)
        setTodayMenu(null)
        setExistingDinner(null)
        setOrders([])
        setValidationError('')
    }

    // ════════════════════════════════════════════════════════════
    // STATO: inserimento codice
    // ════════════════════════════════════════════════════════════
    if (pageState === 'idle') {
        return (
            <div className="min-h-screen bg-[#FAF0E6] flex flex-col items-center justify-center px-4 py-16">
                <PageHeader />
                <form
                    onSubmit={handleSubmitCode}
                    className="bg-white/70 border border-[#C4A070]/40 rounded-2xl p-8 w-full max-w-sm shadow-sm"
                >
                    <label className="block text-xs uppercase tracking-widest text-[#9A6840] mb-2">Codice cena</label>
                    <input
                        type="text"
                        maxLength={5}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="_ _ _ _ _"
                        className="w-full text-center text-3xl tracking-[0.5em] font-mono border border-[#C4A070]/60
                            rounded-lg px-4 py-4 bg-[#FAF0E6] text-[#3B2010] focus:outline-none
                            focus:border-[#9A6840] transition-colors"
                    />

                    <label className="block text-xs uppercase tracking-widest text-[#9A6840] mt-5 mb-2">
                        Numero di camera
                    </label>
                    <input
                        type="text"
                        maxLength={10}
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        placeholder="es. 204"
                        className="w-full text-center text-xl border border-[#C4A070]/60 rounded-lg px-4 py-3
                            bg-[#FAF0E6] text-[#3B2010] focus:outline-none focus:border-[#9A6840] transition-colors"
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
                                {rlStatus.unblockAt?.toLocaleTimeString('it-IT', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </strong>
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={code.length !== 5 || roomNumber.trim() === '' || rlStatus.blocked}
                        className="mt-5 w-full py-3 bg-[#3B2010] text-[#FAF0E6] text-sm uppercase tracking-widest
                            rounded-lg hover:bg-[#6B4828] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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

    // ════════════════════════════════════════════════════════════
    // STATO: errore
    // ════════════════════════════════════════════════════════════
    if (pageState === 'error') {
        return (
            <div className="min-h-screen bg-[#FAF0E6] flex flex-col items-center justify-center px-4 py-16">
                <PageHeader />
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 w-full max-w-sm text-center shadow-sm">
                    <p className="text-3xl mb-3">⚠️</p>
                    <p className="text-red-700 text-sm leading-relaxed mb-6">{errorMsg}</p>
                    {!rlStatus.blocked && (
                        <button
                            onClick={handleReset}
                            className="px-6 py-2.5 bg-[#3B2010] text-[#FAF0E6] text-sm uppercase tracking-widest
                                rounded-lg hover:bg-[#6B4828] transition-colors"
                        >
                            Riprova
                        </button>
                    )}
                </div>
            </div>
        )
    }

    // ════════════════════════════════════════════════════════════
    // STATO: cena confermata (non modificabile)
    // ════════════════════════════════════════════════════════════
    if (pageState === 'locked' && existingDinner && reservation) {
        return (
            <div className="min-h-screen bg-[#FAF0E6] px-4 py-16">
                <div className="max-w-2xl mx-auto">
                    <PageHeader />
                    <div className="bg-white/70 border border-[#C4A070]/40 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <p className="text-xs uppercase tracking-widest text-[#9A6840]">Cena di stasera</p>
                                <h2 className="text-xl font-bold text-[#3B2010] capitalize">
                                    {existingDinner.day} ·{' '}
                                    {new Date(today).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}
                                </h2>
                            </div>
                            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase tracking-wider font-medium">
                                Confermata
                            </span>
                        </div>

                        <p className="text-sm text-[#6B4828] mb-5">
                            {existingDinner.totalCovers} {existingDinner.totalCovers === 1 ? 'coperto' : 'coperti'} ·
                            ore 19:30 · {reservation.roomName}
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
                            onClick={handleReset}
                            className="mt-4 w-full py-2.5 border border-[#C4A070]/60 text-[#6B4828] text-sm
                                uppercase tracking-widest rounded-xl hover:bg-[#E8C9A0]/40 transition-colors"
                        >
                            Torna all'inizio
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // ════════════════════════════════════════════════════════════
    // STATO: selezione cena (nuova o in modifica)
    // ════════════════════════════════════════════════════════════
    if (pageState === 'booking' && reservation && todayMenu) {
        const isEditing = existingDinner?.status === 'bozza'

        return (
            <div className="min-h-screen bg-[#FAF0E6] px-4 py-16">
                <div className="max-w-2xl mx-auto">
                    <PageHeader />

                    {/* Riepilogo soggiorno */}
                    <div className="bg-white/70 border border-[#C4A070]/40 rounded-xl p-4 mb-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-[#9A6840]">{reservation.roomName}</p>
                            <p className="text-sm font-medium text-[#3B2010] capitalize">
                                {todayMenu.day} ·{' '}
                                {new Date(today).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })} · ore
                                19:30
                            </p>
                        </div>
                        {isEditing && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full uppercase tracking-wider font-medium">
                                In modifica
                            </span>
                        )}
                    </div>

                    {/* Selezione numero coperti */}
                    <div className="mb-6">
                        <p className="text-xs uppercase tracking-widest text-[#9A6840] mb-3">Quanti coperti stasera?</p>
                        <div className="flex gap-2">
                            {Array.from({ length: reservation.roomCapacity }, (_, i) => i + 1).map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => handleCoversChange(n)}
                                    className={`w-11 h-11 rounded-lg text-sm font-semibold border transition-all duration-200
                                        ${
                                            covers === n
                                                ? 'bg-[#3B2010] text-[#FAF0E6] border-[#3B2010]'
                                                : 'bg-white/60 text-[#6B4828] border-[#C4A070]/50 hover:border-[#9A6840]'
                                        }`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Card per ogni coperto */}
                    <div className="space-y-5 mb-6">
                        {orders.map((order, index) => (
                            <CoverCard
                                key={order.coverNumber}
                                coverNumber={order.coverNumber}
                                order={order}
                                menu={todayMenu}
                                onUpdate={(field, value) => updateOrder(index, field, value)}
                            />
                        ))}
                    </div>

                    {validationError && <p className="text-red-600 text-sm mb-4 text-center">{validationError}</p>}

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleConfirm}
                            className="w-full py-3 bg-[#3B2010] text-[#FAF0E6] text-sm uppercase tracking-widest
                                rounded-xl hover:bg-[#6B4828] transition-colors"
                        >
                            {isEditing ? 'Salva modifiche' : 'Conferma prenotazione'}
                        </button>
                        <button
                            onClick={handleReset}
                            className="w-full py-2.5 border border-[#C4A070]/60 text-[#6B4828] text-sm
                                uppercase tracking-widest rounded-xl hover:bg-[#E8C9A0]/40 transition-colors"
                        >
                            Annulla
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // ════════════════════════════════════════════════════════════
    // STATO: prenotazione completata con successo
    // ════════════════════════════════════════════════════════════
    if (pageState === 'success') {
        return (
            <div className="min-h-screen bg-[#FAF0E6] flex flex-col items-center justify-center px-4 py-16">
                <div className="text-center max-w-md w-full">
                    <p className="text-5xl mb-4">🍽️</p>
                    <h2 className="text-2xl font-bold text-[#3B2010] mb-2">Cena prenotata!</h2>
                    <p className="text-[#6B4828] text-sm mb-1">{reservation?.roomName}</p>
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
                        onClick={handleReset}
                        className="px-6 py-2.5 bg-[#3B2010] text-[#FAF0E6] text-sm uppercase tracking-widest
                            rounded-lg hover:bg-[#6B4828] transition-colors"
                    >
                        Torna all'inizio
                    </button>
                </div>
            </div>
        )
    }

    return null
}

// ════════════════════════════════════════════════════════════════
// SOTTO-COMPONENTE: card di un coperto
// ════════════════════════════════════════════════════════════════
function CoverCard({
    coverNumber,
    order,
    menu,
    onUpdate,
}: {
    coverNumber: number
    order: DinnerOrder
    menu: DayMenu
    onUpdate: (field: 'primo' | 'secondo', value: string) => void
}) {
    return (
        <div className="border border-[#C4A070]/50 rounded-xl p-5 bg-white/60">
            <h3 className="text-xs font-semibold text-[#3B2010] mb-4 uppercase tracking-widest">
                Coperto {coverNumber}
            </h3>

            <p className="text-xs uppercase tracking-widest text-[#9A6840] mb-2">Primo piatto</p>
            <div className="flex flex-col gap-2 mb-5">
                {menu.dinner.primi.map((dish) => (
                    <DishRadio
                        key={dish.name}
                        dish={dish}
                        groupName={`primo-${coverNumber}`}
                        checked={order.primo === dish.name}
                        onChange={() => onUpdate('primo', dish.name)}
                    />
                ))}
            </div>

            <p className="text-xs uppercase tracking-widest text-[#9A6840] mb-2">Secondo piatto</p>
            <div className="flex flex-col gap-2">
                {menu.dinner.secondi.map((dish) => (
                    <DishRadio
                        key={dish.name}
                        dish={dish}
                        groupName={`secondo-${coverNumber}`}
                        checked={order.secondo === dish.name}
                        onChange={() => onUpdate('secondo', dish.name)}
                    />
                ))}
            </div>
        </div>
    )
}

// ════════════════════════════════════════════════════════════════
// SOTTO-COMPONENTE: radio button per un piatto
// ════════════════════════════════════════════════════════════════
function DishRadio({
    dish,
    groupName,
    checked,
    onChange,
}: {
    dish: Dish
    groupName: string
    checked: boolean
    onChange: () => void
}) {
    return (
        <label
            className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all duration-200
                ${
                    checked
                        ? 'border-[#9A6840] bg-[#E8C9A0]/60'
                        : 'border-[#C4A070]/40 hover:border-[#9A6840]/60 hover:bg-[#E8C9A0]/30'
                }`}
        >
            <input
                type="radio"
                name={groupName}
                checked={checked}
                onChange={onChange}
                className="mt-1 accent-[#6B4828] shrink-0"
            />
            <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-[#3B2010]">{dish.name}</span>
                    <span
                        className={`text-[0.65rem] px-1.5 py-0.5 rounded uppercase tracking-wider font-medium shrink-0 ${CATEGORY_STYLE[dish.category]}`}
                    >
                        {dish.category}
                    </span>
                </div>
                <p className="text-xs text-[#6B4828] leading-relaxed">{dish.description}</p>
            </div>
        </label>
    )
}
