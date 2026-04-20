import { Navigate, useNavigate } from 'react-router-dom'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import useSignIn from 'react-auth-kit/hooks/useSignIn'
import type { UserState } from '../../types/User'
import ProfileForm from './ProfileForm'
import PasswordForm from './PasswordForm'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import { apiFetch } from '../../lib/apiClient.ts'

export default function Edit() {
    const user = useAuthUser<UserState>()
    const isAuthenticated = useIsAuthenticated()
    const navigate = useNavigate()
    const signIn = useSignIn<UserState>()
    const authHeader = useAuthHeader()

    if (!isAuthenticated || !user) {
        return <Navigate to="/accedi" replace />
    }

    const handleSaveProfile = async (
        name: string | undefined,
        surname: string | undefined,
        phone: string | undefined
    ) => {
        await apiFetch(`/users/${user.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                nome: name ?? '',
                cognome: surname ?? '',
                numeroTelefono: phone ?? '',
            }),
        })

        // aggiorna lo stato locale di auth-kit
        const currentToken = (authHeader ?? '').replace('Bearer ', '')
        signIn({
            auth: { token: currentToken, type: 'Bearer' },
            userState: { ...user, name, surname, phone },
        })
    }

    const handleRequest2FA = async (_current: string, _next: string): Promise<void> => {
        // TODO: POST /auth/request-password-change
        // Il backend verifica la password attuale e invia l'OTP via email
    }

    const handleSavePassword = async (current: string, next: string, otp: string) => {
        await apiFetch('/auth/confirm-password-change', {
            method: 'POST',
            body: JSON.stringify({ current, next, otp }),
        })
    }

    return (
        <div className="min-h-screen bg-[#FAF5EE] px-4 py-12">
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="font-heading text-3xl font-semibold text-[#3B2010] text-center">Modifica Profilo</h1>
                <ProfileForm user={user} onSave={handleSaveProfile} onCancel={() => navigate(-1)} />
                <PasswordForm
                    onRequest2FA={handleRequest2FA}
                    onSave={handleSavePassword}
                    onForgotPassword={() => navigate('/password-dimenticata')}
                />
            </div>
        </div>
    )
}
