import { Navigate, useNavigate } from 'react-router-dom'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import useSignIn from 'react-auth-kit/hooks/useSignIn'
import type { UserState } from '../../types/User'
import ProfileForm from './ProfileForm'
import PasswordForm from './PasswordForm'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'

export default function Edit() {
    const user            = useAuthUser<UserState>()
    const isAuthenticated = useIsAuthenticated()
    const navigate        = useNavigate()
    const signIn          = useSignIn<UserState>()
    const authHeader = useAuthHeader()

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />
    }

    const handleSaveProfile = (name: string | undefined, surname: string | undefined, phone: string | undefined) => {
        // TODO: chiamata API per aggiornare il profilo
        const currentToken = (authHeader ?? '').replace('Bearer ', '')
        signIn({
            auth: {
                token: currentToken,
                type: 'Bearer',
            },
            userState: { ...user, name, surname, phone },
        })
    }

    const handleRequest2FA = async (_current: string, _next: string): Promise<void> => {
        // TODO: POST /auth/request-password-change
        // Il backend verifica la password attuale e invia l'OTP via email
    }

    const handleSavePassword = (_current: string, _next: string, _otp: string) => {
        // TODO: POST /auth/confirm-password-change con { current, next, otp }
    }

    return (
        <div className="min-h-screen bg-[#FAF5EE] px-4 py-12">
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="font-heading text-3xl font-semibold text-[#3B2010] text-center">
                    Modifica Profilo
                </h1>
                <ProfileForm
                    user={user}
                    onSave={handleSaveProfile}
                    onCancel={() => navigate(-1)}
                />
                <PasswordForm
                    onRequest2FA={handleRequest2FA}
                    onSave={handleSavePassword}
                    onForgotPassword={() => navigate('/forgot-password')}
                />
            </div>
        </div>
    )
}
