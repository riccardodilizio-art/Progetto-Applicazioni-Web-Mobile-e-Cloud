// Callback registrato da useApiSetup (non può essere un hook qui)
let onUnauthorized: (() => void) | null = null
let getAuthHeader: (() => string | null) | null = null

export function registerUnauthorizedHandler(fn: (() => void) | null) {
    onUnauthorized = fn
}

export function registerAuthHeaderGetter(fn: (() => string | null) | null) {
    getAuthHeader = fn
}

type ApiFetchOptions = RequestInit & { skipAuthRedirect?: boolean }

export async function apiFetch<T = unknown>(path: string, options: ApiFetchOptions = {}): Promise<T> {
    const baseUrl = import.meta.env.VITE_API_URL ?? '/api'

    const { headers: customHeaders, body, skipAuthRedirect, ...rest } = options
    const isFormData = body instanceof FormData
    const defaultHeaders: Record<string, string> = isFormData ? {} : { 'Content-Type': 'application/json' }

    const authHeader = getAuthHeader?.()
    if (authHeader) {
        defaultHeaders['Authorization'] = authHeader
    }

    const res = await fetch(`${baseUrl}${path}`, {
        ...rest,
        body,
        headers: {
            ...defaultHeaders,
            ...customHeaders,
        },
        credentials: 'include',
    })

    if (res.status === 401) {
        if (!skipAuthRedirect) onUnauthorized?.()
        const errBody = await res.text().catch(() => '')
        throw new Error(errBody || 'Sessione scaduta')
    }

    if (!res.ok) {
        const errorBody = await res.text().catch(() => '')
        throw new Error(`Errore ${res.status}: ${errorBody}`)
    }

    // 204 No Content (es. DELETE)
    if (res.status === 204) return null as T

    return await res.json() as Promise<T>
}
