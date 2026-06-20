import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import GrillConfigurator from "@/components/GrillConfigurator";

export default function HardwareStorePage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF5A1F] to-orange-400 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">SolarFluidity Store</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Mi Cuenta
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] w-[60%] h-[40%] bg-[#FF5A1F]/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Equipamiento Modular</h1>
          <p className="text-lg text-slate-400">
            Diseños paramétricos de alta calidad, fabricados a medida y listos para ensamblar. Personaliza las medidas antes de comprar.
          </p>
        </div>
      </section>

      {/* Catalog: Grill */}
      <section className="py-12 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-3xl font-bold text-white">Parrilla Híbrida Modular</h2>
              <span className="px-3 py-1 rounded-full bg-[#FF5A1F]/20 text-[#FF5A1F] text-xs font-bold">BEST SELLER</span>
            </div>
            <p className="text-slate-400 max-w-2xl">
              Nuestra parrilla estrella. Configura el ancho total según tu espacio. Se envía en formato flat-pack con instrucciones de ensamblaje.
            </p>
          </div>

          <GrillConfigurator />
        </div>
      </section>

      {/* Catalog: Planter (Coming Soon / Static) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 aspect-video bg-slate-800/50 rounded-2xl flex items-center justify-center border border-white/10">
            <span className="text-slate-500 font-medium">Modelo 3D Cama de Cultivo (Próximamente)</span>
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-3xl font-bold text-white">Cama de Cultivo Flat-Pack</h3>
            <p className="text-slate-400">
              Ideal para huertos urbanos. Acero galvanizado y madera tratada. Resistente a la intemperie y completamente modular.
            </p>
            <div className="text-3xl font-bold text-white mb-6">$350</div>
            <button disabled className="py-3 px-6 rounded-xl bg-white/10 text-slate-400 font-medium cursor-not-allowed">
              Próximamente
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} SolarFluidity Store.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-white transition-colors">Volver a SaaS</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
