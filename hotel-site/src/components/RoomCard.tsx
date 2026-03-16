import { Link } from 'react-router-dom'
import type { Room } from '../types/Room'
import { typeLabels, typeBadgeColors } from '../data/roomUtils'

export default function RoomCard({ room }: { room: Room }) {
    return (
        <div
            className={`bg-white rounded-2xl shadow-md overflow-hidden transition-shadow duration-300 flex flex-col
                ${room.available ? 'hover:shadow-xl' : 'opacity-75'}`}
        >
            <div className="relative h-52 overflow-hidden">
                <img
                    src={room.images[0]}
                    alt={room.name}
                    className={`w-full h-full object-cover transition-transform duration-500
                        ${room.available ? 'hover:scale-105' : ''}`}
                />
                <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${typeBadgeColors[room.type]}`}>
                    {typeLabels[room.type]}
                </span>
                {!room.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                            Non disponibile
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-[#6B4828] mb-2">{room.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {room.capacity}
                    </span>
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        {room.size} m²
                    </span>
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <p className="text-[#6B4828]">
                        <span className="text-xl font-bold">€{room.pricePerNight}</span>
                        <span className="text-sm text-gray-500"> / notte</span>
                    </p>
                    {room.available ? (
                        <Link
                            to={`/rooms/${room.id}`}
                            className="text-sm font-semibold text-white bg-[#6B4828] px-4 py-2 rounded-lg hover:bg-[#3B2010] transition"
                        >
                            Scopri di più
                        </Link>
                    ) : (
                        <span className="text-sm font-medium text-gray-400 bg-gray-100 px-4 py-2 rounded-lg cursor-not-allowed">
                            Non disponibile
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
