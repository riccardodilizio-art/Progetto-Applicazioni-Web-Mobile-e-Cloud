import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-6xl font-bold text-[#1a2e4a]">404</h1>
            <p className="text-gray-600 mt-4">Pagina non trovata</p>
            <Link to="/" className="mt-6 text-[#1a2e4a] underline hover:opacity-70">
                Torna alla Home
            </Link>
        </div>
    )
}
