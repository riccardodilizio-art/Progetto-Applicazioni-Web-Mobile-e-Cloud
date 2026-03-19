import { getRLStatus, recordFailedAttempt, recordSuccess, type RLStatus } from '../lib/dinnerUtils'
import { useState, useCallback, useEffect } from 'react'

export function useRateLimit() {
    const [status, setStatus] = useState<RLStatus>(() => getRLStatus())

    // polling ogni 30s quando bloccato
    useEffect(() => {
        if (!status.blocked) return
        const interval = setInterval(() => {
            const s = getRLStatus()
            setStatus(s)
            if (!s.blocked) clearInterval(interval)
        }, 30_000)
        return () => clearInterval(interval)
    }, [status.blocked])

    const onFailure = useCallback((): RLStatus => {
        const next = recordFailedAttempt()
        setStatus(next)
        return next
    }, [])

    const onSuccess = useCallback(() => {
        recordSuccess()
        setStatus(getRLStatus())
    }, [])

    const refresh = useCallback(() => {
        setStatus(getRLStatus())
    }, [])

    return { status, onFailure, onSuccess, refresh }
}
