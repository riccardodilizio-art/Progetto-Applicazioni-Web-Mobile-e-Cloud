import { Link } from 'react-router-dom';
import type { Room, RoomType } from '../types/Room';

const typeBadgeColors: Record<RoomType, string> = {
    singola: 'bg-[#6B4828] text-white',
    doppia: 'bg-[#9A6840] text-white',
    deluxe: 'bg-[#C4A070] text-[#3B2010]',
    suite: 'bg-[#E8C9A0] text-[#3B2010]',
};

const typeLabels: Record<RoomType, string> = {
    singola: 'Singola',
    doppia: 'Doppia',
    deluxe: 'Deluxe',
    suite: 'Suite',
};

export default function RoomCard({ room }: { room: Room }) {
    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
            {/* Immagine */}
            <div className="relative h-52 overflow-hidden">
                <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                {/* Badge tipo */}
                <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${typeBadgeColors[room.type]}`}>
                    {typeLabels[room.type]}
                </span>
                {/* Overlay non disponibile */}
                {!room.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                            Non disponibile
                        </span>
                    </div>
                )}
            </div>

            {/* Contenuto */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-[#1a2e4a] mb-2">{room.name}</h3>

                {/* Info rapide */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {room.capacity}
                    </span>
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        {room.size} m²
                    </span>
                </div>

                {/* Prezzo */}
                <div className="mt-auto flex items-center justify-between">
                    <p className="text-[#1a2e4a]">
                        <span className="text-xl font-bold">€{room.pricePerNight}</span>
                        <span className="text-sm text-gray-500"> / notte</span>
                    </p>
                    <Link
                        to={`/rooms/${room.id}`}
                        className="text-sm font-semibold text-white bg-[#1a2e4a] px-4 py-2 rounded-lg hover:bg-[#2a4a6a] transition"
                    >
                        Scopri di più
                    </Link>
                </div>
            </div>
        </div>
    );
}
