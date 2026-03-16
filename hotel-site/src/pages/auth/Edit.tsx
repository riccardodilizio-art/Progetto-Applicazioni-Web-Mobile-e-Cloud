import { Navigate, useNavigate } from 'react-router-dom'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import useSignIn from 'react-auth-kit/hooks/useSignIn'
import type { UserState } from '../../types/User'
import ProfileForm from './ProfileForm'
import PasswordForm from './PasswordForm'

export default function Edit() {
    const user            = useAuthUser<UserState>()
    const isAuthenticated = useIsAuthenticated()
    const navigate        = useNavigate()
    const signIn          = useSignIn<UserState>()

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />
    }

    const handleSaveProfile = (name: string, surname: string, phone: string) => {
        // TODO: chiamata API per aggiornare il profilo
        signIn({
            auth: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbGllbnRAaG90ZWxleGNlbHNpb3IuaXQiLCJyb2xlIjoiY2xpZW50IiwiZXhwIjo5OTk5OTk5OTk5fQ.dGVzdC1zaWduYXR1cmU',
                type: 'Bearer',
            },
            userState: { ...user, name, surname, phone },
        })
    }

    const handleSavePassword = (_current: string, _next: string) => {
        // TODO: chiamata API per cambiare la password
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
                <PasswordForm onSave={handleSavePassword} />
            </div>
        </div>
    )
}
