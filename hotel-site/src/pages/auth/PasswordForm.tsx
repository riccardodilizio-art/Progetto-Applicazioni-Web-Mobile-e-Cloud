import { useState } from 'react'

type Props = {
    onSave: (current: string, next: string) => void
}

type Fields = { current: string; next: string; confirm: string }
type Visibility = Record<keyof Fields, boolean>

function EyeIcon({ visible }: { visible: boolean }) {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {visible ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7
                       a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243
                       M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29
                       m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0
                       0112 5c4.478 0 8.268 2.943 9.543 7
                       a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            ) : (
                <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5
                           c4.478 0 8.268 2.943 9.542 7
                           -1.274 4.057-5.064 7-9.542 7
                           -4.477 0-8.268-2.943-9.542-7z" />
                </>
            )}
        </svg>
    )
}

export default function PasswordForm({ onSave }: Props) {
    const [fields, setFields]   = useState<Fields>({ current: '', next: '', confirm: '' })
    const [error, setError]     = useState('')
    const [saved, setSaved]     = useState(false)
    const [show, setShow]       = useState<Visibility>({ current: false, next: false, confirm: false })

    const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setFields(prev => ({ ...prev, [key]: e.target.value }))

    const toggleShow = (key: keyof Fields) =>
        setShow(prev => ({ ...prev, [key]: !prev[key] }))

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (fields.next.length < 8) {
            setError('La nuova password deve essere di almeno 8 caratteri.')
            return
        }
        if (fields.next !== fields.confirm) {
            setError('Le password non coincidono.')
            return
        }

        onSave(fields.current, fields.next)
        setFields({ current: '', next: '', confirm: '' })
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    const field = (key: keyof Fields, label: string) => (
        <div>
            <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-[#3B2010]">{label}</label>
                {key === 'current' && (
                    <a
                        href="/forgot-password"
                        className="text-xs text-[#9A6840] hover:text-[#3B2010] hover:underline transition-colors"
                    >
                        Password dimenticata?
                    </a>
                )}
            </div>
            <div className="relative">
                <input
                    type={show[key] ? 'text' : 'password'}
                    required
                    value={fields[key]}
                    onChange={set(key)}
                    className="w-full border border-[#C4A070] rounded-lg px-4 py-2 pr-10
                    text-[#3B2010] focus:outline-none focus:ring-2 focus:ring-[#9A6840]
                    focus:border-transparent"
                />
                <button
                    type="button"
                    onClick={() => toggleShow(key)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A6840]
                    hover:text-[#3B2010] transition-colors cursor-pointer"
                    aria-label={show[key] ? 'Nascondi password' : 'Mostra password'}
                >
                    <EyeIcon visible={show[key]} />
                </button>
            </div>
        </div>
    )

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-lg font-semibold text-[#3B2010] mb-1">Cambia password</h2>
            <p className="text-sm text-[#9A6840] mb-5">Minimo 8 caratteri.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
                {field('current', 'Password attuale')}
                {field('next',    'Nuova password')}
                {field('confirm', 'Conferma nuova password')}

                {error && (
                    <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                        {error}
                    </p>
                )}
                {saved && (
                    <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                        Password aggiornata con successo.
                    </p>
                )}

                <button
                    type="submit"
                    className="w-full bg-[#3B2010] text-white font-medium py-2.5
                        rounded-lg hover:bg-[#6B4828] transition-colors cursor-pointer"
                >
                    Aggiorna password
                </button>
            </form>
        </div>
    )
}
