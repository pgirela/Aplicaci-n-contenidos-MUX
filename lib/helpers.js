const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export function fmt(iso) {
  if (!iso) return "";
  const p = String(iso).slice(0, 10).split("-");
  if (p.length !== 3) return iso;
  return Number(p[2]) + " " + MESES[Number(p[1]) - 1] + " " + p[0];
}

const COLOR_TIPO = {
  "Sesión de contenido": ["#D8EAFD", "#1E4E7A"],
  Skills: ["#201E1D", "#FFFFFF"],
  Empleabilidad: ["#F5A25A", "#4D2606"],
  Coordinación: ["#F1E3CE", "#6B5636"],
  "Institucional / calendario": ["#E8E6E3", "#4A4544"],
  Extra: ["#FCD6EE", "#8A2E6B"],
  "Pendiente de definir": ["#F9F8F3", "#8B8B8B"],
};

export function colorTipo(tipo, titulo) {
  if (tipo === "Proyecto MUX") {
    const t = (titulo || "").toLowerCase();
    if (t.indexOf("jornada de trabajo") >= 0) return ["#EAD6F5", "#6B3A8E"];
    return ["#8E5BB5", "#FFFFFF"];
  }
  return COLOR_TIPO[tipo] || ["#F2EFE4", "#4A4544"];
}

export function vacio() {
  return { bloque: "", tipo: "", titulo: "", profesor: "", comunicada: "", confirmada: "", objetivos: "", ejemplo: "", indice: "" };
}

export function efectiva(s) {
  return s.confirmada || s.comunicada || "";
}
