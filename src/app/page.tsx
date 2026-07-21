"use client";

import Link from "next/link";
import { ArrowRight, Zap, Box, Smartphone, Settings, Shield, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import GrillConfigurator from "@/components/GrillConfigurator";
import BackgroundConstellation from "@/components/BackgroundConstellation";

// Reusable fade-up animation config
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function Home() {
  return (
    <div className="min-h-screen bg-[#07090F] text-slate-200">

      {/* ── NAVIGATION ─────────────────────────────────────────── */}
      <nav className="border-b border-white/5 bg-[#07090F]/90 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <motion.div {...fadeUp(0)} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF5A1F] to-orange-400 rounded-lg flex items-center justify-center shadow-[0_0_14px_rgba(255,90,31,0.4)]">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Solar Fluidity 3D</span>
            </motion.div>

            <motion.div {...fadeUp(0.1)} className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-300">
                Iniciar Sesión
              </Link>
              <Link
                href="/upgrade"
                className="text-sm font-bold bg-[#FF5A1F] hover:bg-[#E04A15] text-white px-5 py-2 rounded-full transition-all duration-300 glow-orange"
              >
                Probar Pro
              </Link>
            </motion.div>

          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-36 md:pb-32 flex flex-col items-center">
        {/* Live constellation background */}
        <BackgroundConstellation />

        {/* Ambient glow — warm and professional */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#FF5A1F]/10 blur-[160px] rounded-full pointer-events-none z-0" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-[#38BDF8]/5 blur-[120px] rounded-full pointer-events-none z-0" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

          {/* Badge */}
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 text-[#FF7A45] text-xs font-semibold tracking-widest uppercase mb-8">
            <Shield className="w-3 h-3" />
            Plataforma SaaS Certificada · Costa Rica
          </motion.div>

          {/* Main headline */}
          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.05] mb-6">
            Diseño 3D{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-orange-400">
              Paramétrico
            </span>
            <br className="hidden md:block" /> para Fabricantes
          </motion.h1>

          {/* Subheadline */}
          <motion.p {...fadeUp(0.2)} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-4 font-light leading-relaxed">
            Aumenta tus conversiones permitiendo a tus clientes configurar y visualizar
            tus productos en <strong className="text-slate-200 font-semibold">3D interactivo</strong>.
            Sin código. Sin plugins.
          </motion.p>

          {/* Trust signals */}
          <motion.div {...fadeUp(0.3)} className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs text-slate-500 mb-10">
            <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-sky-400" /> SSL · Row Level Security</span>
            <span className="w-px h-4 bg-white/10 hidden sm:block" />
            <span className="flex items-center gap-1.5"><TrendingUp className="w-3 h-3 text-emerald-400" /> Escala sin fricción</span>
          </motion.div>

          {/* CTAs */}
          <motion.div {...fadeUp(0.4)} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-[#FF5A1F] hover:bg-[#E04A15] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 glow-orange"
            >
              Comenzar Gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/upgrade"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20"
            >
              Ver Planes Pro
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ── LIVE CONFIGURATOR ──────────────────────────────────── */}
      <section className="py-20 bg-[#0A0C14]/60 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Prueba el Configurador en Vivo
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
              Modelo "Cama de Cultivo" en tiempo real. Observa cómo escala paramétricamente
              de forma inteligente sin distorsionar los accesorios.
            </p>
          </motion.div>

          <GrillConfigurator />
        </div>
      </section>

      {/* ── FEATURE CARDS ──────────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6">

          {[
            {
              icon: <Box className="w-9 h-9 text-sky-400" />,
              glow: "bg-sky-500/8 group-hover:bg-sky-500/16",
              title: "Integración con SolidWorks (.glb)",
              body: "Sube tus modelos .glb desde SolidWorks. La plataforma gestiona las reglas paramétricas sin necesidad de reescribir software.",
            },
            {
              icon: <Smartphone className="w-9 h-9 text-[#FF5A1F]" />,
              glow: "bg-[#FF5A1F]/8 group-hover:bg-[#FF5A1F]/16",
              title: "Embed Universal",
              body: "Copia y pega un script en tu e-commerce (Shopify, WooCommerce, etc) para incrustar el visor al instante.",
            },
            {
              icon: <Settings className="w-9 h-9 text-emerald-400" />,
              glow: "bg-emerald-500/8 group-hover:bg-emerald-500/16",
              title: "Restricciones Físicas",
              body: "Establece límites máximos y mínimos para evitar que los clientes configuren productos imposibles de fabricar.",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="glass-panel p-8 rounded-3xl relative overflow-hidden group cursor-default"
            >
              <div className={`absolute top-0 right-0 w-40 h-40 blur-[60px] transition-colors duration-500 ${card.glow}`} />
              <div className="relative z-10 mb-5">{card.icon}</div>
              <h3 className="text-lg font-bold text-white mb-3 relative z-10">{card.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed relative z-10">{card.body}</p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* ── SOCIAL PROOF STRIPE ────────────────────────────────── */}
      <section className="border-t border-white/5 py-10 bg-[#0A0C14]/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-xs tracking-widest uppercase mb-6">Tecnología que impulsa fabricantes</p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-slate-600 font-semibold text-sm">
            <span>SolidWorks Compatible</span>
            <span className="w-px h-4 bg-white/10" />
            <span>Three.js · WebGL</span>
            <span className="w-px h-4 bg-white/10" />
            <span>Supabase RLS</span>
            <span className="w-px h-4 bg-white/10" />
            <span>PayPal Integrado</span>
            <span className="w-px h-4 bg-white/10" />
            <span>Make.com Automations</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-[#FF5A1F] to-orange-400 rounded-md flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">Solar Fluidity 3D</span>
          </div>
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Solar Fluidity 3D Studio. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <Link href="/upgrade" className="hover:text-slate-300 transition-colors">Planes</Link>
            <Link href="/login" className="hover:text-slate-300 transition-colors">Acceso</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
