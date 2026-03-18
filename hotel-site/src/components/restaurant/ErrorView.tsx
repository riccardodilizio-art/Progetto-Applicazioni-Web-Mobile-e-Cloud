import PageHeader from './PageHeader'
import type { RLStatus } from '../../lib/dinnerUtils'

interface Props {
    errorMsg: string
    rlStatus: RLStatus
    onRetry: () => void
}

export default function ErrorView({ errorMsg, rlStatus, onRetry }: Props) {
    return (
        <div className="min-h-screen bg-[#FAF0E6] flex flex-col items-center justify-center px-4 py-16">
            <PageHeader />
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 w-full max-w-sm text-center shadow-sm">
                <p className="text-3xl mb-3">⚠️</p>
                <p className="text-red-700 text-sm leading-relaxed mb-6">{errorMsg}</p>
                {!rlStatus.blocked && (
                    <button
                        onClick={onRetry}
                        className="px-6 py-2.5 bg-[#3B2010] text-[#FAF0E6] text-sm uppercase tracking-widest rounded-lg hover:bg-[#6B4828] transition-colors"
                    >
                        Riprova
                    </button>
                )}
            </div>
        </div>
    )
}
