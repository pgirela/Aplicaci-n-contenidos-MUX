// Persistencia compartida — Supabase (plan gratuito), sin login.
// Rellena estas dos variables de entorno en .env.local (ver .env.local.example)
// con los valores de tu proyecto (Project Settings > API).
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const STORE_KEY = "sesiones";

function assertConfigured() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Falta configurar Supabase: define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local (ver .env.local.example)."
    );
  }
}

export async function leer() {
  assertConfigured();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/sesiones_store?key=eq.${STORE_KEY}&select=value`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Lectura fallida (" + res.status + ")");
  const rows = await res.json();
  return rows.length ? rows[0].value : null;
}

export async function escribir(sesiones) {
  assertConfigured();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/sesiones_store?on_conflict=key`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify([{ key: STORE_KEY, value: sesiones, updated_at: new Date().toISOString() }]),
  });
  if (!res.ok) throw new Error("Guardado fallido (" + res.status + ")");
}
