import { Outlet, useNavigate } from 'react-router-dom'
import useSignOut from 'react-auth-kit/hooks/useSignOut'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import AdminNav from './AdminNav'
import type { UserState } from '../../types/User.ts'

export default function AdminLayout() {
    const signOut = useSignOut()
    const navigate = useNavigate()
    const authUser = useAuthUser<UserState>()

    const handleLogout = () => {
        signOut()
        navigate('/admin/accedi')
    }

    return (
        <div className="min-h-screen bg-[#FAF5EE]">
            <div className="bg-white border-b border-[#E8C9A0]">
                <AdminNav />
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl text-[#3B2010] font-light font-heading">
                            Dashboard Admin
                        </h1>
                        <p className="text-sm text-[#9A6840]">{authUser?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </div>
            <Outlet />
        </div>
    )
}
