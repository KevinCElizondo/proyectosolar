'use client';
import { Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [copied, setCopied] = useState(false);
  const storeId = "store_ex123xyz";
  
  const embedCode = `<script src="https://solarfluidity.com/embed.js" data-store-id="${storeId}"></script>\n<div id="solarfluidity-viewer" style="width: 100%; height: 500px;"></div>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Configuración e Integración</h1>
        <p className="text-slate-400">Administra los detalles de tu tienda y obtén el código para incrustar el visualizador.</p>
      </header>

      <div className="space-y-12">
        {/* Perfil Store */}
        <section className="glass-panel p-8 rounded-2xl border border-white/5">
          <h2 className="text-xl font-semibold text-white mb-6">Detalles de la Tienda</h2>
          
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Nombre de la Tienda</label>
                <input 
                  type="text" 
                  defaultValue="Tienda Ejemplo"
                  className="w-full bg-[#121A2F] border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/50 focus:border-[#FF5A1F]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Dominio Autorizado (CORS)</label>
                <input 
                  type="text" 
                  defaultValue="https://mi-tienda.com"
                  className="w-full bg-[#121A2F] border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/50 focus:border-[#FF5A1F]"
                />
                <p className="text-xs text-slate-500">Solo este dominio podrá cargar tu modelo 3D.</p>
              </div>
            </div>
            
            <button className="bg-[#FF5A1F] hover:bg-[#E04A15] text-white font-medium py-2.5 px-6 rounded-xl transition-colors">
              Guardar Cambios
            </button>
          </form>
        </section>

        {/* Embed Widget */}
        <section className="glass-panel p-8 rounded-2xl border border-[#FF5A1F]/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#FF5A1F]" />
          <h2 className="text-xl font-semibold text-white mb-2">Widget Embebido</h2>
          <p className="text-sm text-slate-400 mb-6">Copia este código y pégalo en el HTML de la página de producto donde quieres que aparezca el visualizador.</p>
          
          <div className="relative group">
            <pre className="bg-[#0B0F19] border border-white/10 p-4 rounded-xl overflow-x-auto text-sm font-mono text-slate-300">
              {embedCode}
            </pre>
            <button 
              onClick={copyToClipboard}
              className="absolute top-3 right-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors backdrop-blur-md flex items-center gap-2"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="text-xs font-medium">{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
