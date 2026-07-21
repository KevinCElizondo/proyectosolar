import { notFound } from 'next/navigation';
import ViewerClient from '@/components/ViewerClient';
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';

export const revalidate = 60;

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

async function getModel(userId: string, modelId: string) {
  const supabase = getClient();
  const { data } = await supabase
    .from('models')
    .select('id, user_id, name, file_url, format, public, call_to_action_url')
    .eq('id', modelId)
    .eq('user_id', userId)
    .eq('public', true)
    .maybeSingle();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ userId: string; modelId: string }> }): Promise<Metadata> {
  const { userId, modelId } = await params;
  const model = await getModel(userId, modelId);
  if (!model) return { title: 'Modelo no encontrado' };
  return {
    title: `${model.name} · SolarFluidity`,
    description: `Visualiza ${model.name} en 3D interactivo.`,
  };
}

export default async function PublicModelPage({ params }: { params: Promise<{ userId: string; modelId: string }> }) {
  const { userId, modelId } = await params;
  const model = await getModel(userId, modelId);
  if (!model) notFound();

  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-200 flex flex-col">
      <header className="p-6 border-b border-white/10 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">{model.name}</h1>
        {model.call_to_action_url && (
          <a
            href={model.call_to_action_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FF5A1F] hover:bg-[#E04A15] text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Comprar / Más info
          </a>
        )}
      </header>
      <div className="flex-1 min-h-[70vh]">
        <ViewerClient url={model.file_url} format={model.format as 'stl' | 'glb'} />
      </div>
    </main>
  );
}
