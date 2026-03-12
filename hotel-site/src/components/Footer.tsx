import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Info Hotel */}
                    <div>
                        <h3 className="text-lg font-bold mb-2">🏨 Hotel Excelsior</h3>
                        <p className="text-gray-400 text-sm">
                            Viale Trieste 126, 61121 Pesaro, Marche, Italia
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                            Tel: +39 333 640 5167
                        </p>
                        <p className="text-gray-400 text-sm">
                            Email: info@hotelexcelsior.it
                        </p>
                    </div>

                    {/* Link rapidi */}
                    <div>
                        <h3 className="text-lg font-bold mb-2">Link Rapidi</h3>
                        <div className="space-y-1">
                            <Link to="/" className="block text-gray-400 text-sm hover:text-white transition">
                                Home
                            </Link>
                            <Link to="/rooms" className="block text-gray-400 text-sm hover:text-white transition">
                                Camere
                            </Link>
                            <Link to="/menu" className="block text-gray-400 text-sm hover:text-white transition">
                                Ristorante
                            </Link>
                            <Link to="/contacts" className="block text-gray-400 text-sm hover:text-white transition">
                                Contatti
                            </Link>
                            <Link to="/admin/login" className="block text-gray-400 text-sm hover:text-white transition">
                                Area Admin
                            </Link>
                        </div>
                    </div>

                    {/* Orari */}
                    <div>
                        <h3 className="text-lg font-bold mb-2">Orari</h3>
                        <p className="text-gray-400 text-sm">Check-in: dalle 15:00 alle 22:00</p>
                        <p className="text-gray-400 text-sm">Check-out: entro le 11:00</p>
                        <p className="text-gray-400 text-sm mt-1">Reception: 24h/24</p>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-700 mt-4 pt-4 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Hotel Excelsior. Tutti i diritti riservati.</p>
                </div>
            </div>
        </footer>
    )
}
