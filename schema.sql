-- Perfil de usuario extendido (1:1 con auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'normal' CHECK (plan IN ('normal','pro')),
  paypal_subscription_id TEXT UNIQUE,
  paypal_plan_id TEXT,          -- 'pro_standard' o 'pro_earlybird'
  subscription_status TEXT DEFAULT 'inactive'
    CHECK (subscription_status IN ('active','trialing','cancelled','past_due','inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_paypal_sub ON profiles(paypal_subscription_id);

-- Modelos 3D guardados
CREATE TABLE models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  parameters JSONB NOT NULL DEFAULT '{}',
  glb_url TEXT,
  step_url TEXT,
  public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Log de eventos de PayPal (para auditoría)
CREATE TABLE paypal_events (
  id SERIAL PRIMARY KEY,
  event_type TEXT,
  raw_body JSONB,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referidos
CREATE TABLE referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES profiles(id),
  referred_email TEXT,
  subscription_activated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seguridad Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users own models" ON models FOR ALL USING (auth.uid() = user_id);
