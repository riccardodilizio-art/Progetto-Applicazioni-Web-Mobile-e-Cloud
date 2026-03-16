import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import type { UserState } from '../types/User'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()
    const isAuthenticated = useIsAuthenticated()
    const user = useAuthUser<UserState>()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const isActive = (path: string) => location.pathname === path
    const isClient = isAuthenticated && user?.role === 'client'

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/rooms', label: 'Camere' },
        { to: '/menu', label: 'Ristorante' },
        ...(isClient ? [{ to: '/prenotazioni', label: 'Prenotazioni' }] : []),
        { to: '/contacts', label: 'Contatti' },
    ]

    const authLink = isAuthenticated
        ? {
              to: user?.role === 'admin' ? '/admin/dashboard' : '/profile',
              label: user?.role === 'admin' ? 'Admin' : 'Profilo',
          }
        : { to: '/login', label: 'Accedi' }

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-500 backdrop-blur-md
            ${
                scrolled
                    ? 'bg-[#E8C9A0]/60 shadow-sm border-b border-[#C4A070]/30'
                    : 'bg-[#E8C9A0]/30 border-b border-[#C4A070]/20'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 no-underline">
                    <img
                        src="/images/LogoHotel.png"
                        alt="Logo Hotel"
                        className="w-17 h-17 rounded-full object-cover border border-[#B07840]/40"
                    />
                    <div className="flex flex-col leading-tight">
                        <span className="text-[#3B2010] text-3xl font-medium tracking-wide drop-shadow-sm font-heading">
                            Hotel Excelsior
                        </span>
                    </div>
                </Link>

                {/* Link desktop */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`text-[0.75rem] tracking-[0.18em] uppercase font-normal relative pb-0.5
                                after:absolute after:bottom-0 after:left-0 after:h-px after:bg-[#9A6840] after:transition-all after:duration-300
                                transition-colors duration-300
                                ${
                                    isActive(to)
                                        ? 'text-[#3B2010] after:w-full'
                                        : 'text-[#6B4828] hover:text-[#3B2010] after:w-0 hover:after:w-full'
                                }`}
                        >
                            {label}
                        </Link>
                    ))}

                    <div className="w-px h-5 bg-[#9A6840]/35" />

                    <Link
                        to={authLink.to}
                        className="text-[0.7rem] tracking-[0.2em] uppercase font-medium
                            text-[#FAF0E6] bg-[#3B2010]/80 px-5 py-2 border border-[#3B2010]/60
                            hover:bg-[#3B2010] transition-all duration-300"
                    >
                        {authLink.label}
                    </Link>
                </div>

                {/* Hamburger */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-1 bg-transparent border-none cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Menu"
                >
                    <span
                        className={`block w-6 h-px bg-[#3B2010] transition-all duration-300 origin-center ${isOpen ? 'translate-y-[7px] rotate-45' : ''}`}
                    />
                    <span
                        className={`block w-6 h-px bg-[#3B2010] transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}
                    />
                    <span
                        className={`block w-6 h-px bg-[#3B2010] transition-all duration-300 origin-center ${isOpen ? '-translate-y-[7px] -rotate-45' : ''}`}
                    />
                </button>
            </div>

            {/* Mobile menu */}
            <div
                className={`md:hidden flex flex-col gap-6 px-6 border-t border-[#9A6840]/20 bg-[#E8C9A0]/70 backdrop-blur-md
                overflow-hidden transition-all duration-300
                ${isOpen ? 'max-h-64 py-6' : 'max-h-0 py-0'}`}
            >
                {navLinks.map(({ to, label }) => (
                    <Link
                        key={to}
                        to={to}
                        className={`text-[0.8rem] tracking-[0.2em] uppercase font-normal transition-colors duration-200
                            ${isActive(to) ? 'text-[#3B2010]' : 'text-[#6B4828] hover:text-[#3B2010]'}`}
                        onClick={() => setIsOpen(false)}
                    >
                        {label}
                    </Link>
                ))}
                <Link
                    to={authLink.to}
                    className="text-[0.7rem] tracking-[0.2em] uppercase font-medium
                        text-[#FAF0E6] bg-[#3B2010]/80 px-5 py-2.5 self-start
                        hover:bg-[#3B2010] transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                >
                    {authLink.label}
                </Link>
            </div>
        </nav>
    )
}
