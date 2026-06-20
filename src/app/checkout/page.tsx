'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const product = searchParams.get('product') || 'grill';
  const width = searchParams.get('width') || '0.80';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, product, width })
      });

      if (!res.ok) throw new Error('Error enviando pedido');
      
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center p-8 glass-panel rounded-3xl border border-emerald-500/30">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">¡Pedido Recibido!</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Hemos recibido tu solicitud para la Parrilla Híbrida ({width}m). Te contactaremos en las próximas 24 horas con las instrucciones para el pago del anticipo (50%).
        </p>
        <Link href="/store" className="inline-block bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-8 rounded-xl transition-colors">
          Volver a la Tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-5 gap-12">
      {/* Form */}
      <div className="md:col-span-3 space-y-8">
        <div className="glass-panel p-8 rounded-3xl border border-white/5">
          <h2 className="text-xl font-semibold text-white mb-6">Datos de Contacto y Envío</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Nombre Completo *</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#121A2F] border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/50 focus:border-[#FF5A1F]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email *</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[#121A2F] border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/50 focus:border-[#FF5A1F]"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Teléfono (WhatsApp) *</label>
              <input 
                required
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-[#121A2F] border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/50 focus:border-[#FF5A1F]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Dirección de Entrega *</label>
              <textarea 
                required
                rows={3}
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                className="w-full bg-[#121A2F] border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/50 focus:border-[#FF5A1F]"
              />
            </div>

            <button 
              disabled={status === 'loading'}
              className="w-full bg-[#FF5A1F] hover:bg-[#E04A15] disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors shadow-[0_0_15px_rgba(255,90,31,0.2)]"
            >
              {status === 'loading' ? 'Procesando...' : 'Solicitar Pedido (Anticipo 50%)'}
            </button>
            {status === 'error' && (
              <p className="text-red-400 text-sm text-center">Hubo un error al enviar tu solicitud. Intenta de nuevo.</p>
            )}
          </form>
        </div>
      </div>

      {/* Summary Sidebar */}
      <div className="md:col-span-2">
        <div className="glass-panel p-8 rounded-3xl border border-[#FF5A1F]/20 bg-gradient-to-b from-[#FF5A1F]/5 to-transparent sticky top-24">
          <h3 className="text-lg font-bold text-white mb-6">Resumen del Pedido</h3>
          
          <div className="flex items-start justify-between mb-4 pb-4 border-b border-white/10">
            <div>
              <p className="font-medium text-white">{product === 'grill' ? 'Parrilla Híbrida Pro' : 'Producto'}</p>
              <p className="text-sm text-slate-400">Ancho parametrizado: {width}m</p>
            </div>
            <span className="font-medium text-white">$1,199</span>
          </div>

          <div className="flex justify-between items-center mb-6 text-sm">
            <span className="text-slate-400">Anticipo requerido (50%)</span>
            <span className="font-bold text-white text-xl">$599.50</span>
          </div>

          <div className="flex items-start gap-3 p-4 bg-black/40 rounded-xl text-sm text-slate-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <p>
              Tu pedido entra a cola de fabricación al confirmar el anticipo. Tiempo estimado de entrega: <strong>14 días hábiles</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 py-12 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <Link href="/store" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la tienda</span>
        </Link>
        <h1 className="text-3xl font-bold text-white mb-8">Finalizar Pedido</h1>
        <Suspense fallback={<div className="text-center p-12 text-slate-400">Cargando detalles...</div>}>
          <CheckoutContent />
        </Suspense>
      </div>
    </div>
  );
}
