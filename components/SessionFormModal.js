"use client";

import { useState } from "react";
import { vacio } from "@/lib/helpers";

export default function SessionFormModal({ modo, sesion, bloquesExistentes, tiposExistentes, onGuardar, onCerrar }) {
  const base = sesion ? Object.assign(vacio(), sesion) : vacio();
  const fechaInicial = sesion ? sesion.confirmada || sesion.comunicada || "" : "";

  const [titulo, setTitulo] = useState(base.titulo);
  const [bloque, setBloque] = useState(base.bloque);
  const [profesor, setProfesor] = useState(base.profesor);
  const [tipo, setTipo] = useState(base.tipo);
  const [fecha, setFecha] = useState(fechaInicial);
  const [confirmado, setConfirmado] = useState(sesion ? !!sesion.confirmada : false);
  const [objetivos, setObjetivos] = useState(base.objetivos);
  const [ejemplo, setEjemplo] = useState(base.ejemplo);
  const [indice, setIndice] = useState(base.indice);

  function guardar() {
    onGuardar({
      titulo: titulo.trim(),
      bloque: bloque.trim(),
      profesor: profesor.trim(),
      tipo: tipo.trim(),
      confirmada: confirmado ? fecha : "",
      comunicada: fecha,
      objetivos,
      ejemplo,
      indice,
    });
  }

  const colorEstado = confirmado ? "var(--color-ok)" : "var(--color-pend)";

  return (
    <div
      className="dialog-backdrop"
      style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflow: "auto", background: "rgba(8, 58, 102, 0.42)" }}
    >
      <div style={{ width: "100%", maxWidth: 880, background: "#fff", border: "1px solid var(--color-neutral-500)", borderRadius: "var(--radius-lg)", boxShadow: "0 24px 60px rgba(8, 58, 102, 0.22)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px", borderBottom: "1px solid var(--color-divider)", background: "var(--color-crema)" }}>
          <h3 style={{ fontSize: 20 }}>{modo === "editar" ? "Editar sesión" : "Nueva sesión"}</h3>
          <button className="btn btn-ghost" onClick={onCerrar} style={{ fontSize: 12 }}>
            Cancelar
          </button>
        </div>

        <div style={{ padding: "24px 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 24px" }}>
          <div className="field" style={{ gridColumn: "span 2" }}>
            <label>Título de la sesión</label>
            <input className="input" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título de la sesión" />
          </div>
          <div className="field">
            <label>Bloque del máster</label>
            <input className="input" list="lista-bloques" value={bloque} onChange={(e) => setBloque(e.target.value)} placeholder="p. ej. 5. Diseño de interfaces" />
            <datalist id="lista-bloques">
              {bloquesExistentes.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </div>
          <div className="field">
            <label>Profesor/a</label>
            <input className="input" value={profesor} onChange={(e) => setProfesor(e.target.value)} placeholder="Nombre y apellidos" />
          </div>
          <div className="field">
            <label>Tipo</label>
            <input className="input" list="lista-tipos" value={tipo} onChange={(e) => setTipo(e.target.value)} placeholder="p. ej. Sesión de contenido" />
            <datalist id="lista-tipos">
              {tiposExistentes.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 16, alignItems: "start" }}>
            <div className="field">
              <label>Fecha de la sesión</label>
              <input className="input" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>
            <div className="field">
              <label>Estado de la fecha</label>
              <div
                onClick={() => setConfirmado(!confirmado)}
                role="switch"
                aria-checked={confirmado}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setConfirmado(!confirmado);
                  }
                }}
                style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "8px 0" }}
              >
                <span style={{ position: "relative", display: "inline-block", width: 42, height: 22, borderRadius: 999, background: confirmado ? "var(--color-ok)" : "var(--color-neutral-500)", transition: "background 0.15s", flex: "none" }}>
                  <span style={{ position: "absolute", top: 2, left: confirmado ? 22 : 2, width: 18, height: 18, borderRadius: 999, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.28)", transition: "left 0.15s" }} />
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: colorEstado }}>{confirmado ? "Confirmada por el profesor" : "Pendiente de confirmación"}</span>
              </div>
              <div style={{ fontSize: 11.5, lineHeight: 1.45, color: "var(--color-neutral-700)" }}>
                {confirmado ? "Se guarda como fecha confirmada." : "Se guarda como fecha comunicada, a la espera de confirmación."}
              </div>
            </div>
          </div>
          <div className="field" style={{ gridColumn: "span 2" }}>
            <label>Objetivos</label>
            <textarea className="input" rows={6} value={objetivos} onChange={(e) => setObjetivos(e.target.value)} placeholder="Un objetivo por línea" />
          </div>
          <div className="field" style={{ gridColumn: "span 2" }}>
            <label>Ejemplo de aplicabilidad</label>
            <textarea className="input" rows={4} value={ejemplo} onChange={(e) => setEjemplo(e.target.value)} placeholder="Ejemplo concreto de aplicación de la sesión" />
          </div>
          <div className="field" style={{ gridColumn: "span 2" }}>
            <label>Índice del profesor</label>
            <textarea className="input" rows={10} value={indice} onChange={(e) => setIndice(e.target.value)} placeholder="Índice u outline propuesto por el profesor" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, padding: "18px 28px", borderTop: "1px solid var(--color-divider)" }}>
          <button className="btn btn-primary" onClick={guardar}>
            Guardar sesión
          </button>
          <button className="btn btn-secondary" onClick={onCerrar}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
