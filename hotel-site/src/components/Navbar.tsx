import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo / Nome Hotel */}
                    <Link to="/" className="text-2xl font-bold text-blue-800">
                        🏨 Hotel Luxury
                    </Link>

                    {/* Link desktop */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-blue-800 font-medium">
                            Home
                        </Link>
                        <Link to="/rooms" className="text-gray-700 hover:text-blue-800 font-medium">
                            Camere
                        </Link>
                        <Link to="/admin/login" className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition">
                            Admin
                        </Link>
                    </div>

                    {/* Hamburger mobile */}
                    <button
                        className="md:hidden text-gray-700"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Menu mobile (si apre/chiude) */}
                {isOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        <Link to="/" className="block text-gray-700 hover:text-blue-800 font-medium" onClick={() => setIsOpen(false)}>
                            Home
                        </Link>
                        <Link to="/rooms" className="block text-gray-700 hover:text-blue-800 font-medium" onClick={() => setIsOpen(false)}>
                            Camere
                        </Link>
                        <Link to="/admin/login" className="block text-blue-800 font-medium" onClick={() => setIsOpen(false)}>
                            Admin
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    )
}
