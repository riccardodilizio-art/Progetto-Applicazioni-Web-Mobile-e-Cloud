import { ROOM_TYPES } from '../../../data/roomUtils'
import type { RoomFormData, RoomFormErrors } from '../../../types/Room'

type Props = {
    data: Pick<RoomFormData, 'name' | 'type' | 'roomNumber' | 'floor' | 'available'>
    errors: Pick<RoomFormErrors, 'name' | 'roomNumber' | 'floor'>
    onChange: (field: keyof RoomFormData, value: string | boolean) => void
}

export default function RoomInfoSection({ data, errors, onChange }: Props) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-[#E8C9A0]/50 overflow-hidden">
            <div className="bg-[#FAF5EE] border-b border-[#E8C9A0]/50 px-6 py-4">
                <h2 className="font-heading text-lg text-[#3B2010] font-medium">Informazioni Principali</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome */}
                <div className="md:col-span-2" data-error={!!errors.name}>
                    <label className="block text-sm font-medium text-[#6B4828] mb-1.5">
                        Nome camera <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        placeholder="es. Camera Doppia Vista Mare"
                        className={`w-full border rounded-lg px-3 py-2.5 text-sm text-[#3B2010] placeholder:text-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#C4A070] transition ${
                            errors.name ? 'border-red-400 bg-red-50' : 'border-[#E8C9A0] bg-white'
                        }`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Tipo */}
                <div>
                    <label className="block text-sm font-medium text-[#6B4828] mb-1.5">
                        Tipo <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={data.type}
                        onChange={(e) => onChange('type', e.target.value)}
                        className="w-full border border-[#E8C9A0] rounded-lg px-3 py-2.5 text-sm text-[#3B2010] bg-white focus:outline-none focus:ring-2 focus:ring-[#C4A070] transition"
                    >
                        {ROOM_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                                {t.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Toggle disponibilità */}
                <div className="flex items-center gap-3 pt-6">
                    <button
                        type="button"
                        role="switch"
                        aria-checked={data.available}
                        aria-label={data.available ? 'Camera disponibile' : 'Camera non disponibile'}
                        onClick={() => onChange('available', !data.available)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                            data.available ? 'bg-green-500' : 'bg-[#E8C9A0]'
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                                data.available ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                    <span className="text-sm text-[#6B4828]">
                        {data.available ? 'Camera disponibile' : 'Camera non disponibile'}
                    </span>
                </div>

                {/* Numero camera */}
                <div data-error={!!errors.roomNumber}>
                    <label className="block text-sm font-medium text-[#6B4828] mb-1.5">
                        Numero camera <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        value={data.roomNumber}
                        onChange={(e) => onChange('roomNumber', e.target.value)}
                        placeholder="es. 203"
                        min={1}
                        step="1"
                        className={`w-full border rounded-lg px-3 py-2.5 text-sm text-[#3B2010] placeholder:text-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#C4A070] transition ${
                            errors.roomNumber ? 'border-red-400 bg-red-50' : 'border-[#E8C9A0] bg-white'
                        }`}
                    />
                    {errors.roomNumber && <p className="text-red-500 text-xs mt-1">{errors.roomNumber}</p>}
                </div>

                {/* Piano */}
                <div data-error={!!errors.floor}>
                    <label className="block text-sm font-medium text-[#6B4828] mb-1.5">
                        Piano <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        value={data.floor}
                        onChange={(e) => onChange('floor', e.target.value)}
                        placeholder="es. 3"
                        min={0}
                        step="1"
                        className={`w-full border rounded-lg px-3 py-2.5 text-sm text-[#3B2010] placeholder:text-[#C4A070] focus:outline-none focus:ring-2 focus:ring-[#C4A070] transition ${
                            errors.floor ? 'border-red-400 bg-red-50' : 'border-[#E8C9A0] bg-white'
                        }`}
                    />
                    {errors.floor && <p className="text-red-500 text-xs mt-1">{errors.floor}</p>}
                </div>
            </div>
        </div>
    )
}
