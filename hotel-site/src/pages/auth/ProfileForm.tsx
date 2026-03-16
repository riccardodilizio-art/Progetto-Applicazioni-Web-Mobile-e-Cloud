import { useState } from 'react'
import type { UserState } from '../../types/User'

type Props = {
    user: UserState
    onSave: (name: string, surname: string, phone: string) => void
    onCancel: () => void
}

export default function ProfileForm({ user, onSave, onCancel }: Props) {
    const [name, setName]       = useState(user.name ?? '')
    const [surname, setSurname] = useState(user.surname ?? '')
    const [phone, setPhone]     = useState(user.phone ?? '')
    const [saved, setSaved]     = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(name, surname, phone)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-lg font-semibold text-[#3B2010] mb-5">Dati personali</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#3B2010] mb-1">Nome</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-[#C4A070] rounded-lg px-4 py-2
                                text-[#3B2010] focus:outline-none focus:ring-2
                                focus:ring-[#9A6840] focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#3B2010] mb-1">Cognome</label>
                        <input
                            type="text"
                            required
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            className="w-full border border-[#C4A070] rounded-lg px-4 py-2
                                text-[#3B2010] focus:outline-none focus:ring-2
                                focus:ring-[#9A6840] focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#3B2010] mb-1">Email</label>
                    <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full border border-transparent bg-[#FAF5EE] rounded-lg
                            px-4 py-2 text-[#9A6840] cursor-default"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#3B2010] mb-1">Telefono</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-[#C4A070] rounded-lg px-4 py-2
                            text-[#3B2010] focus:outline-none focus:ring-2
                            focus:ring-[#9A6840] focus:border-transparent"
                    />
                </div>

                {saved && (
                    <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                        Profilo aggiornato con successo.
                    </p>
                )}

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        className="flex-1 bg-[#3B2010] text-white font-medium py-2.5
                            rounded-lg hover:bg-[#6B4828] transition-colors cursor-pointer"
                    >
                        Salva modifiche
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 border border-[#C4A070] text-[#6B4828] font-medium
                            py-2.5 rounded-lg hover:bg-[#FAF5EE] transition-colors cursor-pointer"
                    >
                        Annulla
                    </button>
                </div>
            </form>
        </div>
    )
}
