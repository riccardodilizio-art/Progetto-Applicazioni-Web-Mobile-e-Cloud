import type { Dish } from '../../types/Menu'

const CATEGORY_STYLE: Record<string, string> = {
    pesce: 'bg-blue-100 text-blue-700',
    carne: 'bg-red-100 text-red-700',
    vegetariano: 'bg-green-100 text-green-700',
}

export default function DishRadio({
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
