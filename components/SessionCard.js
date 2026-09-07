"use client";

import { colorTipo, efectiva, fmt } from "@/lib/helpers";

export default function SessionCard({ s, abierta, onToggle, onEditar, onBorrar }) {
  const conf = !!s.confirmada;
  const fe = efectiva(s);
  const color = conf ? "var(--color-ok)" : "var(--color-pend)";
  const estado = conf ? "Confirmada" : fe ? "Pendiente" : "Sin fecha";
  const [tipoBg, tipoFg] = colorTipo(s.tipo, s.titulo);
  const faltaIndice = !(s.indice && s.indice.trim());

  return (
    <article style={{ borderBottom: "1px solid var(--color-divider)", background: abierta ? "var(--color-crema)" : "transparent" }}>
      <div
        className="card-row"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        style={{ display: "grid", gridTemplateColumns: "4px 108px 1fr auto", gap: 16, alignItems: "center", padding: "16px 0", cursor: "pointer" }}
      >
        <div style={{ alignSelf: "stretch", background: color }} />
        <div style={{ fontSize: 12, lineHeight: 1.35, color: "var(--color-neutral-800)" }}>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13, color: "var(--color-text)" }}>{fe ? fmt(fe) : "—"}</div>
          <div style={{ color, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: 10, marginTop: 3 }}>{estado}</div>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, lineHeight: 1.25 }}>{s.titulo || "(sin título)"}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginTop: 4, fontSize: 12, color: "var(--color-neutral-700)" }}>
            <span>{s.profesor || "Profesor/a sin asignar"}</span>
            {s.tipo ? (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: tipoBg,
                  color: tipoFg,
                }}
              >
                {s.tipo}
              </span>
            ) : null}
            {faltaIndice ? (
              <span
                title="El profesor todavía no ha enviado su índice"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#A8410F",
                  background: "#FDEEEA",
                  border: "1px solid var(--color-accent-200)",
                  borderRadius: 999,
                  padding: "2px 8px 2px 6px",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D9542E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Sin índice
              </span>
            ) : null}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, paddingRight: 4 }}>
          <button
            className="btn btn-ghost"
            onClick={(e) => {
              e.stopPropagation();
              onEditar();
            }}
            style={{ fontSize: 11, padding: "6px 10px" }}
          >
            Editar
          </button>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, color: "var(--color-neutral-600)", width: 18, textAlign: "center" }}>
            {abierta ? "−" : "+"}
          </span>
        </div>
      </div>

      {abierta ? (
        <div style={{ padding: "4px 0 28px 128px", display: "grid", gridTemplateColumns: "minmax(280px, 5fr) minmax(320px, 7fr)", gap: 40, alignItems: "start" }}>
          <div>
            <SectionLabel>Objetivos</SectionLabel>
            <div style={{ whiteSpace: "pre-wrap", fontSize: 13.5, lineHeight: 1.6 }}>{s.objetivos || "Sin objetivos registrados."}</div>

            <SectionLabel style={{ margin: "26px 0 10px" }}>Ejemplo de aplicabilidad</SectionLabel>
            <div
              style={{
                whiteSpace: "pre-wrap",
                fontSize: 13.5,
                lineHeight: 1.6,
                background: "var(--color-neutral-300)",
                borderLeft: "3px solid var(--color-edem)",
                padding: "12px 14px",
              }}
            >
              {s.ejemplo || "Sin ejemplo de aplicabilidad registrado."}
            </div>

            <div style={{ marginTop: 26, fontSize: 12, lineHeight: 1.7, color: "var(--color-neutral-800)" }}>
              <div>
                Fecha: <strong style={{ color: "var(--color-text)" }}>{fe ? fmt(fe) : "—"}</strong> · <strong style={{ color }}>{estado}</strong>
              </div>
            </div>
            <button className="btn btn-ghost" onClick={onBorrar} style={{ marginTop: 16, fontSize: 11, padding: "6px 10px", color: "var(--color-accent-700)" }}>
              Borrar sesión
            </button>
          </div>
          <div>
            <SectionLabel>Índice del profesor</SectionLabel>
            <div style={{ whiteSpace: "pre-wrap", fontSize: 13.5, lineHeight: 1.65 }}>{s.indice || "El profesor no ha enviado índice todavía."}</div>
          </div>
        </div>
      ) : null}
    </article>
  );
}

function SectionLabel({ children, style }) {
  return (
    <div
      style={{
        fontSize: 10,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--color-neutral-700)",
        borderBottom: "2px solid var(--color-primary)",
        paddingBottom: 6,
        marginBottom: 10,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
