'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Star, GripVertical, Loader2 } from 'lucide-react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { compressImage } from '@/lib/image-compression';
import { useToast } from './ui/Toast';

export interface ImageRow {
  url: string;
  isPrimary: boolean;
  altText?: string;
}

export default function ProductImageManager({
  images, onChange,
}: { images: ImageRow[]; onChange: (images: ImageRow[]) => void }) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const dragIndex = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    setUploading(true);
    const supabase = createBrowserSupabaseClient();
    const newImages: ImageRow[] = [];

    for (const rawFile of Array.from(files)) {
      const file = await compressImage(rawFile); // compression automatique avant upload

      if (supabase) {
        const path = `products/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage.from('product-images').upload(path, file);
        if (!error) {
          const { data } = supabase.storage.from('product-images').getPublicUrl(path);
          newImages.push({ url: data.publicUrl, isPrimary: false });
        } else {
          toast(`Échec de l'upload : ${error.message}`, 'error');
        }
      } else {
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        newImages.push({ url: dataUrl, isPrimary: false });
      }
    }

    onChange([
      ...images,
      ...newImages.map((img, i) => ({ ...img, isPrimary: images.length === 0 && i === 0 })),
    ]);
    setUploading(false);
    toast(`${newImages.length} image(s) ajoutée(s) (compressées automatiquement).`, 'success');
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  }

  function setPrimary(index: number) {
    onChange(images.map((img, i) => ({ ...img, isPrimary: i === index })));
  }
  function remove(index: number) {
    const next = images.filter((_, i) => i !== index);
    if (images[index].isPrimary && next.length > 0) next[0].isPrimary = true;
    onChange(next);
  }

  // Réordonnancement par glisser-déposer (drag & drop natif)
  function handleDragStart(index: number) { dragIndex.current = index; }
  function handleDragOverItem(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;
    const next = [...images];
    const [moved] = next.splice(dragIndex.current, 1);
    next.splice(index, 0, moved);
    dragIndex.current = index;
    onChange(next);
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-soft border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? 'border-rosegold-400 bg-blush-50' : 'border-blush-200 dark:border-admin-border'
        }`}
      >
        {uploading ? (
          <Loader2 size={28} className="animate-spin text-rosegold-400" />
        ) : (
          <>
            <Upload size={28} className="text-rosegold-400" />
            <p className="mt-2 text-sm font-medium text-charcoal-800 dark:text-gray-200">
              Glissez-déposez des images ici, ou cliquez pour choisir
            </p>
            <p className="mt-1 text-xs text-charcoal-700 dark:text-gray-500">
              JPG, PNG, WebP — compressées et optimisées automatiquement
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {images.map((img, i) => (
            <div
              key={img.url + i}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOverItem(e, i)}
              className={`group relative aspect-square cursor-grab overflow-hidden rounded-lg border-2 active:cursor-grabbing ${
                img.isPrimary ? 'border-rosegold-400' : 'border-transparent'
              }`}
            >
              <Image src={img.url} alt="" fill className="object-cover" />
              <div className="absolute left-1 top-1 rounded bg-black/50 p-0.5 text-white">
                <GripVertical size={12} />
              </div>
              {img.isPrimary && (
                <span className="absolute right-1 top-1 rounded-full bg-rosegold-400 p-1 text-white">
                  <Star size={10} fill="currentColor" />
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/60 px-1 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button type="button" onClick={() => setPrimary(i)} className="text-[10px] text-white">Principale</button>
                <button type="button" onClick={() => remove(i)} className="text-white"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
