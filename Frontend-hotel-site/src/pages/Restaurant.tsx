import { useDinnerReservation } from '../hooks/useDinnerReservation'
import IdleView from '../components/restaurant/IdleView'
import ErrorView from '../components/restaurant/ErrorView'
import LockedView from '../components/restaurant/LockedView'
import SuccessView from '../components/restaurant/SuccessView'
import PageHeader from '../components/restaurant/PageHeader'
import CoverCard from '../components/restaurant/CoverCard'

export default function Restaurant() {
    const {
        code,
        setCode,
        roomNumber,
        setRoomNumber,
        pageState,
        errorMsg,
        rlStatus,
        reservation,
        todayMenu,
        existingDinner,
        covers,
        orders,
        validationError,
        today,
        handleSubmitCode,
        handleCoversChange,
        updateOrder,
        handleConfirm,
        handleReset,
    } = useDinnerReservation()

    if (pageState === 'idle')
        return (
            <IdleView
                code={code}
                roomNumber={roomNumber}
                rlStatus={rlStatus}
                onCodeChange={setCode}
                onRoomChange={setRoomNumber}
                onSubmit={handleSubmitCode}
            />
        )

    if (pageState === 'error') return <ErrorView errorMsg={errorMsg} rlStatus={rlStatus} onRetry={handleReset} />

    if (pageState === 'locked' && existingDinner && reservation)
        return (
            <LockedView existingDinner={existingDinner} reservation={reservation} today={today} onReset={handleReset} />
        )

    if (pageState === 'success' && reservation)
        return <SuccessView roomName={reservation.roomName} covers={covers} orders={orders} onReset={handleReset} />

    if (pageState === 'booking' && reservation && todayMenu) {
        const isEditing = existingDinner?.status === 'bozza'
        return (
            <div className="min-h-screen bg-[#FAF0E6] px-4 py-16">
                <div className="max-w-2xl mx-auto">
                    <PageHeader />
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
                    <div className="mb-6">
                        <p className="text-xs uppercase tracking-widest text-[#9A6840] mb-3">Quanti coperti stasera?</p>
                        <div className="flex gap-2">
                            {Array.from({ length: reservation.roomCapacity }, (_, i) => i + 1).map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => handleCoversChange(n)}
                                    className={`w-11 h-11 rounded-lg text-sm font-semibold border transition-all duration-200 ${covers === n ? 'bg-[#3B2010] text-[#FAF0E6] border-[#3B2010]' : 'bg-white/60 text-[#6B4828] border-[#C4A070]/50 hover:border-[#9A6840]'}`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>
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
                            className="w-full py-3 bg-[#3B2010] text-[#FAF0E6] text-sm uppercase tracking-widest rounded-xl hover:bg-[#6B4828] transition-colors"
                        >
                            {isEditing ? 'Salva modifiche' : 'Conferma prenotazione'}
                        </button>
                        <button
                            onClick={handleReset}
                            className="w-full py-2.5 border border-[#C4A070]/60 text-[#6B4828] text-sm uppercase tracking-widest rounded-xl hover:bg-[#E8C9A0]/40 transition-colors"
                        >
                            Annulla
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return null
}
