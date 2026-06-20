'use client';

import { Copy, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AffiliatesPage() {
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    }
    getUser();
  }, [supabase]);

  // En producción, este dominio debe venir de las variables de entorno
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://solarfluidity.com';
  const referralLink = userId ? `${baseUrl}/upgrade?ref=${userId}` : 'Cargando enlace...';

  const copyToClipboard = () => {
    if (!userId) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Programa de Afiliados</h1>
        <p className="text-slate-400">Refiere a otros fabricantes y obtén 1 mes gratis de suscripción Pro por cada referido que adquiera un plan.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Enlace de referido */}
        <section className="glass-panel p-8 rounded-2xl border border-emerald-500/30 md:col-span-2 relative overflow-hidden bg-emerald-500/5">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Users className="w-24 h-24" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2 relative z-10">Tu Enlace de Referido</h2>
          <p className="text-sm text-slate-400 mb-6 relative z-10">
            Comparte este enlace con otros fabricantes de tu gremio. Cuando se suscriban usando tu enlace, te acreditaremos un mes gratis automáticamente.
          </p>
          
          <div className="relative group max-w-2xl">
            <div className="bg-[#0B0F19] border border-white/10 p-4 rounded-xl flex items-center pr-24">
              <span className="text-emerald-400 font-mono text-sm truncate">{referralLink}</span>
            </div>
            <button 
              onClick={copyToClipboard}
              disabled={!userId}
              className="absolute top-2 right-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 rounded-lg text-white transition-colors flex items-center gap-2 font-medium text-sm"
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        </section>

        {/* Estadísticas */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <p className="text-sm font-medium text-slate-400 mb-1">Referidos Activos</p>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-white">0</span>
            <span className="flex items-center text-sm font-medium text-slate-500 mb-1">
              usuarios
            </span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[#FF5A1F]/30 bg-[#FF5A1F]/5">
          <p className="text-sm font-medium text-[#FF5A1F] mb-1">Meses Gratis Ganados</p>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-white">0</span>
            <span className="flex items-center text-sm font-medium text-slate-400 mb-1">
              meses
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
