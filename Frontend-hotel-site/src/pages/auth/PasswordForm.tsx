import { useState, useEffect, useRef } from 'react'

type Props = {
    onRequest2FA: (current: string, next: string) => Promise<void>
    onSave: (current: string, next: string, otp: string) => Promise<void>
    onForgotPassword: () => void
}

type Step = 'form' | 'verify'
type Fields = { current: string; next: string; confirm: string }
type Visibility = Record<keyof Fields, boolean>

const OTP_EXPIRY_SEC = 60

// ── Icona occhio ───────────────────────────────────────────
function EyeIcon({ visible }: { visible: boolean }) {
    return (
        <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {visible ? (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7
                       a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243
                       M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29
                       m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0
                       0112 5c4.478 0 8.268 2.943 9.543 7
                       a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
            ) : (
                <>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5
                           c4.478 0 8.268 2.943 9.542 7
                           -1.274 4.057-5.064 7-9.542 7
                           -4.477 0-8.268-2.943-9.542-7z"
                    />
                </>
            )}
        </svg>
    )
}

// ── Campo password ─────────────────────────────────────────
type PasswordFieldProps = {
    label: string
    value: string
    show: boolean
    required?: boolean
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onToggleShow: () => void
    hint?: React.ReactNode
}

function PasswordField({ label, value, show, required = true, onChange, onToggleShow, hint }: PasswordFieldProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-[#3B2010]">{label}</label>
                {hint}
            </div>
            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    required={required}
                    value={value}
                    onChange={onChange}
                    className="w-full border border-[#C4A070] rounded-lg px-4 py-2 pr-10
                        text-[#3B2010] focus:outline-none focus:ring-2 focus:ring-[#9A6840]
                        focus:border-transparent"
                />
                <button
                    type="button"
                    onClick={onToggleShow}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A6840]
                        hover:text-[#3B2010] transition-colors cursor-pointer"
                    aria-label={show ? 'Nascondi' : 'Mostra'}
                >
                    <EyeIcon visible={show} />
                </button>
            </div>
        </div>
    )
}

// ── Forza password ─────────────────────────────────────────
function getStrength(pwd: string) {
    if (!pwd) return { level: 0, label: '', color: '' }
    const score = [
        pwd.length >= 8,
        /[a-zA-Z]/.test(pwd),
        /[0-9]/.test(pwd),
        /[^a-zA-Z0-9]/.test(pwd),
        pwd.length >= 12,
    ].filter(Boolean).length
    if (score <= 2) return { level: 1, label: 'Debole', color: 'bg-red-400' }
    if (score === 3) return { level: 2, label: 'Media', color: 'bg-yellow-400' }
    if (score === 4) return { level: 3, label: 'Forte', color: 'bg-green-500' }
    return { level: 4, label: 'Molto forte', color: 'bg-green-700' }
}

function StrengthBar({ password }: { password: string }) {
    const { level, label, color } = getStrength(password)
    if (!password) return null
    return (
        <div className="mt-1.5">
            <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300
                        ${i <= level ? color : 'bg-[#E8C9A0]'}`}
                    />
                ))}
            </div>
            <p
                className={`text-xs ${level === 1 ? 'text-red-500' : level <= 2 ? 'text-yellow-600' : 'text-green-600'}`}
            >
                {label}
            </p>
        </div>
    )
}

// ── Step 2: verifica OTP ───────────────────────────────────
type OtpStepProps = {
    onConfirm: (otp: string) => void
    onResend: () => Promise<void>
    onBack: () => void
    error: string
}

function OtpStep({ onConfirm, onResend, onBack, error }: OtpStepProps) {
    const [otp, setOtp] = useState('')
    const [seconds, setSeconds] = useState(OTP_EXPIRY_SEC)
    const [resending, setResending] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    // countdown
    useEffect(() => {
        if (seconds <= 0) return
        const id = setInterval(() => setSeconds((s) => s - 1), 1000)
        return () => clearInterval(id)
    }, [seconds])

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const handleResend = async () => {
        setResending(true)
        await onResend()
        setSeconds(OTP_EXPIRY_SEC)
        setOtp('')
        setResending(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (otp.trim().length > 0) onConfirm(otp.trim())
    }

    const expired = seconds <= 0

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center">
                {/* icona lock */}
                <div className="mx-auto w-12 h-12 rounded-full bg-[#F5ECD7] flex items-center justify-center mb-3">
                    <svg
                        aria-hidden="true"
                        className="w-6 h-6 text-[#9A6840]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                </div>
                <p className="text-sm text-[#3B2010] font-medium">Codice di verifica inviato</p>
                <p className="text-xs text-[#9A6840] mt-1">Controlla la tua email e inserisci il codice a 6 cifre.</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-[#3B2010] mb-1">Codice OTP</label>
                <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full border border-[#C4A070] rounded-lg px-4 py-2
                        text-[#3B2010] text-center tracking-[0.4em] text-lg font-mono
                        focus:outline-none focus:ring-2 focus:ring-[#9A6840] focus:border-transparent"
                />

                {/* countdown / scaduto */}
                <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs ${expired ? 'text-red-500' : 'text-[#9A6840]'}`}>
                        {expired ? 'Codice scaduto.' : `Scade tra ${seconds}s`}
                    </p>
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resending || (!expired && seconds > OTP_EXPIRY_SEC - 10)}
                        className="text-xs text-[#9A6840] hover:text-[#3B2010] hover:underline
                            transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {resending ? 'Invio…' : 'Rinvia codice'}
                    </button>
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
            )}

            <button
                type="submit"
                disabled={otp.length !== 6 || expired}
                className="w-full bg-[#3B2010] text-white font-medium py-2.5 rounded-lg
                    hover:bg-[#6B4828] transition-colors cursor-pointer
                    disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Conferma
            </button>

            <button
                type="button"
                onClick={onBack}
                className="w-full text-sm text-[#9A6840] hover:text-[#3B2010] hover:underline
                    transition-colors cursor-pointer"
            >
                ← Torna indietro
            </button>
        </form>
    )
}

