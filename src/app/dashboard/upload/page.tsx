"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2, UploadCloud } from 'lucide-react';

export default function UploadModelPage() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState('');
  const [cta, setCta] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!file || !name) {
      setError('Nombre y archivo son obligatorios.');
      return;
    }
    const lower = file.name.toLowerCase();
    if (!lower.endsWith('.stl') && !lower.endsWith('.glb')) {
      setError('Solo se aceptan archivos .stl o .glb');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('El archivo excede 50MB.');
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Sesión expirada. Vuelve a iniciar sesión.');
        setLoading(false);
        return;
      }

      const fd = new FormData();
      fd.append('file', file);
      fd.append('name', name);
      fd.append('callToAction', cta);
      fd.append('public', String(isPublic));

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al subir el modelo');
      router.push(`/dashboard`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Subir modelo 3D</h1>
      <p className="text-slate-400 mb-8">Formatos aceptados: .stl y .glb. Máx 50MB.</p>

      <form onSubmit={handleSubmit} className="space-y-5 glass-panel border border-white/10 rounded-2xl p-6">
        <div>
          <label className="text-sm font-medium text-slate-300">Nombre del modelo</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full bg-[#121A2F] border border-white/10 rounded-xl py-3 px-4 text-white"
            placeholder="Cama de cultivo VerDECER"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Archivo (.stl / .glb)</label>
          <input
            type="file"
            accept=".stl,.glb"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-[#FF5A1F]/10 file:text-[#FF5A1F]"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Call to action (URL opcional)</label>
          <input
            type="url"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            className="mt-1 w-full bg-[#121A2F] border border-white/10 rounded-xl py-3 px-4 text-white"
            placeholder="https://tu-tienda.com/producto"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          Hacer público el visor
        </label>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF5A1F] hover:bg-[#E04A15] disabled:opacity-50 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
          {loading ? 'Subiendo...' : 'Subir modelo'}
        </button>
      </form>
    </div>
  );
}
