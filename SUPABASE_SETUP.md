# SolarFluidity - Guía de setup en Supabase (BYO)

Como este proyecto usa un Supabase externo (no Lovable Cloud), corre el siguiente SQL desde el **SQL Editor** de tu proyecto Supabase.

## 1) Schema, RLS y trigger

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  plan text not null default 'free' check (plan in ('free','pro')),
  paypal_subscription_id text unique,
  paypal_plan_id text,
  subscription_status text default 'inactive',
  is_founder boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.models (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  file_url text not null,
  format text not null check (format in ('stl','glb')),
  public boolean not null default true,
  call_to_action_url text,
  created_at timestamptz default now()
);

create table if not exists public.paypal_events (
  id bigserial primary key,
  event_type text,
  raw_body jsonb,
  created_at timestamptz default now()
);

grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
grant select, insert, update, delete on public.models to authenticated;
grant select on public.models to anon;
grant all on public.models to service_role;
grant all on public.paypal_events to service_role;
grant usage, select on sequence public.paypal_events_id_seq to service_role;

alter table public.profiles enable row level security;
alter table public.models enable row level security;
alter table public.paypal_events enable row level security;

drop policy if exists "own profile select" on public.profiles;
create policy "own profile select" on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

drop policy if exists "own models all" on public.models;
create policy "own models all" on public.models for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "public models read anon" on public.models;
create policy "public models read anon" on public.models for select to anon using (public = true);
drop policy if exists "public models read auth" on public.models;
create policy "public models read auth" on public.models for select to authenticated using (public = true);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();
```

## 2) Storage

1. En Supabase Dashboard → **Storage**, crea un bucket llamado `models` y marca **Public**.
2. Ejecuta estas policies en el SQL Editor:

```sql
drop policy if exists "models public read" on storage.objects;
create policy "models public read" on storage.objects for select to anon, authenticated
  using (bucket_id = 'models');

drop policy if exists "models auth upload own prefix" on storage.objects;
create policy "models auth upload own prefix" on storage.objects for insert to authenticated
  with check (bucket_id = 'models' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "models auth update own" on storage.objects;
create policy "models auth update own" on storage.objects for update to authenticated
  using (bucket_id = 'models' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "models auth delete own" on storage.objects;
create policy "models auth delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'models' and (storage.foldername(name))[1] = auth.uid()::text);
```

## 3) Variables de entorno en Vercel

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=re_...   # opcional; sin ella el build ya no falla
```

## 4) Auth (Magic Link)

En Supabase → Authentication → URL Configuration añade tu dominio de producción (por ejemplo `https://solarfluidity.vercel.app`) en **Site URL** y en **Redirect URLs** incluye `https://tu-dominio/auth/callback`.
