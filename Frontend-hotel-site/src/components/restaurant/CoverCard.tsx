import type { DinnerOrder } from '../../types/Reservation'
import type { DayMenu } from '../../types/Menu'
import DishRadio from './DishRadio'

export default function CoverCard({
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
