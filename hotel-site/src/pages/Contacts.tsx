import { useState } from "react";

export default function Contacts() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center relative"
            style={{
                backgroundImage: "url('/images/BackgroundContatti.png')",
            }}
        >
            {/* Overlay leggero */}
            <div className="absolute inset-0 bg-white/10" />

            {/* Contenuto pagina */}
            <div className="relative z-10 flex flex-col items-center px-4 pt-16 pb-12">

                {/* Hero text */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1a2e4a] drop-shadow mb-2">
                        Benvenuti all'Hotel Excelsior
                    </h1>
                    <p className="text-xl italic text-[#1a2e4a] drop-shadow mb-3">
                        Il tuo rifugio sul mare nelle Marche
                    </p>
                    <p className="text-[#1a2e4a] text-base md:text-lg drop-shadow mb-6">
                        Contattaci per prenotare il tuo soggiorno ideale a Pesaro.
                    </p>
                    <button className="border border-[#1a2e4a] text-[#1a2e4a] bg-white/40 backdrop-blur-sm px-6 py-2 rounded hover:bg-[#1a2e4a] hover:text-white transition font-medium">
                        Contattaci
                    </button>
                </div>

                {/* Card principale */}
                <div
                    className="w-full max-w-4xl rounded-2xl shadow-2xl p-8 backdrop-blur-md"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.82)" }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                        {/* ── Colonna sinistra: Informazioni ── */}
                        <div>
                            <h2 className="text-lg font-bold text-[#1a2e4a] mb-5">
                                Informazioni
                            </h2>

                            <div className="space-y-4 text-sm text-gray-700">
                                {/* Indirizzo */}
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#1a2e4a] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div>
                                        <p>Viale Trieste 129</p>
                                        <p>61121 Pesaro (PU), Marche, Italia</p>
                                    </div>
                                </div>

                                {/* Telefono */}
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#1a2e4a] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold">Telefono</p>
                                        <p>+39 333 640 5167</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#1a2e4a] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold">Email</p>
                                        <p>info@hotelexcelsior.it</p>
                                    </div>
                                </div>

                                {/* Orari */}
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#1a2e4a] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold">Orari</p>
                                        <p>Check in dalle 15:00 alle 22:00</p>
                                        <p>Check out entro le 11:00</p>
                                        <p>Reception: 24h/24</p>
                                    </div>
                                </div>
                            </div>

                            {/* Mappa Google Maps */}
                            <div className="mt-6 rounded-xl overflow-hidden h-44 shadow-md">
                                <iframe
                                    title="Mappa Hotel Excelsior Pesaro"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11497.130495135983!2d12.902055839615844!3d43.91212247365236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132d193fd568f455%3A0x4373c1af0cd16dec!2sViale%20Trieste%2C%20126%2C%2061121%20Pesaro%20PU!5e0!3m2!1sit!2sit!4v1773156437433!5m2!1sit!2sit"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>

                        {/* ── Colonna destra: Form ── */}
                        <div>
                            <h2 className="text-lg font-bold text-[#1a2e4a] mb-5">
                                Inviaci un messaggio
                            </h2>

                            {submitted ? (
                                <div className="text-center py-10">
                                    <svg className="w-14 h-14 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-green-700 font-semibold text-xl">Messaggio inviato!</p>
                                    <p className="text-gray-600 mt-2 text-sm">Ti risponderemo il prima possibile.</p>
                                    <button
                                        onClick={() => {
                                            setSubmitted(false);
                                            setFormData({ name: "", email: "", phone: "", message: "" });
                                        }}
                                        className="mt-5 text-[#1a2e4a] underline text-sm hover:opacity-70 transition"
                                    >
                                        Invia un altro messaggio
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome e Cognome*</label>
                                        <input type="text" name="name" required value={formData.name} onChange={handleChange}
                                               placeholder="Mario Rossi"
                                               className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2e4a] focus:border-transparent transition text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                                        <input type="email" name="email" required value={formData.email} onChange={handleChange}
                                               placeholder="mario@esempio.it"
                                               className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2e4a] focus:border-transparent transition text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                               placeholder="+39 000 000 0000"
                                               className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2e4a] focus:border-transparent transition text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Messaggio*</label>
                                        <textarea name="message" required rows={4} value={formData.message} onChange={handleChange}
                                                  placeholder="Scrivi qui il tuo messaggio..."
                                                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2e4a] focus:border-transparent transition resize-none text-sm" />
                                    </div>
                                    <button type="submit"
                                            className="w-full text-white font-semibold py-3 rounded-lg transition relative overflow-hidden"
                                            style={{ backgroundColor: "#1a2e4a" }}>
                                        <span className="relative z-10">Invia messaggio</span>
                                        <svg className="absolute bottom-0 left-0 w-full opacity-25" viewBox="0 0 400 24" preserveAspectRatio="none" style={{ height: "18px" }}>
                                            <path d="M0,12 C50,0 100,24 150,12 C200,0 250,24 300,12 C350,0 400,24 400,12 L400,24 L0,24 Z" fill="white" />
                                            <path d="M0,18 C50,6 100,24 150,18 C200,6 250,24 300,18 C350,6 400,24 400,18 L400,24 L0,24 Z" fill="white" opacity="0.5" />
                                        </svg>
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
