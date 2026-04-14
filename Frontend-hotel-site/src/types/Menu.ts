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

// ── API types ──

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
