import { Link } from 'react-router-dom'
import { rooms } from '../data/Rooms'
import { services } from '../data/Services'
import { useMemo } from 'react'

export default function Home() {
    const featuredRooms = useMemo(() => rooms.filter((r) => r.available).slice(0, 3), [rooms])
    return (
        <div>
            {/* ── Hero Section ── */}
            <section className="relative h-[85vh] min-h-[500px] overflow-hidden bg-hotel-dark">
                <img
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600"
                    alt="Vista esterna dell'Hotel Excelsior Pesaro"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-[#E8C9A0]/60" />

                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                    <p className="text-white/80 text-sm tracking-[0.3em] uppercase mb-4">Pesaro, Marche — Italia</p>
                    <h1 className="text-5xl md:text-7xl text-white font-light tracking-wide drop-shadow-lg font-heading">
                        Hotel Excelsior
                    </h1>
                    <p className="text-white/80 text-lg md:text-xl mt-4 max-w-xl">
                        Il tuo rifugio di eleganza sul mare Adriatico
                    </p>
                    <div className="flex gap-4 mt-8">
                        <Link
                            to="/rooms"
                            className="bg-white/90 text-[#3B2010] font-medium px-6 py-3 hover:bg-white transition text-sm tracking-[0.1em] uppercase border border-white/60"
                        >
                            Scopri le camere
                        </Link>
                        <Link
                            to="/contacts"
                            className="border border-white/70 text-white font-medium px-6 py-3 hover:bg-white/10 transition text-sm tracking-[0.1em] uppercase"
                        >
                            Contattaci
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Camere in Evidenza ── */}
            <section className="bg-[#FAF5EE] py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-sm tracking-[0.25em] uppercase text-[#9A6840] mb-2">Le nostre</p>
                        <h2 className="text-3xl md:text-4xl text-[#3B2010] font-light font-heading">
                            Camere in Evidenza
                        </h2>
                        <div className="w-12 h-px bg-[#C4A070] mx-auto mt-4" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredRooms.map((room) => (
                            <Link
                                key={room.id}
                                to={`/rooms/${room.id}`}
                                className="group block overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        loading="lazy"
                                        src={room.images[0]}
                                        alt={room.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 bg-[#E8C9A0]/90 backdrop-blur-sm text-[#3B2010] text-xs font-medium px-3 py-1">
                                        {room.pricePerNight}€ / notte
                                    </div>
                                </div>
                                <div className="p-5 border-t border-[#E8C9A0]/60">
                                    <h3 className="text-lg font-medium text-[#3B2010] font-heading">{room.name}</h3>
                                    <p className="text-xs text-[#9A6840] mt-1 tracking-wide uppercase">
                                        {room.size}m² &middot; {room.capacity}{' '}
                                        {room.capacity === 1 ? 'ospite' : 'ospiti'} &middot; {room.floor}° piano
                                    </p>
                                    <p className="text-sm text-gray-500 mt-3 line-clamp-2 leading-relaxed">
                                        {room.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link
                            to="/rooms"
                            className="inline-block border border-[#3B2010] text-[#3B2010] font-medium px-8 py-3 hover:bg-[#3B2010] hover:text-[#FAF5EE] transition-all duration-300 text-sm tracking-[0.15em] uppercase"
                        >
                            Vedi tutte le camere
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Servizi ── */}
            <section className="bg-[#F0E6D6] py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-sm tracking-[0.25em] uppercase text-[#9A6840] mb-2">Esperienza unica</p>
                        <h2 className="text-3xl md:text-4xl text-[#3B2010] font-light font-heading">
                            I Nostri Servizi
                        </h2>
                        <div className="w-12 h-px bg-[#C4A070] mx-auto mt-4" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service) => (
                            <div
                                key={service.title}
                                className="bg-[#FAF5EE] p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#E8C9A0]/60 text-[#3B2010] mb-4">
                                    {service.icon}
                                </div>

                                <h3 className="text-base font-medium text-[#3B2010] mb-2 font-heading">
                                    {service.title}
                                </h3>
                                <p className="text-sm text-[#6B4828]/70 leading-relaxed">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
