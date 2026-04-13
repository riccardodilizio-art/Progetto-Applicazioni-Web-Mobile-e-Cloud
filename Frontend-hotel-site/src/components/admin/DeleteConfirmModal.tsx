import { useEffect } from 'react'

interface Props {
    roomName: string
    onConfirm: () => void
    onCancel: () => void
}

export default function DeleteConfirmModal({ roomName, onConfirm, onCancel }: Props) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel()
        }
        document.addEventListener('keydown', handler)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handler)
            document.body.style.overflow = ''
        }
    }, [onCancel])

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onCancel}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-title"
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        aria-hidden="true"
                        className="w-6 h-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                </div>

                <h3 id="delete-title" className="text-lg font-semibold text-[#3B2010] text-center mb-2">
                    Elimina camera
                </h3>
                <p className="text-sm text-[#9A6840] text-center mb-6">
                    Sei sicuro di voler eliminare <strong className="text-[#3B2010]">{roomName}</strong>?
                    <br />
                    Questa azione non può essere annullata.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 text-sm text-[#6B4828] border border-[#C4A070] py-2.5 rounded-xl hover:bg-[#FAF5EE] transition-colors"
                    >
                        Annulla
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 text-sm text-white bg-red-600 py-2.5 rounded-xl hover:bg-red-700 transition-colors font-medium"
                    >
                        Elimina
                    </button>
                </div>
            </div>
        </div>
    )
}
