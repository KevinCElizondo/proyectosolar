import Link from 'next/link';
import { LayoutDashboard, Settings, CreditCard, LogOut, Sun, Users } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 glass-panel flex flex-col relative z-20">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <Sun className="w-6 h-6 text-[#FF5A1F]" />
            <span className="font-bold text-lg tracking-wide text-white">SolarFluidity</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-slate-300 hover:text-white">
            <LayoutDashboard className="w-5 h-5 text-[#FF5A1F]" />
            <span className="font-medium">Resumen</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-slate-300 hover:text-white">
            <Settings className="w-5 h-5 text-slate-400" />
            <span className="font-medium">Configuración</span>
          </Link>
          <Link href="/dashboard/billing" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-slate-300 hover:text-white">
            <CreditCard className="w-5 h-5 text-slate-400" />
            <span className="font-medium">Facturación</span>
          </Link>
          <Link href="/dashboard/affiliates" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-slate-300 hover:text-white">
            <Users className="w-5 h-5 text-slate-400" />
            <span className="font-medium">Programa Afiliados</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors text-slate-400 hover:text-red-400">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#FF5A1F]/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="h-full overflow-y-auto p-8 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
