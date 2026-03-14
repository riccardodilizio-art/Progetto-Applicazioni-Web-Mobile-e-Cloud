import type { RoomType } from '../types/Room'

export const typeLabels: Record<RoomType, string> = {
    singola: 'Singola',
    doppia: 'Doppia',
    deluxe: 'Deluxe',
    suite: 'Suite',
}

export const typeBadgeColors: Record<RoomType, string> = {
    singola: 'bg-[#6B4828] text-white',
    doppia: 'bg-[#9A6840] text-white',
    deluxe: 'bg-[#C4A070] text-[#6B4828]',
    suite: 'bg-[#E8C9A0] text-[#6B4828]',
}
