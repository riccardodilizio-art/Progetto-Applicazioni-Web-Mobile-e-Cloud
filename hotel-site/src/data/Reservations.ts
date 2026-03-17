import type { RoomReservation, DinnerReservation } from '../types/Reservation'

export const mockRoomReservations: RoomReservation[] = [
    {
        id: 'R001',
        userEmail: 'cliente@hotelexcelsior.it',
        roomName: 'Camera Doppia Vista Mare',
        roomType: 'doppia',
        roomCapacity: 2,
        dinnerCode: '48291',
        checkIn: '2025-07-14',
        checkOut: '2025-07-21',
        nights: 7,
        pricePerNight: 180,
        totalPrice: 1260,
        status: 'confermata',
    },
    {
        id: 'R002',
        userEmail: 'cliente@hotelexcelsior.it',
        roomName: 'Suite Excelsior',
        roomType: 'suite',
        roomCapacity: 4,
        dinnerCode: '73915',
        checkIn: '2025-12-26',
        checkOut: '2026-12-31',
        nights: 7,
        pricePerNight: 420,
        totalPrice: 2940,
        status: 'in_attesa',
    },
]

export const mockDinnerReservations: DinnerReservation[] = [
    {
        id: 'D001',
        dinnerCode: '48291',
        date: '2025-07-14',
        day: 'Lunedì',
        totalCovers: 2,
        orders: [
            {
                coverNumber: 1,
                primo: "Spaghetti alle Vongole Veraci dell'Adriatico",
                secondo: 'Tagliata di Manzo Marchigiana',
            },
            {
                coverNumber: 2,
                primo: 'Risotto ai Funghi Porcini e Tartufo di Acqualagna',
                secondo: 'Parmigiana di Melanzane al Forno',
            },
        ],
        status: 'confermata',
    },
    {
        id: 'D002',
        dinnerCode: '48291',
        date: '2025-07-15',
        day: 'Martedì',
        totalCovers: 2,
        orders: [
            {
                coverNumber: 1,
                primo: 'Linguine al Brodetto Pesarese',
                secondo: 'Sogliola alla Mugnaia',
            },
            {
                coverNumber: 2,
                primo: 'Maccheroncini di Campofilone al Ragù di Vitello',
                secondo: 'Pollo alla Cacciatora Marchigiana',
            },
        ],
        status: 'bozza',
    },
]
