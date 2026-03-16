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
    id: number
    day: string
    dinner: DinnerMenu
}
