import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import useSignOut from 'react-auth-kit/hooks/useSignOut'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import type { UserState } from '../../types/User'
import { useMenus } from '../../hooks/useMenus'
import { DAY_LABELS, DAY_ORDER } from '../../data/menuUtils'
import type { ApiDayOfWeek } from '../../types/Menu'
import AdminNav from '../../components/admin/AdminNav'
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal'

export default function MenuDashboard() {
    const signOut = useSignOut()
    const navigate = useNavigate()
    const authUser = useAuthUser<UserState>()
    const { menus, loading, deleteId, setDeleteId, handleDelete } = useMenus()

    const menuByDay = new Map(menus.map((m) => [m.giornoSettimana as ApiDayOfWeek, m]))
    const deleteTarget = menus.find((m) => m.idMenu === deleteId)

    const handleLogout = () => {
        signOut()
        navigate('/admin/accedi')
    }

    return (
        <div className="min-h-screen bg-[#FAF5EE]">
            <div className="bg-white border-b border-[#E8C9A0] px-6 py-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl text-[#3B2010] font-light font-heading">Dashboard Admin</h1>
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

            <AdminNav />

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-[#3B2010]">Menu settimanale</h2>
                    <p className="text-sm text-[#9A6840]">
                        {menus.length} / {DAY_ORDER.length} giorni configurati
                    </p>
                </div>

                {loading ? (
                    <p className="text-center text-[#9A6840] py-12">Caricamento menu...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {DAY_ORDER.map((day) => {
                            const menu = menuByDay.get(day)
                            return (
                                <div
                                    key={day}
                                    className={`rounded-xl p-5 ${
                                        menu
                                            ? 'bg-white border border-[#E8C9A0] shadow-sm'
                                            : 'bg-transparent border-2 border-dashed border-[#C4A070]/50'
                                    }`}
                                >
                                    <h3 className="text-lg font-medium text-[#3B2010] mb-3 font-heading">
                                        {DAY_LABELS[day]}
                                    </h3>
                                    {menu ? (
                                        <>
                                            <div className="text-sm text-[#6B4828] space-y-1 mb-4">
                                                <p>
                                                    <span className="font-medium">{menu.primi.length}</span>{' '}
                                                    {menu.primi.length === 1 ? 'primo' : 'primi'}
                                                </p>
                                                <p>
                                                    <span className="font-medium">{menu.secondi.length}</span>{' '}
                                                    {menu.secondi.length === 1 ? 'secondo' : 'secondi'}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/admin/menu/modifica/${menu.idMenu}`}
                                                    className="flex-1 text-center text-sm text-[#6B4828] border border-[#C4A070] py-2 rounded-lg hover:bg-[#FAF5EE] transition-colors"
                                                >
                                                    Modifica
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteId(menu.idMenu)}
                                                    className="flex-1 text-sm text-red-600 border border-red-200 py-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                                >
                                                    Elimina
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-sm text-[#9A6840] mb-4">
                                                Nessun menu configurato
                                            </p>
                                            <Link
                                                to={`/admin/menu/nuovo?giorno=${day}`}
                                                className="block text-center text-sm text-[#6B4828] border border-[#C4A070] py-2 rounded-lg hover:bg-[#FAF5EE] transition-colors"
                                            >
                                                + Crea menu
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {deleteTarget && (
                <DeleteConfirmModal
                    title="Elimina menu"
                    itemName={`menu di ${DAY_LABELS[deleteTarget.giornoSettimana as ApiDayOfWeek]}`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    )
}