// ── Componente principale ──────────────────────────────────
export default function PasswordForm({ onRequest2FA, onSave, onForgotPassword }: Props) {
    const [step, setStep] = useState<Step>('form')
    const [fields, setFields] = useState<Fields>({ current: '', next: '', confirm: '' })
    const [show, setShow] = useState<Visibility>({ current: false, next: false, confirm: false })
    const [error, setError] = useState('')
    const [saved, setSaved] = useState(false)
    const [loading, setLoading] = useState(false)

    const forgotMode = fields.current === '' && (fields.next !== '' || fields.confirm !== '')

    const handleChange = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setFields((prev) => ({ ...prev, [key]: e.target.value }))

    const handleToggle = (key: keyof Fields) => setShow((prev) => ({ ...prev, [key]: !prev[key] }))

    // Step 1 → richiede il codice OTP al backend
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (forgotMode) {
            onForgotPassword()
            return
        }

        if (fields.next.length < 8) {
            setError('La nuova password deve essere di almeno 8 caratteri.')
            return
        }
        if (fields.next !== fields.confirm) {
            setError('Le password non coincidono.')
            return
        }

        setLoading(true)
        try {
            await onRequest2FA(fields.current, fields.next)
            setStep('verify')
        } catch {
            setError('Impossibile inviare il codice. Controlla la password attuale.')
        } finally {
            setLoading(false)
        }
    }

    const handleOtpConfirm = async (otp: string) => {
        setError('')
        try {
            await onSave(fields.current, fields.next, otp)
            setFields({ current: '', next: '', confirm: '' })
            setStep('form')
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch {
            setError('Errore durante il salvataggio della password.')
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-lg font-semibold text-[#3B2010] mb-1">Cambia password</h2>
            <p className="text-sm text-[#9A6840] mb-5">Minimo 8 caratteri.</p>

            {step === 'verify' ? (
                <OtpStep
                    onConfirm={handleOtpConfirm}
                    onResend={() => onRequest2FA(fields.current, fields.next)}
                    onBack={() => {
                        setStep('form')
                        setError('')
                    }}
                    error={error}
                />
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <PasswordField
                        label="Password attuale"
                        value={fields.current}
                        show={show.current}
                        required={false}
                        onChange={handleChange('current')}
                        onToggleShow={() => handleToggle('current')}
                        hint={
                            <button
                                type="button"
                                onClick={onForgotPassword}
                                className="text-xs text-[#9A6840] hover:text-[#3B2010] hover:underline transition-colors"
                            >
                                Password dimenticata?
                            </button>
                        }
                    />

                    <div>
                        <PasswordField
                            label="Nuova password"
                            value={fields.next}
                            show={show.next}
                            onChange={handleChange('next')}
                            onToggleShow={() => handleToggle('next')}
                        />
                        <StrengthBar password={fields.next} />
                    </div>

                    <PasswordField
                        label="Conferma nuova password"
                        value={fields.confirm}
                        show={show.confirm}
                        onChange={handleChange('confirm')}
                        onToggleShow={() => handleToggle('confirm')}
                    />

                    {forgotMode && (
                        <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                            Hai lasciato vuota la password attuale. Riceverai un link via email per reimpostarla.
                        </p>
                    )}
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
                        disabled={loading}
                        className="w-full bg-[#3B2010] text-white font-medium py-2.5
                            rounded-lg hover:bg-[#6B4828] transition-colors cursor-pointer
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Invio codice…' : forgotMode ? 'Invia link di reset' : 'Continua'}
                    </button>
                </form>
            )}
        </div>
    )
}
