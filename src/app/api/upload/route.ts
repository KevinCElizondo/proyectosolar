import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export async function POST(req: NextRequest) {
  const admin = getAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Supabase no está configurado en el servidor.' }, { status: 500 });
  }

  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData?.user) {
    return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
  }
  const userId = userData.user.id;

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const name = String(form.get('name') || '').trim();
  const cta = String(form.get('callToAction') || '').trim();
  const isPublic = String(form.get('public') || 'true') === 'true';

  if (!file || !name) return NextResponse.json({ error: 'Faltan campos' }, { status: 400 });

  const lower = file.name.toLowerCase();
  const isStl = lower.endsWith('.stl');
  const isGlb = lower.endsWith('.glb');
  if (!isStl && !isGlb) {
    return NextResponse.json({ error: 'Solo .stl o .glb' }, { status: 400 });
  }
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: 'Máximo 50MB' }, { status: 400 });
  }

  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${userId}/${crypto.randomUUID()}_${safe}`;

  const { error: upErr } = await admin.storage
    .from('models')
    .upload(path, file, {
      contentType: isStl ? 'model/stl' : 'model/gltf-binary',
      upsert: false,
    });

  if (upErr) {
    console.error('storage upload error', upErr);
    return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 500 });
  }

  const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/models/${path}`;

  const { data: inserted, error: dbErr } = await admin
    .from('models')
    .insert({
      user_id: userId,
      name,
      file_url: fileUrl,
      format: isStl ? 'stl' : 'glb',
      public: isPublic,
      call_to_action_url: cta || null,
    })
    .select('id')
    .single();

  if (dbErr) {
    console.error('db insert error', dbErr);
    return NextResponse.json({ error: 'Error al guardar el modelo' }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: inserted?.id, url: fileUrl });
}
