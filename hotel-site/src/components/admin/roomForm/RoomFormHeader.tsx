import { Link } from 'react-router-dom'

type Props = {
    isEdit: boolean
    roomName?: string
}

export default function RoomFormHeader({ isEdit, roomName }: Props) {
    return (
        <div className="bg-white border-b border-[#E8C9A0] px-6 py-4 sticky top-0 z-10">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-[#9A6840] mb-1">
                        <Link to="/admin/dashboard" className="hover:text-[#6B4828] transition-colors">
                            Dashboard
                        </Link>
                        <span>/</span>
                        <span className="text-[#3B2010]">
                            {isEdit ? 'Modifica Camera' : 'Nuova Camera'}
                        </span>
                    </div>
                    <h1 className="text-2xl text-[#3B2010] font-light font-heading">
                        {isEdit ? `Modifica: ${roomName}` : 'Aggiungi Nuova Camera'}
                    </h1>
                </div>
                <Link
                    to="/admin/dashboard"
                    className="text-sm text-[#9A6840] border border-[#E8C9A0] px-4 py-2 rounded-lg hover:bg-[#FAF5EE] transition-colors whitespace-nowrap"
                >
                    Annulla
                </Link>
            </div>
        </div>
    )
}
