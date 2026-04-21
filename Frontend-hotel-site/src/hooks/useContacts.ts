import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../lib/apiClient';

export type Contact = {
    idContact: string;
    nome: string;
    email: string;
    telefono: string | null;
    messaggio: string;
    dataCreazione: string;
};

type PagedContacts = {
    items: Contact[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
};

export function useContacts() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const reload = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiFetch<PagedContacts>('/contacts?page=1&pageSize=100');
            setContacts(data.items);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Errore sconosciuto');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { reload(); }, [reload]);

    return { contacts, loading, error, reload };
}
