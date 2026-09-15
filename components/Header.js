"use client";

import { colorTipo } from "@/lib/helpers";

export default function Header({ sesiones, bloques, tipos, filtroTipos, onToggleTipo, onLimpiarFiltro, onNuevaSesion }) {
  const nConfirmadas = sesiones.filter((s) => !!s.confirmada).length;
  const nSinIndice = sesiones.filter((s) => !(s.indice && s.indice.trim())).length;

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--color-bg)", borderBottom: "2px solid var(--color-primary)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "20px 32px 16px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-edem)", fontWeight: 700, marginBottom: 6 }}>
            EDEM · Máster en UX · contenidos
          </div>
          <h1 style={{ fontSize: 34, lineHeight: 1 }}>Sesiones MUX</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 20, fontSize: 12, lineHeight: 1.3 }}>
            <Stat value={sesiones.length} label="sesiones" />
            <Stat value={nConfirmadas} label="confirmadas" color="var(--color-ok)" />
            <Stat value={sesiones.length - nConfirmadas} label="pendientes" color="var(--color-pend)" />
            <Stat value={nSinIndice} label="sin índice" color="#A8410F" />
          </div>
          <button className="btn" onClick={onNuevaSesion} style={{ flex: "none", backgroundColor: "#EE5F42", borderWidth: 0, color: "#fff" }}>
            + Nueva sesión
          </button>
        </div>
      </div>
      <nav style={{ maxWidth: 1440, margin: "0 auto", padding: "0 32px 10px", display: "flex", flexWrap: "wrap", gap: 6 }}>
        {bloques.map((nombre, i) => {
          const corto = nombre.length > 26 ? nombre.slice(0, 25) + "…" : nombre;
          return (
            <a
              key={nombre}
              href={`#bloque-${i}`}
              style={{
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "5px 10px",
                border: "1px solid var(--color-neutral-500)",
                borderRadius: 999,
                color: "var(--color-neutral-800)",
                background: "#fff",
              }}
            >
              {corto}
            </a>
          );
        })}
      </nav>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 32px 12px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-neutral-700)", marginRight: 2 }}>Filtrar por tipo</span>
        <FiltroChip label="Todos" activo={filtroTipos.length === 0} onClick={onLimpiarFiltro} />
        {tipos.map((tipo) => {
          const [bg, fg] = colorTipo(tipo);
          const activo = filtroTipos.includes(tipo);
          return (
            <FiltroChip
              key={tipo}
              label={tipo}
              activo={activo}
              bg={bg}
              fg={fg}
              onClick={() => onToggleTipo(tipo)}
            />
          );
        })}
      </div>
    </header>
  );
}

function FiltroChip({ label, activo, bg, fg, onClick }) {
  const background = activo ? (bg || "var(--color-primary)") : "#fff";
  const color = activo ? (fg || "#fff") : "var(--color-neutral-800)";
  return (
    <button
      onClick={onClick}
      aria-pressed={activo}
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        padding: "4px 10px",
        borderRadius: 999,
        border: activo ? "1px solid transparent" : "1px solid var(--color-neutral-500)",
        background,
        color,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function Stat({ value, label, color }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 20, color: color || "inherit" }}>{value}</div>
      <div style={{ color: "var(--color-neutral-700)" }}>{label}</div>
    </div>
  );
}
