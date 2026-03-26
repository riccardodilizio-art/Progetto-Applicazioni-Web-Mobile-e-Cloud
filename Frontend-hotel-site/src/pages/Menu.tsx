import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Dish } from '../types/Menu'
import { breakfastItems, lunchItems, weeklyMenu } from '../data/Menu'

const categoryConfig: Record<Dish['category'], { label: string; bg: string; text: string; border: string }> = {
    pesce: { label: 'Pesce', bg: 'bg-[#D9EEF5]', text: 'text-[#1A6B8A]', border: 'border-[#A8D4E6]' },
    carne: { label: 'Carne', bg: 'bg-[#F5E0D8]', text: 'text-[#8A3820]', border: 'border-[#E6B8A8]' },
    vegetariano: { label: 'Vegetariano', bg: 'bg-[#E0F0D8]', text: 'text-[#3A6B28]', border: 'border-[#B8D8A8]' },
}

function DishCard({ dish }: { dish: Dish }) {
    const cfg = categoryConfig[dish.category]
    return (
        <div className="border border-[#E8C9A0] rounded-xl p-4 bg-[#FAF5EE] hover:shadow-md transition-shadow duration-200 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
                <h5 className="text-[#3B2010] text-sm font-medium leading-snug flex-1">{dish.name}</h5>
                <span
                    className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                >
                    {cfg.label}
                </span>
            </div>
            <p className="text-[#9A6840] text-xs leading-relaxed">{dish.description}</p>
        </div>
    )
}

