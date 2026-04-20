import { Link, useLocation } from 'react-router-dom'

type Tab = {
    to: string
    label: string
    matches: string[]
}

const tabs: Tab[] = [
    { to: '/admin/dashboard', label: 'Camere', matches: ['/admin/dashboard', '/admin/camere'] },
    { to: '/admin/menu', label: 'Menu', matches: ['/admin/menu'] },
    { to: '/admin/prenotazioni', label: 'Prenotazioni', matches: ['/admin/prenotazioni'] },
    { to: '/admin/contatti', label: 'Contatti', matches: ['/admin/contatti'] },
]


export default function AdminNav() {
    const { pathname } = useLocation()

    return (
        <nav className="bg-white border-b border-[#E8C9A0]">
            <div className="max-w-6xl mx-auto px-6 flex gap-6">
                {tabs.map((t) => {
                    const isActive = t.matches.some((m) => pathname.startsWith(m))
                    return (
                        <Link
                            key={t.to}
                            to={t.to}
                            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                                isActive
                                    ? 'border-[#3B2010] text-[#3B2010]'
                                    : 'border-transparent text-[#9A6840] hover:text-[#6B4828]'
                            }`}
                        >
                            {t.label}
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
