import { rooms } from '../../../data/Rooms'
import type { RoomFormData, RoomFormErrors } from '../../../types/Room'

export function roomToForm(room: (typeof rooms)[0]): RoomFormData {
    return {
        name: room.name,
        type: room.type,
        description: room.description,
        pricePerNight: String(room.pricePerNight),
        capacity: String(room.capacity),
        size: String(room.size),
        floor: String(room.floor),
        roomNumber: String(room.roomNumber),
        amenities: [...room.amenities],
        images: [...room.images],
        available: room.available,
    }
}

export function validateRoomForm(data: RoomFormData): RoomFormErrors {
    const errors: RoomFormErrors = {}
    if (!data.name.trim()) errors.name = 'Il nome è obbligatorio'
    if (!data.description.trim()) errors.description = 'La descrizione è obbligatoria'
    const price = Number(data.pricePerNight)
    if (!data.pricePerNight || isNaN(price) || price <= 0)
        errors.pricePerNight = 'Inserisci un prezzo valido (> 0)'
    const cap = Number(data.capacity)
    if (!data.capacity || isNaN(cap) || cap < 1 || cap > 10)
        errors.capacity = 'Capacità tra 1 e 10 ospiti'
    const size = Number(data.size)
    if (!data.size || isNaN(size) || size <= 0)
        errors.size = 'Inserisci una dimensione valida'
    const floor = Number(data.floor)
    if (data.floor === '' || isNaN(floor) || floor < 0)
        errors.floor = 'Inserisci un piano valido (≥ 0)'
    const rn = Number(data.roomNumber)
    if (!data.roomNumber || isNaN(rn) || rn <= 0)
        errors.roomNumber = 'Inserisci un numero camera valido'
    if (data.images.length === 0)
        errors.images = "Aggiungi almeno un'immagine"
    return errors
}
