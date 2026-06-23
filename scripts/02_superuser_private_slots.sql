-- =============================================================
-- SolarFluidity — Slots Privados del Superusuario (Kevin)
-- PRIVADO: Esta tabla NO es accesible por usuarios del SaaS.
-- No se expone en ninguna API pública ni en el frontend.
-- =============================================================

-- ── Tabla de slots personales (solo visible al superusuario) ──
CREATE TABLE IF NOT EXISTS superuser_slots (
  id          SERIAL PRIMARY KEY,
  slot_number INT UNIQUE NOT NULL,            -- 1 al 20
  project_name TEXT,                          -- Nombre del proyecto
  domain      TEXT,                           -- Dominio asignado (ej. grill.solarfluidity.com)
  assigned_to_email TEXT DEFAULT NULL,        -- NULL = slot disponible
  notes       TEXT,                           -- Notas privadas
  assigned_at TIMESTAMPTZ DEFAULT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Insertar los 20 slots vacíos ─────────────────────────────
INSERT INTO superuser_slots (slot_number) VALUES
  (1),(2),(3),(4),(5),
  (6),(7),(8),(9),(10),
  (11),(12),(13),(14),(15),
  (16),(17),(18),(19),(20)
ON CONFLICT (slot_number) DO NOTHING;

-- ── RLS: Solo el superusuario puede ver/editar esta tabla ────
ALTER TABLE superuser_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo superusuario puede acceder a sus slots"
  ON superuser_slots
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role = 'superuser'
    )
  );

-- ── Vista de estado de slots (uso personal) ──────────────────
CREATE OR REPLACE VIEW superuser_slots_status AS
SELECT
  slot_number,
  project_name,
  domain,
  COALESCE(assigned_to_email, '— disponible —') AS asignado_a,
  notes,
  assigned_at,
  CASE WHEN assigned_to_email IS NULL THEN 'libre' ELSE 'usado' END AS estado
FROM superuser_slots
ORDER BY slot_number;

-- ── Ejemplo: asignar slot #1 a un proyecto ───────────────────
-- UPDATE superuser_slots
--   SET project_name = 'Grill Pro',
--       domain = 'grill.solarfluidity.com',
--       assigned_to_email = 'cliente@empresa.com',
--       assigned_at = NOW()
-- WHERE slot_number = 1;

-- ── Ver estado actual de todos los slots ─────────────────────
SELECT * FROM superuser_slots_status;
