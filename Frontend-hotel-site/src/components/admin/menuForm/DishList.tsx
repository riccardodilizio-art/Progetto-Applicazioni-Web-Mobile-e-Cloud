import { CATEGORY_OPTIONS, emptyDish } from '../../../data/menuUtils'
import type { MenuFormDishEntry, MenuFormErrors } from '../../../types/Menu'

interface Props {
    title: string
    sectionError?: string
    dishes: MenuFormDishEntry[]
    dishErrors: MenuFormErrors['dishes']
    onChange: (dishes: MenuFormDishEntry[]) => void
}

export default function DishList({ title, sectionError, dishes, dishErrors, onChange }: Props) {
    function updateDish(id: string, patch: Partial<MenuFormDishEntry>) {
        onChange(dishes.map((d) => (d.id === id ? { ...d, ...patch } : d)))
    }
    function addDish() {
        onChange([...dishes, emptyDish()])
    }
    function removeDish(id: string) {
        onChange(dishes.filter((d) => d.id !== id))
    }

    return (
        <section
            data-error={sectionError ? 'true' : undefined}
            className="bg-white rounded-xl border border-[#E8C9A0]/60 p-6"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#3B2010]">{title}</h2>
                <button
                    type="button"
                    onClick={addDish}
                    className="text-sm text-[#6B4828] border border-[#C4A070] px-3 py-1.5 rounded-lg hover:bg-[#FAF5EE] transition-colors"
                >
                    + Aggiungi
                </button>
            </div>

            {sectionError && <p className="text-sm text-red-600 mb-4">{sectionError}</p>}

            {dishes.length === 0 ? (
                <p className="text-sm text-[#9A6840]">Nessun piatto. Clicca "Aggiungi" per iniziare.</p>
            ) : (
                <div className="space-y-4">
                    {dishes.map((dish, i) => {
                        const err = dishErrors?.[dish.id]
                        return (
                            <div
                                key={dish.id}
                                className="border border-[#E8C9A0] rounded-lg p-4 bg-[#FAF5EE]/30"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-xs uppercase tracking-widest text-[#9A6840]">
                                        #{i + 1}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeDish(dish.id)}
                                        className="text-xs text-red-600 hover:underline"
                                    >
                                        Rimuovi
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs text-[#6B4828] mb-1">Nome *</label>
                                        <input
                                            type="text"
                                            value={dish.name}
                                            onChange={(e) => updateDish(dish.id, { name: e.target.value })}
                                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6840] bg-white ${
                                                err?.name ? 'border-red-400' : 'border-[#C4A070]'
                                            }`}
                                        />
                                        {err?.name && <p className="text-xs text-red-600 mt-1">{err.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#6B4828] mb-1">
                                            Descrizione
                                        </label>
                                        <textarea
                                            value={dish.description}
                                            onChange={(e) =>
                                                updateDish(dish.id, { description: e.target.value })
                                            }
                                            rows={2}
                                            className="w-full border border-[#C4A070] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6840] bg-white resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#6B4828] mb-1">Categoria *</label>
                                        <div className="flex flex-wrap gap-2">
                                            {CATEGORY_OPTIONS.map((opt) => {
                                                const selected = dish.category === opt.value
                                                return (
                                                    <label
                                                        key={opt.value}
                                                        className={`cursor-pointer text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                                                            selected
                                                                ? 'bg-[#3B2010] text-white border-[#3B2010]'
                                                                : 'bg-white text-[#6B4828] border-[#C4A070] hover:bg-[#FAF5EE]'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            className="sr-only"
                                                            checked={selected}
                                                            onChange={() =>
                                                                updateDish(dish.id, { category: opt.value })
                                                            }
                                                        />
                                                        {opt.label}
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </section>
    )
}
