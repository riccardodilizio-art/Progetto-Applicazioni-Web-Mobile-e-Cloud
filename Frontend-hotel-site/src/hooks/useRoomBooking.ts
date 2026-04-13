function toISODate(d: Date) {
    return d.toISOString().split('T')[0]
}

export { toISODate }

export function nightsBetween(from: string, to: string): number {
    if (!from || !to) return 0
    const a = new Date(from)
    const b = new Date(to)
    return Math.max(
        0,
        Math.round(
            (Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) -
                Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) /
                86_400_000,
        ),
    )
}
