export interface UserState {
    email: string
    role: 'admin' | 'client'
    name?: string
    surname?: string
    phone?: string
}
