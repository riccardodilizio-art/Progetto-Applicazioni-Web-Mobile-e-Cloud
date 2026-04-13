import { useRef, useState } from 'react';
import { apiFetch } from '../lib/apiClient';

interface ImageUploaderProps {
    value: string[];                     // URL già caricate
    onChange: (urls: string[]) => void;  // callback al parent
    maxImages?: number;                  // limite opzionale
}

export default function ImageUploader({
                                          value,
                                          onChange,
                                          maxImages = 15,
                                      }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setError(null);
        setUploading(true);

        try {
            const uploaded: string[] = [];
            for (const file of Array.from(files)) {
                if (value.length + uploaded.length >= maxImages) {
                    setError(`Massimo ${maxImages} immagini.`);
                    break;
                }

                const formData = new FormData();
                formData.append('file', file);

                // apiFetch deve supportare body FormData (non impostare Content-Type manualmente)
                const res = await apiFetch<{ url: string }>('/uploads', {
                    method: 'POST',
                    body: formData,
                });

                uploaded.push(res.url);
            }

            onChange([...value, ...uploaded]);
        } catch (err) {
            console.error(err);
            setError('Errore durante il caricamento.');
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    return (
        <div className="space-y-3">
            {/* Drop zone + tap per mobile */}
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-amber-500 transition-colors"
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                />
                {uploading ? (
                    <p className="text-gray-500">Caricamento in corso…</p>
                ) : (
                    <>
                        <p className="text-gray-700 font-medium">
                            Trascina le immagini qui o tocca per selezionare
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            JPEG, PNG, WebP – max 5 MB per file – fino a {maxImages} immagini
                        </p>
                    </>
                )}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Preview thumbnails */}
            {value.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {value.map((url, i) => (
                        <div key={url} className="relative group">
                            <img
                                src={`${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081'}${url}`}
                                alt={`Immagine ${i + 1}`}
                                className="w-full h-24 object-cover rounded border"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Rimuovi immagine"
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
