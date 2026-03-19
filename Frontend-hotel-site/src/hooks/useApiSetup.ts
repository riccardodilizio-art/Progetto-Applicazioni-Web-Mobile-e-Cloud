import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useSignOut from 'react-auth-kit/hooks/useSignOut'
import { registerUnauthorizedHandler } from '../lib/apiClient'

export function useApiSetup() {
    const signOut = useSignOut()
    const navigate = useNavigate()

    useEffect(() => {
        registerUnauthorizedHandler(() => {
            signOut()
            navigate('/login', { replace: true })
        })
        return () => registerUnauthorizedHandler(null)
    }, [signOut, navigate])
}
