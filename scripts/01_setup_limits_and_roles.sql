-- =============================================================
-- SolarFluidity SaaS — Roles, Limits & Superuser Setup
-- Ejecutar en: Supabase SQL Editor
-- Proyecto: ypaoqvbjdduumwdhuqjw
-- =============================================================

-- ── PASO 1: Columna de rol en profiles ──────────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'
    CHECK (role IN ('user', 'superuser'));

-- ── PASO 2: Límites por plan para usuarios del SaaS ─────────
-- Free:  hasta 3 modelos guardados
-- Pro:   ilimitado
-- Los 20 slots personales del Superusuario son privados
-- y NO se gestionan aquí — ver: scripts/02_superuser_slots.sql

CREATE OR REPLACE FUNCTION enforce_plan_limit()
RETURNS TRIGGER AS $$
DECLARE
  v_role TEXT;
  v_plan TEXT;
  v_count INT;
BEGIN
  SELECT role, plan INTO v_role, v_plan
  FROM profiles
  WHERE id = NEW.user_id;

  -- Superusuario: acceso total, sin restricciones
  IF v_role = 'superuser' THEN
    RETURN NEW;
  END IF;

  -- Pro: ilimitado
  IF v_plan = 'pro' THEN
    RETURN NEW;
  END IF;

  -- Free: máximo 3 modelos
  SELECT COUNT(*) INTO v_count
  FROM models
  WHERE user_id = NEW.user_id;

  IF v_count >= 3 THEN
    RAISE EXCEPTION 'Plan gratuito: máximo 3 modelos. Actualiza a Pro para continuar.'
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── PASO 3: Aplicar trigger ──────────────────────────────────
DROP TRIGGER IF EXISTS trg_enforce_plan_limit ON models;
CREATE TRIGGER trg_enforce_plan_limit
  BEFORE INSERT ON models
  FOR EACH ROW
  EXECUTE FUNCTION enforce_plan_limit();

-- ── PASO 4: Asignar Superusuario ─────────────────────────────
-- kevincordero@solarfluidity.com → acceso ILIMITADO
UPDATE profiles
  SET role = 'superuser',
      plan = 'pro',
      subscription_status = 'active'
WHERE email = 'kevincordero@solarfluidity.com';

-- ── PASO 5: Verificación ─────────────────────────────────────
SELECT id, email, plan, role, subscription_status
FROM profiles
WHERE email = 'kevincordero@solarfluidity.com';

-- =============================================================
-- NOTA: Si la fila no existe, registrate primero en la app
-- con ese email y luego ejecuta solo el PASO 4.
-- =============================================================
