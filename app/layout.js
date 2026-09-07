import "./globals.css";

export const metadata = {
  title: "Sesiones MUX",
  description: "Gestor visual de las sesiones del Máster en UX de EDEM",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
