import { Navigate } from 'react-router-dom'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'

interface UserState {
    email: string
    role: 'admin' | 'client'
}

interface RoleGuardProps {
    role: 'admin' | 'client'
    children: React.ReactNode
    fallbackPath?: string
}

export default function RoleGuard({ role, children, fallbackPath }: RoleGuardProps) {
    const authUser = useAuthUser<UserState>()

    if (!authUser || authUser.role !== role) {
        return <Navigate to={fallbackPath || '/admin/login'} replace />
    }

    return <>{children}</>
}
