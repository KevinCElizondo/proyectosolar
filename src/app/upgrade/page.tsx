"use client";

import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function UpgradeContent() {
  const searchParams = useSearchParams();
  const affiliateRef = searchParams.get('ref');
  
  const [code, setCode] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    }
    getUser();
  }, [supabase]);

  const validCode = code.toUpperCase() === 'EARLY70';
  
  // En caso de que no existan las variables, usamos un fallback de test.
  // En producción, estas deben estar en .env.local y en Vercel.
  const planId = validCode
    ? (process.env.NEXT_PUBLIC_PAYPAL_PLAN_EARLYBIRD || "test_earlybird")
    : (process.env.NEXT_PUBLIC_PAYPAL_PLAN_STANDARD || "test_standard");

  const customIdPayload = affiliateRef ? `${userId}|ref_${affiliateRef}` : userId;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 py-20 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] w-[60%] h-[40%] bg-[#FF5A1F]/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Escala tu negocio con <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-orange-400">3D Paramétrico</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Integra nuestro configurador premium directamente en tu tienda online. Cero plugins, cero complicaciones, aumento masivo de conversiones.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="glass-panel p-8 rounded-3xl border border-white/5 opacity-80 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">Desarrollador</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-slate-400">/mes</span>
            </div>
            <p className="text-sm text-slate-400 mb-8 border-b border-white/10 pb-8">
              Para probar el configurador localmente y entender la arquitectura.
            </p>
            <ul className="space-y-4 mb-8 flex-1">
              {[
                'Visualizador 3D básico',
                'Ajustes paramétricos limitados',
                'Exportación local',
                'Marca de agua SolarFluidity'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-slate-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button disabled className="w-full py-3 px-4 rounded-xl bg-white/5 text-slate-400 font-medium cursor-not-allowed">
              Plan Actual
            </button>
          </div>

          {/* Pro Tier */}
          <div className="glass-panel p-8 rounded-3xl border border-[#FF5A1F]/30 shadow-[0_0_40px_rgba(255,90,31,0.15)] flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 right-8 transform -translate-y-1/2">
              <span className="bg-gradient-to-r from-[#FF5A1F] to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                RECOMENDADO
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-[#FF5A1F]">Pro SaaS</h3>
            
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-bold text-white">
                {validCode ? '$29.70' : '$99'}
              </span>
              <span className="text-slate-400">/mes</span>
            </div>
            {validCode && (
              <span className="text-xs text-emerald-400 font-medium mb-4 block">
                ¡Cupón aplicado! 70% off por 3 meses.
              </span>
            )}

            <p className="text-sm text-slate-400 mb-6 border-b border-white/10 pb-6">
              Todo lo que necesitas para incrustar el visualizador en tu e-commerce y vender.
            </p>
            
            <div className="mb-6">
              <input
                type="text"
                placeholder="¿Código de acceso? (opcional)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-[#121A2F] border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/50 focus:border-[#FF5A1F]"
              />
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {[
                'Embed Widget Ilimitado',
                'Marca blanca (Sin logo de SolarFluidity)',
                'Modelos paramétricos avanzados',
                'Cálculo de despiece automático',
                'Soporte técnico prioritario',
                'Actualizaciones de modelos gratis'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-[#FF5A1F] shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            {userId ? (
              <PayPalScriptProvider options={{ 
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
                vault: true,
                intent: "subscription"
              }}>
                <PayPalButtons 
                  style={{ layout: "vertical", shape: "rect", color: "gold" }}
                  createSubscription={(data, actions) => {
                    return actions.subscription.create({
                      plan_id: planId,
                      custom_id: customIdPayload || userId // Vincula la suscripción al usuario en el webhook y el afiliado
                    });
                  }}
                  onApprove={async (data) => {
                    // Redirigir al usuario cuando se aprueba la suscripción
                    window.location.href = '/dashboard?upgraded=true';
                  }}
                />
              </PayPalScriptProvider>
            ) : (
              <div className="w-full py-4 px-4 rounded-xl bg-white/5 text-slate-400 font-medium text-center">
                Inicia sesión para suscribirte
              </div>
            )}

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4" />
              <span>Suscripción procesada por PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-slate-400">Cargando planes...</div>}>
      <UpgradeContent />
    </Suspense>
  );
}
