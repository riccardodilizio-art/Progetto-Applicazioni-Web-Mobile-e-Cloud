export const statusConfig = {
    confermata: { label: 'Confermata', bg: 'bg-[#E0F0D8]', text: 'text-[#3A6B28]', border: 'border-[#B8D8A8]' },
    in_attesa: { label: 'In attesa', bg: 'bg-[#FEF9E7]', text: 'text-[#8A6D00]', border: 'border-[#F0DC82]' },
    annullata: { label: 'Annullata', bg: 'bg-[#F5E0D8]', text: 'text-[#8A3820]', border: 'border-[#E6B8A8]' },
    bozza: { label: 'Bozza', bg: 'bg-[#F0F0F0]', text: 'text-[#666666]', border: 'border-[#CCCCCC]' },
}

export default function StatusBadge({ status }: { status: keyof typeof statusConfig }) {
    const cfg = statusConfig[status]
    return (
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            {cfg.label}
        </span>
    )
}
