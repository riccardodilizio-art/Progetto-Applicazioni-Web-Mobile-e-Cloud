import { Routes, Route, Navigate } from 'react-router-dom'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RoleGuard from './components/RoleGuard'
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import RoomDetail from './pages/RoomDetail'
import Contacts from './pages/Contacts'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import RoomForm from './pages/admin/RoomForm'
import Menu from './pages/Menu'
import NotFound from './pages/NotFound'
import ClientLogin from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/auth/Profile'
import Edit from './pages/auth/Edit'
import MyReservations from './pages/auth/MyReservations'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import { useApiSetup } from './hooks/useApiSetup'
import Restaurant from './pages/Restaurant'

function ProtectedRoute({ children, redirectTo = '/accedi' }: { children: React.ReactNode; redirectTo?: string }) {
    const isAuthenticated = useIsAuthenticated()

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />
    }

    return <>{children}</>
}

export default function App() {
    useApiSetup()
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
                <Routes>
                    {/* Rotte pubbliche */}
                    <Route path="/" element={<Home />} />
                    <Route path="/camere" element={<Rooms />} />
                    <Route path="/camere/:id" element={<RoomDetail />} />
                    <Route path="/contatti" element={<Contacts />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/ristorante" element={<Restaurant />} />

                    {/* Auth client */}
                    <Route path="/accedi" element={<ClientLogin />} />
                    <Route path="/registrazione" element={<Register />} />
                    <Route path="/password-dimenticata" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route
                        path="/profilo"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profilo/modifica"
                        element={
                            <ProtectedRoute>
                                <Edit />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/prenotazioni"
                        element={
                            <ProtectedRoute>
                                <MyReservations />
                            </ProtectedRoute>
                        }
                    />

                    {/* Login admin (pubblica) */}
                    <Route path="/admin/accedi" element={<Login />} />

                    {/* Rotte admin protette */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute redirectTo="/admin/accedi">
                                <RoleGuard role="admin">
                                    <Dashboard />
                                </RoleGuard>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/camere/nuova"
                        element={
                            <ProtectedRoute redirectTo="/admin/accedi">
                                <RoleGuard role="admin">
                                    <RoomForm />
                                </RoleGuard>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/camere/modifica/:id"
                        element={
                            <ProtectedRoute redirectTo="/admin/accedi">
                                <RoleGuard role="admin">
                                    <RoomForm />
                                </RoleGuard>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>

            <Footer />
        </div>
    )
}
