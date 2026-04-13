import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { rooms } from '../../data/Rooms'
import { EMPTY_ROOM_FORM } from '../../data/roomUtils'
import { roomToForm, validateRoomForm } from '../../components/admin/roomForm/roomFormUtils'
import type { RoomFormData, RoomFormErrors } from '../../types/Room'
import RoomFormHeader from '../../components/admin/roomForm/RoomFormHeader'
import RoomInfoSection from '../../components/admin/roomForm/RoomInfoSection'
import RoomDetailsSection from '../../components/admin/roomForm/RoomDetailsSection'
import RoomAmenitiesSection from '../../components/admin/roomForm/RoomAmenitiesSection'
import RoomImagesSection from '../../components/admin/roomForm/RoomImagesSection'

export default function RoomForm() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const isEdit = id !== undefined
    const existingRoom = isEdit ? rooms.find((r) => r.id === id) : undefined
    const [isLoading, setIsLoading] = useState(false)

    const [form, setForm] = useState<RoomFormData>(existingRoom ? roomToForm(existingRoom) : EMPTY_ROOM_FORM)
    const [errors, setErrors] = useState<RoomFormErrors>({})

    function handleChange(field: keyof RoomFormData, value: string | boolean) {
        setForm((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    function handleAddAmenity(amenity: string) {
        setForm((prev) => ({ ...prev, amenities: [...prev.amenities, amenity] }))
    }

    function handleRemoveAmenity(amenity: string) {
        setForm((prev) => ({ ...prev, amenities: prev.amenities.filter((a) => a !== amenity) }))
    }

    function handleAddImage(url: string) {
        setForm((prev) => ({ ...prev, images: [...prev.images, url] }))
        if (errors.images) setErrors((prev) => ({ ...prev, images: undefined }))
    }

    function handleRemoveImage(url: string) {
        setForm((prev) => ({ ...prev, images: prev.images.filter((i) => i !== url) }))
    }

    function handleMoveImage(index: number, direction: 'up' | 'down') {
        const newImages = [...form.images]
        const swap = direction === 'up' ? index - 1 : index + 1
        if (swap < 0 || swap >= newImages.length) return
        ;[newImages[index], newImages[swap]] = [newImages[swap], newImages[index]]
        setForm((prev) => ({ ...prev, images: newImages }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const newErrors = validateRoomForm(form)
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            document.querySelector('[data-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            return
        }
        setIsLoading(true)
        try {
            // TODO: chiamata API
            navigate('/admin/dashboard')
        } finally {
            setIsLoading(false)
        }
    }

    if (isEdit && !existingRoom) {
        return (
            <div className="min-h-screen bg-[#FAF5EE] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-[#3B2010] text-xl font-heading mb-2">Camera non trovata</p>
                    <p className="text-[#9A6840] text-sm mb-6">L'ID #{id} non corrisponde a nessuna camera.</p>
                    <Link
                        to="/admin/dashboard"
                        className="bg-[#3B2010] text-white text-sm px-5 py-2.5 rounded-lg hover:bg-[#6B4828] transition-colors"
                    >
                        Torna alla Dashboard
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FAF5EE]">
            <RoomFormHeader isEdit={isEdit} roomName={existingRoom?.name} />
            <form onSubmit={handleSubmit} noValidate>
                <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
                    <RoomInfoSection
                        data={{
                            name: form.name,
                            type: form.type,
                            roomNumber: form.roomNumber,
                            floor: form.floor,
                            available: form.available,
                        }}
                        errors={{ name: errors.name, roomNumber: errors.roomNumber, floor: errors.floor }}
                        onChange={handleChange}
                    />
                    <RoomDetailsSection
                        data={{
                            description: form.description,
                            pricePerNight: form.pricePerNight,
                            capacity: form.capacity,
                            size: form.size,
                        }}
                        errors={{
                            description: errors.description,
                            pricePerNight: errors.pricePerNight,
                            capacity: errors.capacity,
                            size: errors.size,
                        }}
                        onChange={handleChange}
                    />
                    <RoomAmenitiesSection
                        amenities={form.amenities}
                        onAdd={handleAddAmenity}
                        onRemove={handleRemoveAmenity}
                    />
                    <RoomImagesSection
                        images={form.images}
                        error={errors.images}
                        onAdd={handleAddImage}
                        onRemove={handleRemoveImage}
                        onMove={handleMoveImage}
                    />
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pb-8">
                        <Link
                            to="/admin/dashboard"
                            className="text-center text-sm text-[#6B4828] border border-[#C4A070] px-6 py-2.5 rounded-lg hover:bg-[#FAF5EE] transition-colors"
                        >
                            Annulla
                        </Link>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`bg-[#3B2010] text-white text-sm font-medium px-8 py-2.5 rounded-lg transition-colors
        ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#6B4828]'}`}
                        >
                            {isLoading ? 'Salvataggio...' : isEdit ? 'Salva Modifiche' : 'Crea Camera'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
