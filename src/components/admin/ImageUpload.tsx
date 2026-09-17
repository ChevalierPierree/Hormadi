'use client'

import { useRef, useState } from 'react'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder: 'articles' | 'players' | 'staff' | 'partners' | 'products'
  label?: string
  /** Tailwind classes controlling the preview box shape (default: 4:3 rectangle) */
  previewClassName?: string
}

const MAX_SIZE = 8 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']

export default function ImageUpload({
  value,
  onChange,
  folder,
  label = 'Image',
  previewClassName = 'aspect-[4/3] w-full max-w-xs',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = async (file: File) => {
    setError(null)

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Format non supporté (JPEG, PNG, WEBP, GIF ou SVG uniquement)')
      return
    }
    if (file.size > MAX_SIZE) {
      setError('Fichier trop volumineux (8 Mo max)')
      return
    }

    setUploading(true)
    try {
      const body = new FormData()
      body.append('file', file)
      body.append('folder', folder)

      const res = await fetch('/api/upload', { method: 'POST', body })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Échec du téléchargement')
      }
      onChange(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec du téléchargement')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) upload(file)
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-white mb-2">{label}</label>

      {value ? (
        <div className={`relative ${previewClassName} rounded-lg overflow-hidden bg-hormadi-surface border border-hormadi-border group`}>
          <img src={value} alt="Aperçu" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/70 flex items-center justify-center
                       opacity-0 group-hover:opacity-100 transition-opacity hover:bg-hormadi-red"
            title="Supprimer l'image"
          >
            <X size={16} className="text-white" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-x-0 bottom-0 py-2 bg-black/70 text-white text-xs font-semibold
                       opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90"
          >
            {uploading ? 'Téléchargement...' : 'Changer l\'image'}
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`${previewClassName} rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2
                      cursor-pointer transition-colors
                      ${dragActive ? 'border-hormadi-red bg-hormadi-red/5' : 'border-hormadi-border hover:border-hormadi-red/50 bg-hormadi-surface/50'}`}
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="text-hormadi-red animate-spin" />
              <span className="text-hormadi-muted text-xs">Téléchargement...</span>
            </>
          ) : (
            <>
              {dragActive ? (
                <Upload size={24} className="text-hormadi-red" />
              ) : (
                <ImageIcon size={24} className="text-hormadi-muted" />
              )}
              <span className="text-hormadi-muted text-xs text-center px-4">
                Glissez une image ici, ou cliquez pour parcourir
              </span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) upload(file)
          e.target.value = ''
        }}
      />

      {error && <p className="text-hormadi-red text-xs mt-2">{error}</p>}
    </div>
  )
}
