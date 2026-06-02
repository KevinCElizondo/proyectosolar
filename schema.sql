-- Creación segura de tablas (sintaxis corregida)
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  custom_domain TEXT UNIQUE,
  name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#2C3E50',
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  stripe_customer_id TEXT,
  -- Campos de iluminación personalizable (solo relevantes en pro)
  hdri_url TEXT,
  light_intensity DECIMAL DEFAULT 1.0,
  light_direction JSONB,  -- {x, y, z}
  color_temperature INTEGER DEFAULT 5500,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  model_url TEXT NOT NULL,          -- GLB optimizado con Draco
  thumbnail_url TEXT,
  base_price DECIMAL(10,2),
  textures JSONB,                   -- { "madera": ["url1", "url2"], "metal": [...] }
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Panel de banners (sin comisiones, solo almacenamiento)
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL,
  position TEXT CHECK (position IN ('sidebar', 'banner_top', 'popup')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cupones (descuentos aplicables a suscripción Pro)
CREATE TABLE IF NOT EXISTS coupons (
  code TEXT PRIMARY KEY,
  discount_percent INT DEFAULT 0,
  free_months INT DEFAULT 0,
  max_uses INT,
  used_count INT DEFAULT 0,
  expires_at TIMESTAMPTZ
);

-- Habilitar Row Level Security (RLS) para que solo los dueños modifiquen sus tiendas
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad: Stores
CREATE POLICY "Stores are viewable by everyone" ON stores
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own stores" ON stores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stores" ON stores
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stores" ON stores
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas de seguridad: Products
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Users can manage products of their stores" ON products
  FOR ALL USING (
    store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
  );

-- Políticas de seguridad: Banners
CREATE POLICY "Banners are viewable by everyone" ON banners
  FOR SELECT USING (true);

CREATE POLICY "Users can manage banners of their stores" ON banners
  FOR ALL USING (
    store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
  );
