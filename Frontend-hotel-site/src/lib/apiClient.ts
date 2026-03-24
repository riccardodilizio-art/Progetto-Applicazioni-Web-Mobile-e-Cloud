// Callback registrato da useApiSetup (non può essere un hook qui)
let onUnauthorized: (() => void) | null = null

export function registerUnauthorizedHandler(fn: (() => void) | null) {
    onUnauthorized = fn
}

export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = import.meta.env.VITE_API_URL ?? '/api'

    const { headers: customHeaders, ...rest } = options
    const res = await fetch(`${baseUrl}${path}`, {
        ...rest,
        headers: {
            'Content-Type': 'application/json',
            ...customHeaders,
        },
        credentials: 'include',
    })

    if (res.status === 401) {
        onUnauthorized?.()
        throw new Error('Sessione scaduta')
    }

    if (!res.ok) {
        throw new Error(`Errore ${res.status}`)
    }

    // 204 No Content (es. DELETE)
    if (res.status === 204) return null as T

    return res.json() as Promise<T>
}
