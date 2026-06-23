-- =============================================================
-- SolarFluidity SaaS - Roles, Limits & Superuser Setup
-- Ejecutar en el SQL Editor de Supabase
-- =============================================================

-- 1. Agregar columna 'role' a la tabla profiles (si no existe)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'
    CHECK (role IN ('user', 'superuser'));

-- 2. Función que limita los modelos/espacios a 20 para usuarios normales
CREATE OR REPLACE FUNCTION enforce_model_limit()
RETURNS TRIGGER AS $$
DECLARE
  v_role TEXT;
  v_count INT;
BEGIN
  -- Obtener el rol del usuario
  SELECT role INTO v_role
  FROM profiles
  WHERE id = NEW.user_id;

  -- Superusuario: sin límite
  IF v_role = 'superuser' THEN
    RETURN NEW;
  END IF;

  -- Contar los modelos actuales del usuario
  SELECT COUNT(*) INTO v_count
  FROM models
  WHERE user_id = NEW.user_id;

  -- Bloquear si ya tiene 20 o más
  IF v_count >= 20 THEN
    RAISE EXCEPTION 'Límite de 20 espacios alcanzado. Actualiza tu plan para continuar.'
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Aplicar el trigger ANTES de cada INSERT en models
DROP TRIGGER IF EXISTS trg_enforce_model_limit ON models;
CREATE TRIGGER trg_enforce_model_limit
  BEFORE INSERT ON models
  FOR EACH ROW
  EXECUTE FUNCTION enforce_model_limit();

-- 4. Asignar superusuario al propietario del sistema
-- Este correo tendrá acceso ILIMITADO desde cualquier sesión
UPDATE profiles
  SET role = 'superuser',
      plan = 'pro',
      subscription_status = 'active'
WHERE email = 'kevincordero@solarfluidity.com';

-- 5. Verificar que el cambio se aplicó correctamente
SELECT id, email, plan, role, subscription_status
FROM profiles
WHERE email = 'kevincordero@solarfluidity.com';

-- =============================================================
-- NOTA: Si el usuario aún no existe en la tabla profiles,
-- el UPDATE no afectará filas. En ese caso, registrate primero
-- en la app con ese email y luego vuelve a ejecutar el paso 4.
-- =============================================================
