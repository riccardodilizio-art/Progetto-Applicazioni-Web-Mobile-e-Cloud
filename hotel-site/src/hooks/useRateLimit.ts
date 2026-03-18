import { useState, useCallback } from 'react'
import { getRLStatus, recordFailedAttempt, recordSuccess, type RLStatus } from '../lib/dinnerUtils'

export function useRateLimit() {
    const [status, setStatus] = useState<RLStatus>(() => getRLStatus())

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
