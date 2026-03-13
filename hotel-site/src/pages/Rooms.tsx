import { useState } from 'react';
import { rooms } from '../data/Rooms';
import RoomCard from '../components/RoomCard';
import type { RoomType } from '../types/Room';

const filters: { label: string; value: RoomType | 'all' }[] = [
    { label: 'Tutte', value: 'all' },
    { label: 'Singola', value: 'singola' },
    { label: 'Doppia', value: 'doppia' },
    { label: 'Deluxe', value: 'deluxe' },
    { label: 'Suite', value: 'suite' },
];

export default function Rooms() {
    const [activeFilter, setActiveFilter] = useState<RoomType | 'all'>('all');

    const filteredRooms = activeFilter === 'all'
        ? rooms
        : rooms.filter((r) => r.type === activeFilter);

    return (
        <div className="min-h-screen bg-[#FAF0E6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-[#3B2010] to-[#6B4828] text-white py-16 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">Le Nostre Camere</h1>
                <p className="text-lg text-white/80 max-w-xl mx-auto">
                    Scopri le camere dell'Hotel Excelsior: comfort, eleganza e vista mare per ogni esigenza.
                </p>
            </div>

            {/* Filtri */}
            <div className="flex flex-wrap justify-center gap-3 py-8 px-4">
                {filters.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setActiveFilter(f.value)}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                            activeFilter === f.value
                                ? 'bg-[#6B4828] text-white shadow-md'
                                : 'bg-white text-[#6B4828] border border-[#6B4828]/30 hover:bg-[#6B4828]/10'
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Griglia camere */}
            <div className="max-w-6xl mx-auto px-4 pb-16">
                {filteredRooms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRooms.map((room) => (
                            <RoomCard key={room.id} room={room} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-12 text-lg">
                        Nessuna camera trovata per questa categoria.
                    </p>
                )}
            </div>
        </div>
    );
}
