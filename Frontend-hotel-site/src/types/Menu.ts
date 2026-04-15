export type DishCategory = 'pesce' | 'carne' | 'vegetariano'

export interface Dish {
    name: string
    description: string
    category: DishCategory
}

export interface DinnerMenu {
    primi: Dish[]
    secondi: Dish[]
}

export interface DayMenu {
    id: string
    day: string
    dinner: DinnerMenu
}

// ── API types (response) ──

export interface ApiDishResponse {
    idDish: string
    nome: string
    descrizione: string
    categoria: string
    tipoPiatto: string
}

export interface ApiMenuResponse {
    idMenu: string
    giornoSettimana: string
    primi: ApiDishResponse[]
    secondi: ApiDishResponse[]
}

// ── API types (request) ──

export type ApiDayOfWeek =
    | 'LUNEDI'
    | 'MARTEDI'
    | 'MERCOLEDI'
    | 'GIOVEDI'
    | 'VENERDI'
    | 'SABATO'
    | 'DOMENICA'

export type ApiDishCategory = 'CARNE' | 'PESCE' | 'VEGETARIANO'
export type ApiDishType = 'PRIMO' | 'SECONDO'

export interface ApiDishRequest {
    nome: string
    descrizione: string
    categoria: ApiDishCategory
    tipoPiatto: ApiDishType
}

export interface ApiMenuRequest {
    giorno: ApiDayOfWeek
    piatti: ApiDishRequest[]
}

// ── Form types (admin) ──

export interface MenuFormDishEntry {
    id: string // uuid locale per key React stabile
    name: string
    description: string
    category: DishCategory
}

export interface MenuFormData {
    day: ApiDayOfWeek
    primi: MenuFormDishEntry[]
    secondi: MenuFormDishEntry[]
}

export interface MenuFormErrors {
    primi?: string
    secondi?: string
    dishes?: Record<string, { name?: string }>
}
