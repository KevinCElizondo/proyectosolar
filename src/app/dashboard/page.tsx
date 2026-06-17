import { Eye, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';

export default function DashboardOverview() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Hola, Tienda Ejemplo 👋</h1>
        <p className="text-slate-400">Aquí tienes un resumen de cómo está rindiendo tu visualizador 3D.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Eye className="w-16 h-16" />
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Vistas del Modelo 3D</p>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-white">2,450</span>
            <span className="flex items-center text-sm font-medium text-emerald-400 mb-1">
              <TrendingUp className="w-4 h-4 mr-1" /> +12%
            </span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap className="w-16 h-16" />
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Llamadas a la API</p>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-white">8,102</span>
            <span className="text-sm font-medium text-slate-500 mb-1">/ 10,000 (Plan Pro)</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[#FF5A1F]/30 bg-[#FF5A1F]/5 flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-[#FF5A1F] mb-1">Plan Actual</p>
            <span className="text-2xl font-bold text-white">Pro SaaS</span>
          </div>
          <Link href="/dashboard/billing" className="text-sm font-medium text-slate-300 hover:text-white underline decoration-white/30 underline-offset-4 mt-4 inline-block">
            Gestionar facturación &rarr;
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/5">
          <h3 className="text-lg font-semibold text-white mb-2">Añade el modelo a tu tienda</h3>
          <p className="text-sm text-slate-400 mb-4">Copia y pega el script en tu página de producto para mostrar el visualizador interactivo.</p>
          <Link href="/dashboard/settings" className="inline-flex items-center justify-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
            Obtener código Embed
          </Link>
        </div>

        <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/5">
          <h3 className="text-lg font-semibold text-white mb-2">Documentación</h3>
          <p className="text-sm text-slate-400 mb-4">Aprende a integrar variables mediante la URL para pre-configurar el tamaño del modelo.</p>
          <button className="inline-flex items-center justify-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
            Leer Guía
          </button>
        </div>
      </div>
    </div>
  );
}
