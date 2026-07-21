"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setIsSuccess(true);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF5A1F]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al inicio</span>
      </Link>

      <div className="glass-panel w-full max-w-md p-8 rounded-2xl relative z-10 border border-white/10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#FF5A1F]/10 rounded-xl flex items-center justify-center mb-4 border border-[#FF5A1F]/20">
            <Sparkles className="w-6 h-6 text-[#FF5A1F]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Bienvenido a Solar Fluidity 3D</h1>
          <p className="text-slate-400 text-sm text-center">
            Inicia sesión o crea una cuenta usando tu correo. Te enviaremos un enlace mágico.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-3">
            <CheckCircle className="w-10 h-10" />
            <div>
              <p className="font-semibold text-emerald-300">¡Enlace enviado!</p>
              <p className="text-sm mt-1">Revisa tu bandeja de entrada o la carpeta de spam para iniciar sesión.</p>
            </div>
            <button 
              onClick={() => setIsSuccess(false)}
              className="text-emerald-500 hover:text-emerald-400 text-sm font-medium mt-2"
            >
              Volver a intentar
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="email" 
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@empresa.com" 
                  required
                  className="w-full bg-[#121A2F] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/50 focus:border-[#FF5A1F]"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                {errorMsg}
              </p>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-[#FF5A1F] hover:bg-[#E04A15] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,90,31,0.2)] text-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Enlace Mágico'
              )}
            </button>
          </form>
        )}

        <p className="mt-8 text-xs text-center text-slate-500">
          Al iniciar sesión, aceptas nuestros <Link href="#" className="underline hover:text-slate-300">Términos de Servicio</Link> y <Link href="#" className="underline hover:text-slate-300">Política de Privacidad</Link>.
        </p>
      </div>
    </div>
  );
}
