import Link from "next/link";
import { ArrowRight, Box, Settings, Smartphone } from "lucide-react";
import GrillConfigurator from "@/components/GrillConfigurator";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF5A1F] to-orange-400 rounded-lg flex items-center justify-center">
                <Box className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">SolarFluidity</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Iniciar Sesión
              </Link>
              <Link href="/upgrade" className="text-sm font-bold bg-white text-black hover:bg-slate-200 px-4 py-2 rounded-full transition-colors">
                Probar Pro
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-[#FF5A1F]/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
            Diseño 3D <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-orange-400">Paramétrico</span> para Fabricantes
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
            Aumenta tus conversiones permitiendo a tus clientes configurar y visualizar tus productos en 3D interactivo. Cero código. Cero plugins.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-[#FF5A1F] hover:bg-[#E04A15] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,90,31,0.3)]">
              Comenzar Gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/upgrade" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors border border-white/10">
              Ver Planes
            </Link>
          </div>
        </div>
      </section>

      {/* Configurator Showcase Section */}
      <section className="py-12 bg-black/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Prueba el Configurador en Vivo</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Este es el modelo "Parrilla Híbrida" (Dogfooding). Observa cómo se escala paramétricamente de forma inteligente sin distorsionar los accesorios.
            </p>
          </div>

          {/* Renderizamos el componente 3D creado en v5.1.1 */}
          <GrillConfigurator />

        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] group-hover:bg-blue-500/20 transition-colors" />
            <Box className="w-10 h-10 text-blue-400 mb-6 relative z-10" />
            <h3 className="text-xl font-bold text-white mb-3 relative z-10">Exportación a FreeCAD</h3>
            <p className="text-slate-400 relative z-10">
              Usa tus modelos `.glb` base. La plataforma gestiona las reglas paramétricas sin necesidad de reescribir software.
            </p>
          </div>
          
          <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5A1F]/10 blur-[50px] group-hover:bg-[#FF5A1F]/20 transition-colors" />
            <Smartphone className="w-10 h-10 text-[#FF5A1F] mb-6 relative z-10" />
            <h3 className="text-xl font-bold text-white mb-3 relative z-10">Embed Universal</h3>
            <p className="text-slate-400 relative z-10">
              Copia y pega un script en tu e-commerce (Shopify, WordPress, etc) para incrustar el visor al instante.
            </p>
          </div>
          
          <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] group-hover:bg-emerald-500/20 transition-colors" />
            <Settings className="w-10 h-10 text-emerald-400 mb-6 relative z-10" />
            <h3 className="text-xl font-bold text-white mb-3 relative z-10">Restricciones Físicas</h3>
            <p className="text-slate-400 relative z-10">
              Establece límites máximos y mínimos para evitar que los clientes configuren productos imposibles de fabricar.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Box className="w-6 h-6 text-[#FF5A1F]" />
            <span className="text-lg font-bold text-white tracking-tight">SolarFluidity</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} SolarFluidity Studio. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
