export default function LoadingSpinner({ message = 'Caricamento...' }: { message?: string }) {
    return (
        <div
            role="status"
            aria-live="polite"
            className="min-h-[40vh] flex flex-col items-center justify-center gap-4 text-[#9A6840]"
        >
            <div className="w-10 h-10 border-4 border-[#E8C9A0] border-t-[#6B4828] rounded-full animate-spin" />
            <p className="text-sm">{message}</p>
        </div>
    )
}
