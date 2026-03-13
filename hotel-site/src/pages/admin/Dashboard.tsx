import { useNavigate } from 'react-router-dom'
import useSignOut from 'react-auth-kit/hooks/useSignOut'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import type {UserState} from '../../types/User'


export default function Dashboard() {
    const signOut = useSignOut()
    const navigate = useNavigate()
    const authUser = useAuthUser<UserState>()

    const handleLogout = () => {
        signOut()
        navigate('/admin/login')
    }

    return (
        <div className="p-8 bg-[#FAF5EE] min-h-[70vh]">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1
                        className="text-3xl text-[#3B2010] font-light font-heading"
                    >
                        Dashboard
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{authUser?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-[#3B2010] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2a1709] transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <p className="text-gray-600">Benvenuto nell'area amministrativa.</p>
            </div>
        </div>
    )
}
