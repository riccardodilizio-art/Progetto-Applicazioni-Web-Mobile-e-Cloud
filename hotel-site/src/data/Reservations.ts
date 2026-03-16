import type { RoomReservation, DinnerReservation } from '../types/Reservation'

export const mockRoomReservations: RoomReservation[] = [
    {
        id: 'R001',
        roomName: 'Camera Doppia Vista Mare',
        roomType: 'doppia',
        checkIn: '2025-07-14',
        checkOut: '2025-07-21',
        nights: 7,
        pricePerNight: 180,
        totalPrice: 1260,
        status: 'confermata',
    },
    {
        id: 'R002',
        roomName: 'Suite Excelsior',
        roomType: 'suite',
        checkIn: '2025-12-26',
        checkOut: '2026-01-02',
        nights: 7,
        pricePerNight: 420,
        totalPrice: 2940,
        status: 'in_attesa',
    },
]

export const mockDinnerReservations: DinnerReservation[] = [
    {
        id: 'D001',
        date: '2025-07-14',
        day: 'Lunedì',
        primo: "Spaghetti alle Vongole Veraci dell'Adriatico",
        secondo: 'Tagliata di Manzo Marchigiana',
        status: 'confermata',
    },
    {
        id: 'D002',
        date: '2025-07-15',
        day: 'Martedì',
        primo: 'Linguine al Brodetto Pesarese',
        secondo: 'Sogliola alla Mugnaia',
        status: 'confermata',
    },
    {
        id: 'D003',
        date: '2025-07-16',
        day: 'Mercoledì',
        primo: 'Risotto ai Frutti di Mare Adriatici',
        secondo: 'Coniglio in Porchetta alla Pesarese',
        status: 'annullata',
    },
]
