import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import RoomDetail from './pages/RoomDetail'
import Menu from './pages/Menu'
import Contacts from './pages/Contacts'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import RoomForm from './pages/admin/RoomForm'
import NotFound from './pages/NotFound'

export default function App() {
    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                <Navbar />

                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="*" element={<NotFound />} />
                        <Route path="/rooms" element={<Rooms />} />
                        <Route path="/rooms/:id" element={<RoomDetail />} />
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/admin/login" element={<Login />} />
                        <Route path="/admin/dashboard" element={<Dashboard />} />
                        <Route path="/admin/rooms/new" element={<RoomForm />} />
                        <Route path="/admin/rooms/edit/:id" element={<RoomForm />} />
                        <Route path="/contacts" element={<Contacts />} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </BrowserRouter>
    )
}
