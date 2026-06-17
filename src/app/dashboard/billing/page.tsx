import { CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function BillingPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Facturación y Suscripción</h1>
        <p className="text-slate-400">Gestiona tu plan activo, métodos de pago y descarga tus facturas.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Plan Column */}
        <div className="md:col-span-2 space-y-8">
          
          <section className="glass-panel p-8 rounded-2xl border border-[#FF5A1F]/30 bg-gradient-to-br from-[#121A2F] to-[#0B0F19]">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">Pro SaaS</h2>
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2 py-1 rounded-md">
                    ACTIVO
                  </span>
                </div>
                <p className="text-sm text-slate-400">Tu plan se renovará automáticamente el 15 de Julio de 2026.</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-white">$99</span>
                <span className="text-slate-400 text-sm">/mes</span>
              </div>
            </div>

            <div className="h-px w-full bg-white/10 my-6" />

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Llamadas API consumidas</span>
                <span className="text-white font-medium">8,102 / 10,000</span>
              </div>
              <div className="w-full bg-[#0B0F19] rounded-full h-2.5 border border-white/5 overflow-hidden">
                <div className="bg-gradient-to-r from-[#FF5A1F] to-orange-400 h-2.5 rounded-full" style={{ width: '81%' }}></div>
              </div>
              {/* Alert for approaching limit */}
              <div className="flex items-center gap-2 mt-2 text-xs text-yellow-500 bg-yellow-500/10 p-2 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span>Te estás acercando al límite de llamadas a la API de tu plan este mes.</span>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button className="bg-white/5 hover:bg-white/10 text-white font-medium py-2 px-4 rounded-xl transition-colors border border-white/10 text-sm">
                Cambiar de Plan
              </button>
              <button className="text-red-400 hover:text-red-300 hover:bg-red-400/10 font-medium py-2 px-4 rounded-xl transition-colors text-sm">
                Cancelar Suscripción
              </button>
            </div>
          </section>

          <section className="glass-panel p-8 rounded-2xl border border-white/5">
            <h2 className="text-xl font-semibold text-white mb-6">Historial de Facturas</h2>
            <div className="space-y-4">
              {[
                { date: '15 Jun, 2026', amount: '$99.00', status: 'Pagado' },
                { date: '15 May, 2026', amount: '$99.00', status: 'Pagado' },
                { date: '15 Abr, 2026', amount: '$99.00', status: 'Pagado' },
              ].map((invoice, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <p className="text-white font-medium text-sm">{invoice.date}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span className="text-xs text-slate-400">{invoice.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white font-mono text-sm">{invoice.amount}</span>
                    <button className="text-xs text-[#FF5A1F] hover:text-white underline decoration-[#FF5A1F]/50 underline-offset-4">
                      Descargar PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          <section className="glass-panel p-6 rounded-2xl border border-white/5">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider text-slate-400">Método de Pago</h3>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0B0F19] border border-white/10 mb-4">
              <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-[8px] font-bold text-white italic">
                PayPal
              </div>
              <div>
                <p className="text-sm text-white font-medium">tu-correo@paypal.com</p>
                <p className="text-xs text-slate-500">Predeterminado</p>
              </div>
            </div>
            <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors border border-white/10">
              Actualizar Método
            </button>
          </section>

          <section className="glass-panel p-6 rounded-2xl border border-white/5">
            <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider text-slate-400">Soporte</h3>
            <p className="text-xs text-slate-400 mb-4">Como usuario Pro, tienes acceso a soporte prioritario.</p>
            <Link href="mailto:soporte@solarfluidity.com" className="w-full flex items-center justify-center py-2 bg-[#FF5A1F]/10 hover:bg-[#FF5A1F]/20 text-[#FF5A1F] rounded-lg text-sm font-medium transition-colors border border-[#FF5A1F]/20">
              Contactar Soporte
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