export default function Menu() {
    const [selectedDay, setSelectedDay] = useState(0)

    const currentMenu = weeklyMenu[selectedDay]

    return (
        <div className="min-h-screen bg-[#FAF0E6]">
            {/* Hero */}
            <section
                className="relative h-72 md:h-96 bg-cover bg-center"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80)',
                }}
            >
                <div className="absolute inset-0 bg-[#3B2010]/60" />
                <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                    <p className="text-[#E8C9A0] tracking-[0.3em] uppercase text-sm mb-3 font-light">
                        Hotel Excelsior · Pesaro
                    </p>
                    <h1 className="font-heading text-5xl md:text-6xl font-light text-white mb-4">
                        Il Nostro Ristorante
                    </h1>
                    <p className="text-[#E8C9A0] text-lg max-w-xl font-light">
                        Sapori autentici della tradizione marchigiana e adriatica
                    </p>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4 py-16">
                {/* Titolo */}
                <div className="text-center mb-14">
                    <h2 className="font-heading text-3xl md:text-4xl text-[#3B2010] font-light mb-4">
                        Menù Settimanale
                    </h2>
                    <p className="text-[#9A6840] max-w-2xl mx-auto leading-relaxed">
                        Ogni giorno proponiamo una selezione curata di piatti ispirati alla ricca tradizione culinaria
                        di Pesaro e del Montefeltro, valorizzando i prodotti locali e le eccellenze dell'Adriatico.
                    </p>
                </div>

                {/* Cards orari */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E8C9A0] p-6 text-center">
                        <div className="w-12 h-12 bg-[#E8C9A0] rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                aria-hidden="true"
                                className="w-6 h-6 text-[#6B4828]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364-.707-.707M6.343 6.343l-.707-.707m12.728 0-.707.707M6.343 17.657l-.707.707"
                                />
                            </svg>
                        </div>
                        <h3 className="font-heading text-xl text-[#3B2010] font-medium mb-1">Colazione</h3>
                        <p className="text-[#9A6840] text-sm mb-4">07:00 — 10:30</p>
                        <span className="inline-block bg-[#E8C9A0] text-[#6B4828] text-xs font-medium px-3 py-1 rounded-full">
                            Buffet incluso
                        </span>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E8C9A0] p-6 text-center">
                        <div className="w-12 h-12 bg-[#E8C9A0] rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                aria-hidden="true"
                                className="w-6 h-6 text-[#6B4828]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="font-heading text-xl text-[#3B2010] font-medium mb-1">Pranzo</h3>
                        <p className="text-[#9A6840] text-sm mb-4">12:30 — 14:30</p>
                        <span className="inline-block bg-[#E8C9A0] text-[#6B4828] text-xs font-medium px-3 py-1 rounded-full">
                            Buffet incluso
                        </span>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E8C9A0] p-6 text-center">
                        <div className="w-12 h-12 bg-[#E8C9A0] rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                aria-hidden="true"
                                className="w-6 h-6 text-[#6B4828]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                />
                            </svg>
                        </div>
                        <h3 className="font-heading text-xl text-[#3B2010] font-medium mb-1">Cena</h3>
                        <p className="text-[#9A6840] text-sm mb-4">19:30 — 22:00</p>
                        <span className="inline-block bg-[#3B2010] text-[#E8C9A0] text-xs font-medium px-3 py-1 rounded-full">
                            Prenotazione richiesta
                        </span>
                    </div>
                </div>

                {/* Selettore giorno */}
                <div className="flex gap-2 flex-wrap justify-center mb-12">
                    {weeklyMenu.map((d) => (
                        <button
                            key={d.id}
                            onClick={() => setSelectedDay(d.id)}
                            aria-pressed={selectedDay === d.id}
                            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                selectedDay === d.id
                                    ? 'bg-[#3B2010] text-[#E8C9A0] shadow-md'
                                    : 'bg-white text-[#6B4828] border border-[#C4A070] hover:bg-[#E8C9A0]'
                            }`}
                        >
                            {d.day}
                        </button>
                    ))}
                </div>

                <div className="space-y-10">
                    {/* Colazione */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E8C9A0] overflow-hidden">
                        <div className="bg-[#FAF0E6] border-b border-[#E8C9A0] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <h3 className="font-heading text-2xl text-[#3B2010] font-medium">Colazione a Buffet</h3>
                                <p className="text-[#9A6840] text-sm mt-0.5">Ogni giorno dalle 07:00 alle 10:30</p>
                            </div>
                            <span className="self-start sm:self-auto bg-[#E8C9A0] text-[#6B4828] text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                                Inclusa nel soggiorno
                            </span>
                        </div>
                        <div className="p-6">
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {breakfastItems.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C4A070] flex-shrink-0" />
                                        <span className="text-[#6B4828] text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Pranzo */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E8C9A0] overflow-hidden">
                        <div className="bg-[#FAF0E6] border-b border-[#E8C9A0] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <h3 className="font-heading text-2xl text-[#3B2010] font-medium">Pranzo a Buffet</h3>
                                <p className="text-[#9A6840] text-sm mt-0.5">Ogni giorno dalle 12:30 alle 14:30</p>
                            </div>
                            <span className="self-start sm:self-auto bg-[#E8C9A0] text-[#6B4828] text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                                Incluso nel soggiorno
                            </span>
                        </div>
                        <div className="p-6">
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {lunchItems.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C4A070] flex-shrink-0" />
                                        <span className="text-[#6B4828] text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Cena */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E8C9A0] overflow-hidden">
                        <div className="bg-[#3B2010] px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <h3 className="font-heading text-2xl text-white font-medium">
                                    Cena — {currentMenu.day}
                                </h3>
                                <p className="text-[#E8C9A0] text-sm mt-0.5">
                                    Dalle 19:30 alle 22:00 · Prenotazione obbligatoria entro le 17:00
                                </p>
                            </div>
                            <span className="self-start sm:self-auto bg-[#E8C9A0]/20 text-[#E8C9A0] border border-[#E8C9A0]/30 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                                Antipasti &amp; dolci a buffet
                            </span>
                        </div>
                        <div className="p-6 space-y-8">
                            <div>
                                <h4 className="font-heading text-lg text-[#3B2010] font-medium mb-3 pb-2 border-b border-[#E8C9A0]">
                                    Antipasti — sempre a buffet
                                </h4>
                                <p className="text-[#9A6840] text-sm leading-relaxed">
                                    Selezione di antipasti freddi e caldi del territorio: affettati e formaggi della
                                    tradizione marchigiana, bruschette con prodotti locali, crudité di verdure,
                                    fritturine di paranza, insalata di polpo adriatico e verdure grigliate. Incluso per
                                    tutti gli ospiti della cena.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-heading text-lg text-[#3B2010] font-medium mb-4 pb-2 border-b border-[#E8C9A0]">
                                    Primi Piatti — uno a scelta
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {currentMenu.dinner.primi.map((dish) => (
                                        <DishCard key={dish.name} dish={dish} />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-heading text-lg text-[#3B2010] font-medium mb-4 pb-2 border-b border-[#E8C9A0]">
                                    Secondi Piatti — uno a scelta
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {currentMenu.dinner.secondi.map((dish) => (
                                        <DishCard key={dish.name} dish={dish} />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-heading text-lg text-[#3B2010] font-medium mb-3 pb-2 border-b border-[#E8C9A0]">
                                    Dolci — sempre a buffet
                                </h4>
                                <p className="text-[#9A6840] text-sm leading-relaxed">
                                    Dolci della tradizione marchigiana: ciambella al vino cotto, frustingo pesarese,
                                    cavallucci di Urbino, crostate artigianali, tiramisù dello chef, gelato artigianale
                                    e frutta di stagione. Incluso per tutti gli ospiti della cena.
                                </p>
                            </div>

                            <div className="bg-[#FAF0E6] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-[#3B2010] font-medium text-sm mb-1">
                                        Prenota la tua cena per {currentMenu.day}
                                    </p>
                                    <p className="text-[#9A6840] text-xs leading-relaxed">
                                        La prenotazione è richiesta entro le 17:00 del giorno stesso. Accedi con le
                                        credenziali della tua camera d'hotel.
                                    </p>
                                </div>
                                <Link
                                    to="/ristorante"
                                    className="bg-[#3B2010] text-[#E8C9A0] px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#6B4828] transition-colors duration-200 whitespace-nowrap flex-shrink-0 text-center"
                                >
                                    Prenota la Cena
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
