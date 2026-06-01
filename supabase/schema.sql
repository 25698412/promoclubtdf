-- ============================================
-- PROMO CLUB TDF - Supabase Schema
-- Basado en checklist técnica del cliente
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLAS PRINCIPALES
-- ============================================

-- Perfiles de usuarios (residentes TDF)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  city TEXT,
  -- Validación de residente TDF
  dni TEXT,
  address TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  is_verified_resident BOOLEAN DEFAULT false,
  -- Push notification token
  push_token TEXT,
  -- Sistema de puntos y niveles
  points INTEGER DEFAULT 0,
  level TEXT DEFAULT 'bronze' CHECK (level IN ('bronze', 'silver', 'gold')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Historial de puntos
CREATE TABLE IF NOT EXISTS points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  points_change INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_type TEXT, -- promotion, reward, bonus
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locales comerciales
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  email TEXT,
  website TEXT,
  google_maps_url TEXT,
  logo_url TEXT,
  images TEXT[],
  category TEXT,
  schedule TEXT,
  city TEXT DEFAULT 'Ushuaia' CHECK (city IN ('Ushuaia', 'Río Grande', 'Tolhuin')),
  is_active BOOLEAN DEFAULT true,
  is_founder BOOLEAN DEFAULT false, -- Pines dorados para fundadores
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promociones (incluye ofertas flash)
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  discount_percentage INTEGER,
  discount_text TEXT,
  image_url TEXT,
  -- Ofertas Flash
  is_flash BOOLEAN DEFAULT false,
  flash_duration_minutes INTEGER, -- ej: 30 minutos
  -- Programación de ofertas
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  -- Vigencia normal
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  -- Moderación de contenido
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  moderated_by UUID REFERENCES auth.users(id),
  moderated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Banners destacados (pantalla principal)
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  image_url TEXT NOT NULL,
  link_type TEXT DEFAULT 'promotion', -- promotion, business, external
  link_id UUID,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cupones QR (dinámicos)
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  -- QR dinámico: expira en 60 segundos
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired')),
  redeemed_at TIMESTAMPTZ,
  redeemed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favoritos / Billetera de cupones
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, promotion_id)
);

