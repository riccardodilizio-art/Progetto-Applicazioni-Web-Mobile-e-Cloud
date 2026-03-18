import { Link } from 'react-router-dom'

export default function EmptyState({ message, cta }: { message: string; cta: { label: string; to: string } }) {
    return (
        <div className="bg-white rounded-2xl border border-[#E8C9A0] p-12 text-center shadow-sm">
            <p className="text-[#9A6840] text-sm mb-5">{message}</p>
            <Link
                to={cta.to}
                className="inline-block bg-[#3B2010] text-[#E8C9A0] px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#6B4828] transition-colors duration-200"
            >
                {cta.label}
            </Link>
        </div>
    )
}
