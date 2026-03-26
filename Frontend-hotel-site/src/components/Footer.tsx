import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="bg-[#3B2010] text-[#E8C9A0]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Info Hotel */}
                    <div>
                        <h3 className="text-lg font-bold mb-2 text-white">Hotel Excelsior</h3>
                        <p className="text-[#C4A070] text-sm">Viale Trieste 126, 61121 Pesaro, Marche, Italia</p>
                        <p className="text-[#C4A070] text-sm mt-1">Tel: +39 333 640 5167</p>
                        <p className="text-[#C4A070] text-sm">Email: info@hotelexcelsior.it</p>
                    </div>

                    {/* Link rapidi */}
                    <div>
                        <h3 className="text-lg font-bold mb-2 text-white">Link Rapidi</h3>
                        <div className="space-y-1">
                            <Link to="/" className="block text-[#C4A070] text-sm hover:text-white transition">
                                Home
                            </Link>
                            <Link to="/camere" className="block text-[#C4A070] text-sm hover:text-white transition">
                                Camere
                            </Link>
                            <Link to="/menu" className="block text-[#C4A070] text-sm hover:text-white transition">
                                Ristorante
                            </Link>
                            <Link to="/contatti" className="block text-[#C4A070] text-sm hover:text-white transition">
                                Contatti
                            </Link>
                            <Link
                                to="/admin/accedi"
                                className="block text-[#C4A070] text-sm hover:text-white transition"
                            >
                                Area Admin
                            </Link>
                        </div>
                    </div>

                    {/* Orari */}
                    <div>
                        <h3 className="text-lg font-bold mb-2 text-white">Orari</h3>
                        <p className="text-[#C4A070] text-sm">Check-in: dalle 15:00 alle 22:00</p>
                        <p className="text-[#C4A070] text-sm">Check-out: entro le 11:00</p>
                        <p className="text-[#C4A070] text-sm mt-1">Reception: 24h/24</p>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-[#6B4828] mt-4 pt-4 text-center text-[#9A6840] text-sm">
                    <p>&copy; {new Date().getFullYear()} Hotel Excelsior. Tutti i diritti riservati.</p>
                </div>
            </div>
        </footer>
    )
}
