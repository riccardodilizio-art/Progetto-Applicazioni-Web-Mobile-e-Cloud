import { useMemo, useState } from 'react';
import { useContacts } from '../../hooks/useContacts';
import { formatDate } from '../../lib/dateUtils';

export default function ContactsDashboard() {
    const { contacts, loading, error, reload } = useContacts();
    const [q, setQ] = useState('');

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return contacts;
        return contacts.filter(c =>
            c.nome.toLowerCase().includes(term) ||
            c.email.toLowerCase().includes(term) ||
            c.messaggio.toLowerCase().includes(term)
        );
    }, [contacts, q]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-[#3B2010]">Messaggi di contatto</h1>
                <button
                    onClick={reload}
                    className="px-4 py-2 bg-[#9A6840] text-white rounded hover:bg-[#7a4f2f] transition"
                >
                    Aggiorna
                </button>
            </div>

            <input
                type="text"
                placeholder="Cerca per nome, email o testo…"
                value={q}
                onChange={e => setQ(e.target.value)}
                className="w-full mb-6 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#9A6840]"
            />

            {loading && <p className="text-gray-500">Caricamento…</p>}
            {error && <p className="text-red-600">Errore: {error}</p>}

            {!loading && !error && filtered.length === 0 && (
                <p className="text-gray-500">Nessun messaggio.</p>
            )}

            <ul className="space-y-4">
                {filtered.map(c => (
                    <li key={c.idContact} className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <div className="font-semibold text-[#3B2010]">{c.nome}</div>
                                <a href={`mailto:${c.email}`} className="text-sm text-[#9A6840] hover:underline">
                                    {c.email}
                                </a>
                                {c.telefono && (
                                    <span className="ml-3 text-sm text-gray-600">· {c.telefono}</span>
                                )}
                            </div>
                            <span className="text-xs text-gray-500">{formatDate(c.dataCreazione)}</span>
                        </div>
                        <p className="text-gray-800 whitespace-pre-wrap">{c.messaggio}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
