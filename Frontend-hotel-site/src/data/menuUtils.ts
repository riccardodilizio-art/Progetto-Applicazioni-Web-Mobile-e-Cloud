import type {
    ApiDayOfWeek,
    DishCategory,
    MenuFormData,
    MenuFormDishEntry,
    MenuFormErrors,
} from '../types/Menu'

export const DAY_ORDER: ApiDayOfWeek[] = [
    'LUNEDI',
    'MARTEDI',
    'MERCOLEDI',
    'GIOVEDI',
    'VENERDI',
    'SABATO',
    'DOMENICA',
]

export const DAY_LABELS: Record<ApiDayOfWeek, string> = {
    LUNEDI: 'Lunedì',
    MARTEDI: 'Martedì',
    MERCOLEDI: 'Mercoledì',
    GIOVEDI: 'Giovedì',
    VENERDI: 'Venerdì',
    SABATO: 'Sabato',
    DOMENICA: 'Domenica',
}

export const CATEGORY_OPTIONS: { value: DishCategory; label: string }[] = [
    { value: 'pesce', label: 'Pesce' },
    { value: 'carne', label: 'Carne' },
    { value: 'vegetariano', label: 'Vegetariano' },
]

export function emptyDish(): MenuFormDishEntry {
    return {
        id: crypto.randomUUID(),
        name: '',
        description: '',
        category: 'carne',
    }
}

export function emptyMenuForm(day: ApiDayOfWeek = 'LUNEDI'): MenuFormData {
    return {
        day,
        primi: [emptyDish()],
        secondi: [emptyDish()],
    }
}

export function validateMenuForm(data: MenuFormData): MenuFormErrors {
    const errors: MenuFormErrors = {}

    if (data.primi.length === 0) errors.primi = 'Almeno un primo piatto è obbligatorio'
    if (data.secondi.length === 0) errors.secondi = 'Almeno un secondo piatto è obbligatorio'

    const dishErrors: Record<string, { name?: string }> = {}
    for (const dish of [...data.primi, ...data.secondi]) {
        if (!dish.name.trim()) dishErrors[dish.id] = { name: 'Il nome è obbligatorio' }
    }
    if (Object.keys(dishErrors).length > 0) errors.dishes = dishErrors

    return errors
}
