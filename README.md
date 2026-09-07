# Sesiones MUX

Gestor visual de las sesiones del Máster en UX de EDEM (Next.js, App Router). Sin login: cualquiera con el enlace ve y edita. El guardado es compartido de verdad porque vive en Supabase (plan gratuito), no en el navegador de cada persona.

## Desarrollo local

```bash
npm install
cp .env.local.example .env.local   # y rellénalo (ver paso 1 abajo)
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## 1. Crear la base de datos en Supabase (gratis, una sola vez)

1. Crea una cuenta y un proyecto en [supabase.com](https://supabase.com) (plan Free).
2. En **SQL Editor**, ejecuta:

   ```sql
   create table sesiones_store (
     key text primary key,
     value jsonb not null,
     updated_at timestamptz not null default now()
   );
   alter table sesiones_store enable row level security;
   create policy "public read"   on sesiones_store for select using (true);
   create policy "public insert" on sesiones_store for insert with check (true);
   create policy "public update" on sesiones_store for update using (true) with check (true);
   ```

   Esto deja la tabla abierta a lectura y escritura sin autenticación (a propósito: no hay login).

3. Ve a **Project Settings → API** y copia la **Project URL** y la clave **anon public**.
4. Pégalas en `.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-public
   ```

   La clave `anon` es pública por diseño (Supabase la protege con las políticas de la tabla, no con secretismo).

## 2. Desplegar en Vercel

```bash
npx vercel --prod
```

La primera vez te pedirá iniciar sesión en Vercel (solo tú, como responsable del despliegue). Next.js se detecta automáticamente, no hace falta configurar nada.

Añade las variables de entorno en el proyecto de Vercel (**Settings → Environment Variables**) con los mismos valores de `.env.local` — si no, la app se despliega pero no encuentra Supabase. Tras añadirlas, vuelve a desplegar (`vercel --prod`) para que se apliquen.

Al terminar obtienes una URL fija tipo `https://sesiones-mux.vercel.app` — ese es el enlace que compartes con las dos personas que usan la app. Ellas no necesitan cuenta de Vercel ni de Supabase: solo abrir el enlace.

## 3. Comprobar que el guardado es realmente compartido

1. Abre el enlace de Vercel en un navegador.
2. Abre el mismo enlace en **otro navegador distinto**, o en una ventana de **incógnito** (una pestaña normal del mismo navegador puede compartir caché, así que usa incógnito o un navegador distinto para una prueba real).
3. En el primero, añade una sesión nueva (o edita/borra una existente).
4. En el segundo, recarga la página (F5). Deberías ver el mismo cambio reflejado ahí, sin haberlo tocado en esa ventana.

Si el cambio no aparece, revisa la consola del navegador (F12 → Console): lo más probable es que falten las variables de entorno en Vercel, o alguna política de la tabla del paso 1.2.

## Estructura del proyecto

```
app/page.js               página principal (estado, orquestación)
app/layout.js, globals.css  layout raíz y estilos (tokens EDEM, tipografía Telegraf)
components/                Header, SessionCard, SessionFormModal, DeleteModal
lib/supabase.js            lectura/escritura contra Supabase
lib/seed.js                136 sesiones reales del máster (contenido inicial)
lib/helpers.js             formateo de fechas, colores por tipo de sesión
public/fonts/               Telegraf Regular y Bold
```

## Notas

- No hay analíticas, exportaciones, roles ni notificaciones — solo alta, edición y borrado de sesiones agrupadas por bloque, como en el diseño original.
- Los cambios se ven en otras pestañas al recargar la página, no en tiempo real sin recargar (no se pidió esto último).
- La primera vez que alguien abre la app con la base de datos vacía, las 136 sesiones de `lib/seed.js` se guardan automáticamente en Supabase.
