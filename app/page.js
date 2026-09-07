"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import SessionCard from "@/components/SessionCard";
import SessionFormModal from "@/components/SessionFormModal";
import DeleteModal from "@/components/DeleteModal";
import { leer, escribir } from "@/lib/supabase";
import { SEED_SESIONES } from "@/lib/seed";
import { efectiva } from "@/lib/helpers";

export default function Page() {
  const [sesiones, setSesiones] = useState([]);
  const [cargado, setCargado] = useState(false);
  const [error, setError] = useState(null);
  const [abierta, setAbierta] = useState(null);
  const [form, setForm] = useState(null); // { modo: 'nuevo' | 'editar', id }
  const [borrarId, setBorrarId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const guardado = await leer();
        if (guardado && Array.isArray(guardado) && guardado.length) {
          setSesiones(guardado);
        } else {
          setSesiones(SEED_SESIONES);
          await escribir(SEED_SESIONES);
        }
      } catch (e) {
        console.error(e);
        setError(
          "No se ha podido conectar con el almacenamiento compartido (Supabase). Revisa NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY, y que la tabla 'sesiones_store' exista con las políticas de RLS abiertas."
        );
      }
      setCargado(true);
    })();
  }, []);

  async function persistir(nuevasSesiones) {
    setSesiones(nuevasSesiones);
    try {
      await escribir(nuevasSesiones);
    } catch (e) {
      console.error(e);
      alert("No se ha podido guardar el cambio en el almacenamiento compartido. Comprueba tu conexión e inténtalo de nuevo.");
    }
  }

  function guardarForm(datos) {
    if (form.modo === "editar") {
      persistir(sesiones.map((s) => (s.id === form.id ? Object.assign({}, s, datos) : s)));
    } else {
      persistir(sesiones.concat([Object.assign({ id: "s" + Date.now() }, datos)]));
    }
    setForm(null);
  }

  function confirmarBorrado() {
    persistir(sesiones.filter((s) => s.id !== borrarId));
    setBorrarId(null);
    setAbierta(null);
  }

  const nombres = [];
  sesiones.forEach((s) => {
    const b = s.bloque || "Sin bloque";
    if (nombres.indexOf(b) < 0) nombres.push(b);
  });
  nombres.sort((a, b) => a.localeCompare(b, "es", { numeric: true }));

  const bloquesExistentes = [];
  sesiones.forEach((s) => {
    if (s.bloque && bloquesExistentes.indexOf(s.bloque) < 0) bloquesExistentes.push(s.bloque);
  });
  const tiposExistentes = [];
  sesiones.forEach((s) => {
    if (s.tipo && tiposExistentes.indexOf(s.tipo) < 0) tiposExistentes.push(s.tipo);
  });

  const sesionEnEdicion = form && form.modo === "editar" ? sesiones.find((s) => s.id === form.id) : null;
  const sesionABorrar = borrarId ? sesiones.find((s) => s.id === borrarId) : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      {error ? (
        <div className="banner-msg banner-error" style={{ position: "sticky", top: 0, zIndex: 30 }}>
          {error}
        </div>
      ) : !cargado ? (
        <div className="banner-msg banner-info" style={{ position: "sticky", top: 0, zIndex: 30 }}>
          Cargando sesiones…
        </div>
      ) : null}

      <Header sesiones={sesiones} bloques={nombres} onNuevaSesion={() => setForm({ modo: "nuevo", id: null })} />

      <main style={{ maxWidth: 1440, margin: "0 auto", padding: "0 32px 120px" }}>
        {nombres.map((nombre, i) => {
          const lista = sesiones
            .filter((s) => (s.bloque || "Sin bloque") === nombre)
            .slice()
            .sort((a, b) => {
              const fa = efectiva(a),
                fb = efectiva(b);
              if (!fa && !fb) return (a.titulo || "").localeCompare(b.titulo || "", "es");
              if (!fa) return 1;
              if (!fb) return -1;
              return fa < fb ? -1 : fa > fb ? 1 : 0;
            });
          const pend = lista.filter((s) => !s.confirmada).length;

          return (
            <section key={nombre} id={`bloque-${i}`} style={{ scrollMarginTop: 140, paddingTop: 44 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 24, borderBottom: "2px solid var(--color-primary)", paddingBottom: 10 }}>
                <h2 style={{ fontSize: 22, letterSpacing: "-0.01em" }}>{nombre}</h2>
                <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-neutral-700)", whiteSpace: "nowrap" }}>
                  {lista.length} sesiones · {pend} pendientes
                </div>
              </div>
              {lista.map((s) => (
                <SessionCard
                  key={s.id}
                  s={s}
                  abierta={abierta === s.id}
                  onToggle={() => setAbierta(abierta === s.id ? null : s.id)}
                  onEditar={() => setForm({ modo: "editar", id: s.id })}
                  onBorrar={() => setBorrarId(s.id)}
                />
              ))}
            </section>
          );
        })}
      </main>

      {form ? (
        <SessionFormModal
          modo={form.modo}
          sesion={sesionEnEdicion}
          bloquesExistentes={bloquesExistentes}
          tiposExistentes={tiposExistentes}
          onGuardar={guardarForm}
          onCerrar={() => setForm(null)}
        />
      ) : null}

      {borrarId ? <DeleteModal sesion={sesionABorrar} onConfirmar={confirmarBorrado} onCancelar={() => setBorrarId(null)} /> : null}
    </div>
  );
}
