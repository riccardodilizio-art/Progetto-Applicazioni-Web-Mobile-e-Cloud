import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { apiFetch } from '../../lib/apiClient'
import { apiMenuToForm, menuFormToApiRequest } from '../../lib/mappers'
import { DAY_LABELS, DAY_ORDER, emptyMenuForm, validateMenuForm } from '../../data/menuUtils'
import type {
    ApiDayOfWeek,
    ApiMenuResponse,
    MenuFormData,
    MenuFormDishEntry,
    MenuFormErrors,
} from '../../types/Menu'
import MenuFormHeader from '../../components/admin/menuForm/MenuFormHeader'
import DishList from '../../components/admin/menuForm/DishList'

export default function MenuForm() {
    const { id } = useParams<{ id: string }>()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const isEdit = id !== undefined

    const [form, setForm] = useState<MenuFormData>(() => {
        const qp = searchParams.get('giorno')
        const day = qp && (DAY_ORDER as string[]).includes(qp) ? (qp as ApiDayOfWeek) : 'LUNEDI'
        return emptyMenuForm(day)
    })
    const [errors, setErrors] = useState<MenuFormErrors>({})
    const [isLoading, setIsLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [allMenus, setAllMenus] = useState<ApiMenuResponse[]>([])
    const [serverError, setServerError] = useState<string | null>(null)

    useEffect(() => {
        apiFetch<ApiMenuResponse[]>('/menus')
            .then((menus) => {
                setAllMenus(menus)
                if (isEdit) {
                    const target = menus.find((m) => m.idMenu === id)
                    if (!target) setNotFound(true)
                    else setForm(apiMenuToForm(target))
                }
            })
            .catch(() => {
                if (isEdit) setNotFound(true)
            })
            .finally(() => setLoadingData(false))
    }, [id, isEdit])

    const availableDays = useMemo<ApiDayOfWeek[]>(() => {
        const taken = new Set(allMenus.map((m) => m.giornoSettimana))
        if (isEdit && id) {
            const current = allMenus.find((m) => m.idMenu === id)
            if (current) taken.delete(current.giornoSettimana)
        }
        return DAY_ORDER.filter((d) => !taken.has(d))
    }, [allMenus, isEdit, id])

    function updateDay(day: ApiDayOfWeek) {
        setForm((prev) => ({ ...prev, day }))
    }
    function updatePrimi(primi: MenuFormDishEntry[]) {
        setForm((prev) => ({ ...prev, primi }))
        setErrors((prev) => ({ ...prev, primi: undefined, dishes: undefined }))
    }
    function updateSecondi(secondi: MenuFormDishEntry[]) {
        setForm((prev) => ({ ...prev, secondi }))
        setErrors((prev) => ({ ...prev, secondi: undefined, dishes: undefined }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setServerError(null)
        const newErrors = validateMenuForm(form)
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            document
                .querySelector('[data-error="true"]')
                ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            return
        }
        setIsLoading(true)
        try {
            const body = JSON.stringify(menuFormToApiRequest(form))
            if (isEdit) {
                await apiFetch(`/menus/${id}`, { method: 'PUT', body })
            } else {
                await apiFetch('/menus', { method: 'POST', body })
            }
            navigate('/admin/menu')
        } catch (err) {
            setServerError(err instanceof Error ? err.message : 'Errore salvataggio menu')
        } finally {
            setIsLoading(false)
        }
    }

    if (loadingData) {
        return (
            <div className="min-h-screen bg-[#FAF5EE] flex items-center justify-center">
                <p className="text-[#9A6840]">Caricamento...</p>
            </div>
        )
    }

    if (isEdit && notFound) {
        return (
            <div className="min-h-screen bg-[#FAF5EE] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-[#3B2010] text-xl font-heading mb-2">Menu non trovato</p>
                    <Link
                        to="/admin/menu"
                        className="bg-[#3B2010] text-white text-sm px-5 py-2.5 rounded-lg hover:bg-[#6B4828] transition-colors"
                    >
                        Torna ai menu
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FAF5EE]">
            <MenuFormHeader isEdit={isEdit} dayLabel={DAY_LABELS[form.day]} />
            <form onSubmit={handleSubmit} noValidate>
                <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
                    <section className="bg-white rounded-xl border border-[#E8C9A0]/60 p-6">
                        <h2 className="text-lg font-semibold text-[#3B2010] mb-4">
                            Giorno della settimana
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {DAY_ORDER.map((d) => {
                                const disabled = !availableDays.includes(d)
                                const selected = form.day === d
                                return (
                                    <button
                                        key={d}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => updateDay(d)}
                                        className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
                                            selected
                                                ? 'bg-[#3B2010] text-white border-[#3B2010]'
                                                : disabled
                                                    ? 'bg-[#FAF5EE] text-[#C4A070] border-[#E8C9A0] cursor-not-allowed'
                                                    : 'bg-white text-[#6B4828] border-[#C4A070] hover:bg-[#FAF5EE] cursor-pointer'
                                        }`}
                                    >
                                        {DAY_LABELS[d]}
                                    </button>
                                )
                            })}
                        </div>
                        <p className="text-xs text-[#9A6840] mt-3">
                            I giorni grigi hanno già un menu configurato.
                        </p>
                    </section>

                    <DishList
                        title="Primi piatti"
                        sectionError={errors.primi}
                        dishes={form.primi}
                        dishErrors={errors.dishes}
                        onChange={updatePrimi}
                    />

                    <DishList
                        title="Secondi piatti"
                        sectionError={errors.secondi}
                        dishes={form.secondi}
                        dishErrors={errors.dishes}
                        onChange={updateSecondi}
                    />

                    {serverError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                            {serverError}
                        </div>
                    )}

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pb-8">
                        <Link
                            to="/admin/menu"
                            className="text-center text-sm text-[#6B4828] border border-[#C4A070] px-6 py-2.5 rounded-lg hover:bg-[#FAF5EE] transition-colors"
                        >
                            Annulla
                        </Link>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`bg-[#3B2010] text-white text-sm font-medium px-8 py-2.5 rounded-lg transition-colors ${
                                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#6B4828]'
                            }`}
                        >
                            {isLoading ? 'Salvataggio...' : isEdit ? 'Salva Modifiche' : 'Crea Menu'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
