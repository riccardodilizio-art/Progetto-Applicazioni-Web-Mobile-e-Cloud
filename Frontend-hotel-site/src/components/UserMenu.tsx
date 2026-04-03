import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useSignOut from 'react-auth-kit/hooks/useSignOut'
import type { UserState } from '../types/User'

type Props = {
    user: UserState
    role: 'client' | 'admin'
}

const clientItems = [
    { to: '/prenotazioni', label: 'Le mie prenotazioni' },
    { to: '/profilo/modifica', label: 'Modifica dati' }

]

const adminItems = [{ to: '/admin/dashboard', label: 'Dashboard' }]

export default function UserMenu({ user, role }: Props) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const signOut = useSignOut()
    const navigate = useNavigate()

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const handleLogout = () => {
        signOut()
        setOpen(false)
        navigate('/')
    }

    const items = role === 'admin' ? adminItems : clientItems

    return (
        <div className="relative" ref={ref}>
            {/* Bottone trigger */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2.5 text-[#FAF0E6] bg-[#3B2010]/80 px-4 py-2
                    border border-[#3B2010]/60 hover:bg-[#3B2010] transition-all duration-300 cursor-pointer"
                aria-expanded={open}
                aria-haspopup="true"
            >
                <span
                    className="w-6 h-6 rounded-full bg-[#9A6840] flex items-center justify-center
                    text-[0.6rem] font-semibold tracking-wide text-white select-none"
                >
                    {user.name?.[0]?.toUpperCase()}
                    {user.surname?.[0]?.toUpperCase()}
                </span>
                <span className="flex flex-col gap-[3px]">
                    <span
                        className={`block w-4 h-px bg-[#FAF0E6] transition-all duration-300 origin-center
                        ${open ? 'translate-y-[4px] rotate-45' : ''}`}
                    />
                    <span
                        className={`block w-4 h-px bg-[#FAF0E6] transition-all duration-300
                        ${open ? 'opacity-0' : ''}`}
                    />
                    <span
                        className={`block w-4 h-px bg-[#FAF0E6] transition-all duration-300 origin-center
                        ${open ? '-translate-y-[4px] -rotate-45' : ''}`}
                    />
                </span>
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    role="menu"
                    className="absolute right-0 mt-2 w-52 bg-white border border-[#E8C9A0]
                    rounded-xl shadow-lg overflow-hidden z-50"
                >
                    {/* Nome utente — non cliccabile */}
                    <div className="px-4 py-3 border-b border-[#E8C9A0] bg-[#FAF5EE]">
                        <p className="text-[0.6rem] text-[#9A6840] uppercase tracking-widest mb-0.5">
                            {role === 'admin' ? 'Amministratore' : 'Cliente'}
                        </p>
                        <p className="text-sm font-medium text-[#3B2010] truncate">
                            {user.name} {user.surname}
                        </p>
                    </div>

                    {/* Voci menu */}
                    <div className="py-1">
                        {items.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                role="menuitem"
                                onClick={() => setOpen(false)}
                                className="block px-4 py-2.5 text-sm text-[#6B4828]
                                    hover:bg-[#FAF0E6] hover:text-[#3B2010] transition-colors duration-150"
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-[#E8C9A0] py-1">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600
                                hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                        >
                            Esci
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
