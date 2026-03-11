import type { Service } from '../types/Service';

export const services: Service[] = [
    {
        title: 'Piscina Panoramica',
        description: 'Rilassati nella nostra piscina con vista mare, aperta da maggio a settembre.',
        icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 17.25V21h18v-3.75M3 17.25c1.5 1 3 1.5 4.5 1.5s3-.5 4.5-1.5c1.5 1 3 1.5 4.5 1.5s3-.5 4.5-1.5M12 3v9m-3-3l3 3 3-3" />`,
    },
    {
        title: 'Ristorante Gourmet',
        description: 'Cucina marchigiana e piatti internazionali preparati dal nostro chef stellato.',
        icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 8v2m8-4a8 8 0 11-16 0 8 8 0 0116 0z" />`,
    },
    {
        title: 'Spa & Benessere',
        description: 'Centro benessere con sauna, bagno turco, massaggi e trattamenti personalizzati.',
        icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />`,
    },
    {
        title: 'Spiaggia Privata',
        description: 'Accesso diretto alla spiaggia riservata con ombrelloni, lettini e servizio bar.',
        icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.95 7.95l-.71-.71M4.76 4.76l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />`,
    },
]