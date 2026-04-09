import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useSignOut from 'react-auth-kit/hooks/useSignOut'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import { registerUnauthorizedHandler, registerAuthHeaderGetter } from '../lib/apiClient'

export function useApiSetup() {
    const signOut = useSignOut()
    const navigate = useNavigate()
    const authHeader = useAuthHeader()

    useEffect(() => {
        registerUnauthorizedHandler(() => {
            signOut()
            navigate('/accedi', { replace: true })
        })
        return () => registerUnauthorizedHandler(null)
    }, [signOut, navigate])

    useEffect(() => {
        registerAuthHeaderGetter(() => authHeader)
        return () => registerAuthHeaderGetter(null)
    }, [authHeader])
}
