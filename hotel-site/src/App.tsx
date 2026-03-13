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


function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useIsAuthenticated()

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />
    }

    return <>{children}</>
}

export default function App() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
                <Routes>
                    {/* Rotte pubbliche */}
                    <Route path="/" element={<Home />} />
                    <Route path="/rooms" element={<Rooms />} />
                    <Route path="/rooms/:id" element={<RoomDetail />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="*" element={<NotFound />} />

                    {/* Login admin (pubblica) */}
                    <Route path="/admin/login" element={<Login />} />

                    {/* Rotte admin protette */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute>
                                <RoleGuard role="admin">
                                    <Dashboard />
                                </RoleGuard>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/rooms/new"
                        element={
                            <ProtectedRoute>
                                <RoleGuard role="admin">
                                    <RoomForm />
                                </RoleGuard>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/rooms/edit/:id"
                        element={
                            <ProtectedRoute>
                                <RoleGuard role="admin">
                                    <RoomForm />
                                </RoleGuard>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </main>

            <Footer />
        </div>
    )
}
