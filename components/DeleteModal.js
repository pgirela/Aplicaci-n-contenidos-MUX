"use client";

export default function DeleteModal({ sesion, onConfirmar, onCancelar }) {
  return (
    <div className="dialog-backdrop" style={{ position: "fixed", inset: 0, zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(8, 58, 102, 0.42)" }}>
      <div style={{ width: "100%", maxWidth: 480, background: "#fff", border: "1px solid var(--color-neutral-500)", borderRadius: "var(--radius-lg)", boxShadow: "0 24px 60px rgba(8, 58, 102, 0.22)", padding: 28 }}>
        <h3 style={{ fontSize: 20, margin: "0 0 10px" }}>Borrar sesión</h3>
        <p style={{ fontSize: 14, lineHeight: 1.55, margin: "0 0 6px" }}>
          Vas a borrar <strong>{sesion ? sesion.titulo || "(sin título)" : ""}</strong>.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.55, color: "var(--color-neutral-700)", margin: "0 0 22px" }}>Esta acción no se puede deshacer.</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-primary" onClick={onConfirmar}>
            Sí, borrar
          </button>
          <button className="btn btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
