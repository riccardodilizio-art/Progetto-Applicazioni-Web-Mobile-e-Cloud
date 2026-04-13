export interface UserState {
    id: string
    email: string
    role: 'admin' | 'client'
    name?: string
    surname?: string
    phone?: string
}
