import type { RoomFormData, RoomFormErrors } from '../../../types/Room'

type Props = {
    data: Pick<RoomFormData, 'description' | 'pricePerNight' | 'capacity' | 'size'>
    errors: Pick<RoomFormErrors, 'description' | 'pricePerNight' | 'capacity' | 'size'>
    onChange: (field: keyof RoomFormData, value: string) => void
}

export default function RoomDetailsSection({ data, errors, onChange }: Props) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-[#E8C9A0]/50 overflow-hidden">
            <div className="bg-[#FAF5EE] border-b border-[#E8C9A0]/50 px-6 py-4">
                <h2 className="font-heading text-lg text-[#3B2010] font-medium">Descrizione e Dettagli</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Descrizione */}
                <div className="md:col-span-3" data-error={!!errors.description}>
                    <label className="block text-sm font-medium text-[#6B4828] mb-1.5">
                        Descrizione <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={data.description}
                        onChange={(e) => onChange('description', e.target.value)}
                        rows={3}
                        placeholder="Descrivi la camera in modo dettagliato..."
                        className={`w-full border rounded-lg px-3 py-2.5 text-sm text-[#3B2010] placeholder:text-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#C4A070] transition resize-none ${
                            errors.description ? 'border-red-400 bg-red-50' : 'border-[#E8C9A0] bg-white'
                        }`}
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                {/* Prezzo */}
                <div data-error={!!errors.pricePerNight}>
                    <label className="block text-sm font-medium text-[#6B4828] mb-1.5">
                        Prezzo / notte (€) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A6840] text-sm">€</span>
                        <input
                            type="number"
                            value={data.pricePerNight}
                            onChange={(e) => onChange('pricePerNight', e.target.value)}
                            placeholder="0"
                            min={1}
                            className={`w-full border rounded-lg pl-7 pr-3 py-2.5 text-sm text-[#3B2010] placeholder:text-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#C4A070] transition ${
                                errors.pricePerNight ? 'border-red-400 bg-red-50' : 'border-[#E8C9A0] bg-white'
                            }`}
                        />
                    </div>
                    {errors.pricePerNight && <p className="text-red-500 text-xs mt-1">{errors.pricePerNight}</p>}
                </div>

                {/* Capacità */}
                <div data-error={!!errors.capacity}>
                    <label className="block text-sm font-medium text-[#6B4828] mb-1.5">
                        Capacità (ospiti) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        value={data.capacity}
                        onChange={(e) => onChange('capacity', e.target.value)}
                        placeholder="2"
                        min={1}
                        max={10}
                        className={`w-full border rounded-lg px-3 py-2.5 text-sm text-[#3B2010] placeholder:text-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#C4A070] transition ${
                            errors.capacity ? 'border-red-400 bg-red-50' : 'border-[#E8C9A0] bg-white'
                        }`}
                    />
                    {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
                </div>

                {/* Dimensione */}
                <div data-error={!!errors.size}>
                    <label className="block text-sm font-medium text-[#6B4828] mb-1.5">
                        Dimensione (m²) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={data.size}
                            onChange={(e) => onChange('size', e.target.value)}
                            placeholder="28"
                            min={1}
                            className={`w-full border rounded-lg px-3 pr-10 py-2.5 text-sm text-[#3B2010] placeholder:text-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#C4A070] transition ${
                                errors.size ? 'border-red-400 bg-red-50' : 'border-[#E8C9A0] bg-white'
                            }`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A6840] text-xs">m²</span>
                    </div>
                    {errors.size && <p className="text-red-500 text-xs mt-1">{errors.size}</p>}
                </div>
            </div>
        </div>
    )
}