-- Premios canjeables por puntos
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  points_cost INTEGER NOT NULL,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Canjes de premios
CREATE TABLE IF NOT EXISTS reward_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
  points_spent INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Métricas / Analytics
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- view_promotion, click_promotion, save_promotion, view_business, click_business, redeem_coupon, geofence_enter, geofence_exit
  entity_type TEXT, -- promotion, business, banner, reward
  entity_id UUID,
  user_id UUID REFERENCES auth.users(id),
  metadata JSONB,
  -- Geolocalización
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reglas de puntos (configuración del motor)
CREATE TABLE IF NOT EXISTS points_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  points_per_amount INTEGER DEFAULT 1, -- ej: 1 punto por cada $100
  amount_threshold INTEGER DEFAULT 100,
  points_expiry_days INTEGER DEFAULT 365, -- puntos mueren después de X días
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_level ON user_profiles(level);
CREATE INDEX IF NOT EXISTS idx_user_profiles_push_token ON user_profiles(push_token);
CREATE INDEX IF NOT EXISTS idx_user_profiles_verification ON user_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_points_history_user_id ON points_history(user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_is_active ON businesses(is_active);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_promotions_business_id ON promotions(business_id);
CREATE INDEX IF NOT EXISTS idx_promotions_is_active ON promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_promotions_is_flash ON promotions(is_flash);
CREATE INDEX IF NOT EXISTS idx_promotions_moderation ON promotions(moderation_status);
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_display_order ON banners(display_order);
CREATE INDEX IF NOT EXISTS idx_coupons_user_id ON coupons(user_id);
CREATE INDEX IF NOT EXISTS idx_coupons_token ON coupons(token);
CREATE INDEX IF NOT EXISTS idx_coupons_status ON coupons(status);
CREATE INDEX IF NOT EXISTS idx_coupons_business_id ON coupons(business_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_business_id ON rewards(business_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_entity_id ON analytics_events(entity_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_rules ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES - user_profiles
-- ============================================

CREATE POLICY "Users view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- POLICIES - points_history
-- ============================================

CREATE POLICY "Users view own points history" ON points_history
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- POLICIES - businesses
-- ============================================

CREATE POLICY "Owners view own businesses" ON businesses
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Owners update own businesses" ON businesses
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners insert own businesses" ON businesses
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Public view active businesses" ON businesses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin manage businesses" ON businesses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- POLICIES - promotions
-- ============================================

CREATE POLICY "Business owners view own promotions" ON promotions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = promotions.business_id
      AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Business owners create promotions" ON promotions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = promotions.business_id
      AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Business owners update promotions" ON promotions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = promotions.business_id
      AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Public view active promotions" ON promotions
  FOR SELECT USING (is_active = true AND moderation_status = 'approved');

CREATE POLICY "Admin manage promotions" ON promotions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- POLICIES - banners
-- ============================================

CREATE POLICY "Public view active banners" ON banners
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin manage banners" ON banners
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- POLICIES - coupons
-- ============================================

CREATE POLICY "Users view own coupons" ON coupons
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create coupons" ON coupons
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Business view own coupons" ON coupons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = coupons.business_id
      AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Business validate coupons" ON coupons
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = coupons.business_id
      AND businesses.owner_id = auth.uid()
    )
  );

-- ============================================
-- POLICIES - favorites
-- ============================================

CREATE POLICY "Users manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- POLICIES - rewards
-- ============================================

CREATE POLICY "Public view active rewards" ON rewards
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin manage rewards" ON rewards
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- POLICIES - reward_redemptions
-- ============================================

CREATE POLICY "Users view own redemptions" ON reward_redemptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create redemptions" ON reward_redemptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- POLICIES - analytics_events
-- ============================================

CREATE POLICY "Users insert analytics" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin view analytics" ON analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- POLICIES - points_rules
-- ============================================

CREATE POLICY "Public view points rules" ON points_rules
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin manage points rules" ON points_rules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Regla de puntos por defecto: 1 punto por cada $100
INSERT INTO points_rules (rule_name, points_per_amount, amount_threshold, points_expiry_days) VALUES
  ('Regla estándar', 1, 100, 365)
ON CONFLICT DO NOTHING;

-- ============================================
-- CLOUDFLARE R2 (Almacenamiento de archivos)
-- ============================================
-- Crear 1 bucket en Cloudflare Dashboard > R2 > Create Bucket:
--
-- Bucket name: media
-- Location: Auto
--
-- Luego crear un dominio público para el bucket:
-- R2 > media > Settings > Public Access > Allow Access
-- O configurar un dominio custom: media.promoclubtdf.com
--
-- Organización por carpetas:
--   media/avatars/{user_id}.jpg
--   media/businesses/{business_id}.jpg
--   media/promotions/{promotion_id}.jpg
--   media/banners/{banner_id}.jpg
--   media/rewards/{reward_id}.jpg
--   media/verification/{user_id}.jpg
--
-- Variables de entorno necesarias (en Supabase > Edge Functions > Secrets):
--   R2_ACCOUNT_ID=<tu_account_id_de_cloudflare>
--   R2_ACCESS_KEY_ID=<tu_access_key>
--   R2_SECRET_ACCESS_KEY=<tu_secret_key>
--   R2_BUCKET=media
--   R2_PUBLIC_URL=https://media.tudominio.com  (o el dominio público de R2)

-- ============================================
-- EDGE FUNCTION DEPLOYMENT COMMANDS
-- ============================================
-- Run these after Supabase CLI is configured:
--
-- supabase functions deploy coupon-generate
-- supabase functions deploy coupon-validate
-- supabase functions deploy flash-expire
-- supabase functions deploy send-notification
-- supabase functions deploy geofence-check
-- supabase functions deploy r2-upload
--
-- Cron job for flash expiration (every minute):
-- supabase cron add flash-expire-cron "*/1 * * * *" "SELECT net.http_post(url:='https://YOUR_PROJECT.supabase.co/functions/v1/flash-expire', headers:=jsonb_build_object('Authorization','Bearer YOUR_SERVICE_ROLE_KEY'))"

-- Categorías de ejemplo
INSERT INTO businesses (name, category, address, city, is_active) VALUES
  ('Café del Centro', 'Gastronomía', 'Av. San Martín 123', 'Ushuaia', true),
  ('Librería Austral', 'Comercio', 'Av. Maipú 456', 'Ushuaia', true),
  ('Óptica del Sur', 'Servicios', 'Calle Rivadavia 789', 'Río Grande', true)
ON CONFLICT DO NOTHING;
