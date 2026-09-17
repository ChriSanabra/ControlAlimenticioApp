import { useState } from "react";

/* ─── Types ─── */
type Vista = "login" | "registro" | "app";
type Seccion = "inicio" | "agregar" | "despensa" | "urgentes" | "sugerencias" | "usuarios";

interface AuthUser { nombre: string; email: string; password: string; }
interface Alimento { id: number; nombre: string; categoria: string; cantidad: number; dias: number; }
interface User { id: number; nombre: string; apellidos: string; direccion: string; telefono: string; }

/* ─── Constants ─── */
const CATEGORIAS = ["Lácteos", "Frutas", "Verduras", "Carnes", "Granos", "Otros"];

const NAV: { id: Seccion; label: string; icon: string }[] = [
  { id: "inicio",      label: "Inicio",    icon: "🏠" },
  { id: "agregar",     label: "Agregar",   icon: "➕" },
  { id: "despensa",    label: "Despensa",  icon: "🥕" },
  { id: "urgentes",    label: "Urgentes",  icon: "⚠️" },
  { id: "sugerencias", label: "Recetas",   icon: "🍳" },
  { id: "usuarios",    label: "Usuarios",  icon: "👤" },
];

/* ─── Shared styles ─── */
const inputSt: React.CSSProperties = {
  width: "100%", padding: "12px 13px", border: "1px solid #d4ddd1",
  borderRadius: 10, fontSize: 14, color: "#263326", background: "#fafcf9",
  fontFamily: "'Inter',sans-serif", outline: "none",
  appearance: "none", WebkitAppearance: "none",
};
const inputErr: React.CSSProperties = { ...inputSt, border: "1.5px solid #c0392b", background: "#fff8f8" };
const btnGreen: React.CSSProperties = {
  width: "100%", background: "#4a7a3f", color: "white", border: "none",
  padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 700,
  cursor: "pointer", fontFamily: "'Inter',sans-serif",
};
const actBtn: React.CSSProperties = {
  border: "none", padding: "10px", borderRadius: 9, cursor: "pointer",
  fontSize: 12, fontWeight: 600, fontFamily: "'Inter',sans-serif",
};
const badgeSt: Record<string, { background: string; color: string }> = {
  urgent: { background: "#f9dddd", color: "#a53f3f" },
  soon:   { background: "#fff0cc", color: "#9a7018" },
  normal: { background: "#dcefd9", color: "#3d6b34" },
};

/* ─── Helpers ─── */
function getEstado(dias: number) {
  if (dias <= 2) return { texto: "URGENTE", clase: "urgent" as const };
  if (dias <= 5) return { texto: "PRÓXIMO", clase: "soon"   as const };
  return           { texto: "NORMAL",  clase: "normal" as const };
}

/* ─── Sub-components ─── */
function Badge({ clase, texto }: { clase: string; texto: string }) {
  const s = badgeSt[clase] ?? badgeSt.normal;
  return <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", flexShrink: 0, ...s }}>{texto}</span>;
}

function Empty({ icon, msg, sub }: { icon: string; msg: string; sub: string }) {
  return (
    <div style={{ textAlign: "center", padding: "50px 20px" }}>
      <div style={{ fontSize: 46, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 600, color: "#2e4d29", marginBottom: 7 }}>{msg}</div>
      <div style={{ fontSize: 13, color: "#8fa08a", lineHeight: 1.6, whiteSpace: "pre-line" }}>{sub}</div>
    </div>
  );
}

function FGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 600, color: "#4a604a" }}>{label}</label>
      {children}
    </div>
  );
}

function AuthField({ label, type, placeholder, value, onChange }: {
  label: string; type: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div style={{ marginBottom: 15 }}>
      <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#4a604a" }}>{label}</label>
      <input type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)} style={inputSt} />
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: "linear-gradient(135deg,#1a2e18 0%,#2c4a28 50%,#1e3a1c 100%)", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "32px 16px" }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{ position: "absolute", left: -4, top: 120, width: 4, height: 32, background: "#1a1a1a", borderRadius: "4px 0 0 4px" }} />
        <div style={{ position: "absolute", left: -4, top: 164, width: 4, height: 58, background: "#1a1a1a", borderRadius: "4px 0 0 4px" }} />
        <div style={{ position: "absolute", left: -4, top: 232, width: 4, height: 58, background: "#1a1a1a", borderRadius: "4px 0 0 4px" }} />
        <div style={{ position: "absolute", right: -4, top: 172, width: 4, height: 76, background: "#1a1a1a", borderRadius: "0 4px 4px 0" }} />
        <div style={{ width: 390, background: "linear-gradient(160deg,#2d2d2d 0%,#1c1c1c 50%,#111 100%)", borderRadius: 52, padding: 11, boxShadow: "0 0 0 1px #3d3d3d,0 40px 100px rgba(0,0,0,0.8),inset 0 1px 0 rgba(255,255,255,0.07)" }}>
          <div style={{ borderRadius: 42, overflow: "hidden", background: "#000", position: "relative", height: 844 }}>
            <div style={{ position: "absolute", top: 11, left: "50%", transform: "translateX(-50%)", width: 118, height: 34, background: "#000", borderRadius: 22, zIndex: 50 }} />
            {children}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pop     { 0%{transform:scale(0.9);opacity:0} 60%{transform:scale(1.03)} 100%{transform:scale(1);opacity:1} }
        *{-webkit-tap-highlight-color:transparent}
        ::-webkit-scrollbar{display:none}
      `}</style>
    </div>
  );
}

/* ─── App ─── */
let nextFoodId = 1;
let nextUserId = 1;

export default function App() {
  // Auth state
  const [vista,        setVista]        = useState<Vista>("login");
  const [authUsers,    setAuthUsers]    = useState<AuthUser[]>([]);
  const [currentUser,  setCurrentUser]  = useState<AuthUser | null>(null);
  const [loginForm,    setLoginForm]    = useState({ email: "", password: "" });
  const [regAuthForm,  setRegAuthForm]  = useState({ nombre: "", email: "", password: "", confirmar: "" });
  const [loginError,   setLoginError]   = useState("");
  const [regAuthError, setRegAuthError] = useState("");

  // App state
  const [seccion,   setSeccion]   = useState<Seccion>("inicio");
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [foodForm,  setFoodForm]  = useState({ nombre: "", categoria: "Lácteos", cantidad: "", dias: "" });
  const [toast,     setToast]     = useState<string | null>(null);

  // User DB state
  const [users,      setUsers]      = useState<User[]>([]);
  const [userForm,   setUserForm]   = useState({ nombre: "", apellidos: "", direccion: "", telefono: "" });
  const [touched,    setTouched]    = useState({ nombre: false, apellidos: false, direccion: false, telefono: false });
  const [userSuccess, setUserSuccess] = useState(false);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2600); }

  /* ── Auth functions ── */
  function iniciarSesion() {
    setLoginError("");
    if (!loginForm.email || !loginForm.password) { setLoginError("Completa todos los campos."); return; }
    const u = authUsers.find((x) => x.email === loginForm.email && x.password === loginForm.password);
    if (!u) { setLoginError("Correo o contraseña incorrectos."); return; }
    setCurrentUser(u); setLoginForm({ email: "", password: "" }); setVista("app");
  }

  function registrarse() {
    setRegAuthError("");
    if (!regAuthForm.nombre || !regAuthForm.email || !regAuthForm.password || !regAuthForm.confirmar) { setRegAuthError("Completa todos los campos."); return; }
    if (!/\S+@\S+\.\S+/.test(regAuthForm.email)) { setRegAuthError("Ingresa un correo válido."); return; }
    if (regAuthForm.password.length < 6) { setRegAuthError("La contraseña debe tener al menos 6 caracteres."); return; }
    if (regAuthForm.password !== regAuthForm.confirmar) { setRegAuthError("Las contraseñas no coinciden."); return; }
    if (authUsers.find((x) => x.email === regAuthForm.email)) { setRegAuthError("Ya existe una cuenta con ese correo."); return; }
    const nuevo: AuthUser = { nombre: regAuthForm.nombre, email: regAuthForm.email, password: regAuthForm.password };
    setAuthUsers((p) => [...p, nuevo]); setCurrentUser(nuevo);
    setRegAuthForm({ nombre: "", email: "", password: "", confirmar: "" }); setVista("app");
  }

  function cerrarSesion() { setCurrentUser(null); setVista("login"); setSeccion("inicio"); }

  /* ── Food functions ── */
  function agregarAlimento() {
    if (!foodForm.nombre.trim() || !foodForm.cantidad || !foodForm.dias) { showToast("Completa todos los campos."); return; }
    setAlimentos((p) => [...p, { id: nextFoodId++, nombre: foodForm.nombre.trim(), categoria: foodForm.categoria, cantidad: Number(foodForm.cantidad), dias: Number(foodForm.dias) }]);
    setFoodForm({ nombre: "", categoria: "Lácteos", cantidad: "", dias: "" });
    showToast("✓ Alimento agregado.");
  }

  function comer(id: number) {
    const a = alimentos.find((x) => x.id === id);
    setAlimentos((p) => p.filter((x) => x.id !== id));
    if (a) showToast(`¡Consumiste ${a.nombre}!`);
  }

  function eliminar(id: number) {
    setAlimentos((p) => p.filter((x) => x.id !== id));
    showToast("Alimento eliminado.");
  }

  /* ── User DB functions ── */
  function guardarUsuario() {
    const allTouched = { nombre: true, apellidos: true, direccion: true, telefono: true };
    setTouched(allTouched);
    if (!userForm.nombre || !userForm.apellidos || !userForm.direccion || !userForm.telefono) {
      showToast("⚠️ Ningún campo puede estar vacío.");
      return;
    }
    setUsers((p) => [...p, { id: nextUserId++, ...userForm }]);
    setUserForm({ nombre: "", apellidos: "", direccion: "", telefono: "" });
    setTouched({ nombre: false, apellidos: false, direccion: false, telefono: false });
    setUserSuccess(true);
    setTimeout(() => setUserSuccess(false), 3000);
  }

  /* ── Derived data ── */
  const urgentes     = alimentos.filter((a) => a.dias <= 5);
  const soloUrgentes = alimentos.filter((a) => a.dias <= 2);
  const nombres      = alimentos.map((a) => a.nombre.toLowerCase());

  const recetas: { nombre: string; descripcion: string; tag: string }[] = [];
  if (nombres.includes("leche") && nombres.includes("tomate"))
    recetas.push({ nombre: "Crema de tomate", descripcion: "Utiliza leche y tomate para una crema sencilla y reconfortante.", tag: "Sopa" });
  if (nombres.includes("huevo") && nombres.includes("tomate") && nombres.includes("queso"))
    recetas.push({ nombre: "Omelette de tomate y queso", descripcion: "Combina huevo, tomate y queso para aprovechar varios ingredientes.", tag: "Desayuno" });
  if (nombres.includes("tortilla") && nombres.includes("queso"))
    recetas.push({ nombre: "Quesadillas", descripcion: "Una opción rápida para aprovechar tortillas y queso.", tag: "Snack" });

  const titles: Record<Seccion, string> = {
    inicio: "FoodSaver", agregar: "Agregar alimento", despensa: "Mi despensa",
    urgentes: "Urgentes", sugerencias: "Sugerencias", usuarios: "Usuarios",
  };

  /* ══════════════════════════════════════
     LOGIN
  ══════════════════════════════════════ */
  if (vista === "login") return (
    <PhoneFrame>
      <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg,#3a6b30 0%,#2e5226 36%,#f2f5f0 36%)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "56px 28px 0", color: "white" }}>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 30, fontWeight: 700 }}>FoodSaver</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4, fontStyle: "italic" }}>Come primero, desperdicia menos.</div>
          <div style={{ fontSize: 36, marginTop: 10 }}>🌱</div>
        </div>
        <div style={{ flex: 1, background: "#f2f5f0", marginTop: 20, borderRadius: "24px 24px 0 0", padding: "28px 24px", overflowY: "auto", animation: "slideUp 0.3s ease" }}>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#2e4d29", marginBottom: 6 }}>Iniciar sesión</div>
          <div style={{ fontSize: 13, color: "#8fa08a", marginBottom: 22 }}>Bienvenido de vuelta</div>
          <AuthField label="Correo electrónico" type="email" placeholder="correo@ejemplo.com" value={loginForm.email} onChange={(v) => setLoginForm({ ...loginForm, email: v })} />
          <AuthField label="Contraseña" type="password" placeholder="••••••••" value={loginForm.password} onChange={(v) => setLoginForm({ ...loginForm, password: v })} />
          {loginError && <div style={{ background: "#f9dddd", color: "#a53f3f", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{loginError}</div>}
          <button onClick={iniciarSesion} style={btnGreen}>Ingresar</button>
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#8fa08a" }}>
            ¿No tienes cuenta?{" "}
            <span onClick={() => { setVista("registro"); setLoginError(""); }} style={{ color: "#4a7a3f", fontWeight: 700, cursor: "pointer" }}>Regístrate</span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );

  /* ══════════════════════════════════════
     REGISTRO AUTH
  ══════════════════════════════════════ */
  if (vista === "registro") return (
    <PhoneFrame>
      <div style={{ width: "100%", height: "100%", background: "#f2f5f0", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(135deg,#4a7a3f 0%,#5a8a4e 100%)", padding: "54px 24px 22px", color: "white" }}>
          <button onClick={() => { setVista("login"); setRegAuthError(""); }} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", borderRadius: 20, padding: "6px 14px", fontSize: 13, cursor: "pointer", marginBottom: 16 }}>← Volver</button>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700 }}>Crear cuenta</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Únete a FoodSaver</div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", animation: "slideUp 0.3s ease" }}>
          <AuthField label="Nombre completo" type="text" placeholder="Ej. María García" value={regAuthForm.nombre} onChange={(v) => setRegAuthForm({ ...regAuthForm, nombre: v })} />
          <AuthField label="Correo electrónico" type="email" placeholder="correo@ejemplo.com" value={regAuthForm.email} onChange={(v) => setRegAuthForm({ ...regAuthForm, email: v })} />
          <AuthField label="Contraseña" type="password" placeholder="Mínimo 6 caracteres" value={regAuthForm.password} onChange={(v) => setRegAuthForm({ ...regAuthForm, password: v })} />
          <AuthField label="Confirmar contraseña" type="password" placeholder="Repite tu contraseña" value={regAuthForm.confirmar} onChange={(v) => setRegAuthForm({ ...regAuthForm, confirmar: v })} />
          {regAuthError && <div style={{ background: "#f9dddd", color: "#a53f3f", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{regAuthError}</div>}
          <button onClick={registrarse} style={btnGreen}>Crear cuenta</button>
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#8fa08a" }}>
            ¿Ya tienes cuenta?{" "}
            <span onClick={() => { setVista("login"); setRegAuthError(""); }} style={{ color: "#4a7a3f", fontWeight: 700, cursor: "pointer" }}>Inicia sesión</span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );

  /* ══════════════════════════════════════
     APP
  ══════════════════════════════════════ */
  return (
    <PhoneFrame>
      <div style={{ width: "100%", height: "100%", background: "#f2f5f0", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Status bar */}
        <div style={{ background: "#4a7a3f", padding: "14px 20px 6px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "white", fontSize: 12, fontWeight: 600 }}>9:41</span>
          <span style={{ color: "white", fontSize: 10 }}>●●● WiFi 🔋</span>
        </div>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#4a7a3f 0%,#5a8a4e 100%)", padding: "10px 20px 16px", color: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700 }}>{titles[seccion]}</div>
              {seccion === "inicio" && <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2, fontStyle: "italic" }}>Hola, {currentUser?.nombre.split(" ")[0]} 👋</div>}
            </div>
            <button onClick={cerrarSesion} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", borderRadius: 20, padding: "6px 13px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Salir</button>
          </div>
          {seccion === "inicio" && (
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <div style={{ background: "rgba(255,255,255,0.18)", borderRadius: 10, padding: "9px 14px", flex: 1 }}>
                <div style={{ fontSize: 10, opacity: 0.85, marginBottom: 2 }}>Alimentos</div>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700 }}>{alimentos.length}</div>
              </div>
              <div style={{ background: soloUrgentes.length > 0 ? "rgba(220,80,80,0.28)" : "rgba(255,255,255,0.18)", borderRadius: 10, padding: "9px 14px", flex: 1 }}>
                <div style={{ fontSize: 10, opacity: 0.85, marginBottom: 2 }}>Urgentes</div>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700 }}>{soloUrgentes.length}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.18)", borderRadius: 10, padding: "9px 14px", flex: 1 }}>
                <div style={{ fontSize: 10, opacity: 0.85, marginBottom: 2 }}>Usuarios</div>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700 }}>{users.length}</div>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 15px 90px" }}>

          {/* ── INICIO ── */}
          {seccion === "inicio" && (
            <div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 600, color: "#2e4d29", marginBottom: 12 }}>¿Cómo funciona?</div>
              <div style={{ background: "white", borderRadius: 15, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e4ece1" }}>
                {[
                  { icon: "📝", text: "Registra los alimentos que tienes en casa." },
                  { icon: "🔍", text: "FoodSaver identifica cuáles están por caducar." },
                  { icon: "🍽️", text: "Consulta sugerencias para aprovecharlos." },
                  { icon: "👤", text: "Gestiona los usuarios de tu hogar." },
                ].map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i < 3 ? 12 : 0 }}>
                    <div style={{ width: 34, height: 34, background: "#edf5ea", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{p.icon}</div>
                    <div style={{ fontSize: 13, color: "#4a604a", lineHeight: 1.5, paddingTop: 8 }}>{p.text}</div>
                  </div>
                ))}
              </div>
              {urgentes.length > 0 && (
                <div style={{ marginTop: 18 }}>
                  <div style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 600, color: "#2e4d29", marginBottom: 10 }}>⚠️ Próximos a caducar</div>
                  {urgentes.slice(0, 3).map((a) => {
                    const e = getEstado(a.dias);
                    return (
                      <div key={a.id} style={{ background: "white", borderRadius: 13, padding: "13px 15px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 5px rgba(0,0,0,0.05)", border: "1px solid #e4ece1" }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13, color: "#2e4d29" }}>{a.nombre}</div>
                          <div style={{ fontSize: 11, color: "#8fa08a", marginTop: 1 }}>{a.dias} días restantes</div>
                        </div>
                        <Badge clase={e.clase} texto={e.texto} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── AGREGAR ALIMENTO ── */}
          {seccion === "agregar" && (
            <div style={{ background: "white", borderRadius: 17, padding: "18px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e4ece1" }}>
              <FGroup label="Nombre del alimento">
                <input type="text" placeholder="Ej. Leche" value={foodForm.nombre} onChange={(e) => setFoodForm({ ...foodForm, nombre: e.target.value })} style={inputSt} />
              </FGroup>
              <FGroup label="Categoría">
                <select value={foodForm.categoria} onChange={(e) => setFoodForm({ ...foodForm, categoria: e.target.value })} style={inputSt}>
                  {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </FGroup>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
                <FGroup label="Cantidad">
                  <input type="number" min={1} placeholder="2" value={foodForm.cantidad} onChange={(e) => setFoodForm({ ...foodForm, cantidad: e.target.value })} style={inputSt} />
                </FGroup>
                <FGroup label="Días para caducar">
                  <input type="number" min={0} placeholder="5" value={foodForm.dias} onChange={(e) => setFoodForm({ ...foodForm, dias: e.target.value })} style={inputSt} />
                </FGroup>
              </div>
              <button onClick={agregarAlimento} style={{ ...btnGreen, marginTop: 4 }}>Guardar alimento</button>
            </div>
          )}

          {/* ── DESPENSA ── */}
          {seccion === "despensa" && (
            alimentos.length === 0
              ? <Empty icon="🥕" msg="Tu despensa está vacía." sub="Agrega tu primer alimento." />
              : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {alimentos.map((a) => {
                    const e = getEstado(a.dias);
                    return (
                      <div key={a.id} style={{ background: "white", borderRadius: 15, padding: 15, boxShadow: "0 1px 5px rgba(0,0,0,0.05)", border: "1px solid #e4ece1" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14, color: "#2e4d29" }}>{a.nombre}</div>
                            <div style={{ fontSize: 11, color: "#8fa08a", marginTop: 2 }}>{a.categoria} · {a.cantidad} unidad{a.cantidad !== 1 ? "es" : ""}</div>
                          </div>
                          <Badge clase={e.clase} texto={e.texto} />
                        </div>
                        <div style={{ fontSize: 12, color: "#6a7d6a", marginBottom: 10 }}>Caduca en <strong style={{ color: e.clase === "urgent" ? "#a53f3f" : "#2e4d29" }}>{a.dias} días</strong></div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                          <button onClick={() => comer(a.id)} style={{ ...actBtn, background: "#dcefd9", color: "#3d6b34" }}>✓ Comido</button>
                          <button onClick={() => eliminar(a.id)} style={{ ...actBtn, background: "#f9dddd", color: "#a53f3f" }}>✕ Eliminar</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
          )}

          {/* ── URGENTES ── */}
          {seccion === "urgentes" && (
            urgentes.length === 0
              ? <Empty icon="🎉" msg="¡Todo bajo control!" sub="No tienes alimentos urgentes." />
              : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {urgentes.map((a) => {
                    const e = getEstado(a.dias);
                    return (
                      <div key={a.id} style={{ background: "white", borderRadius: 15, padding: "14px 16px", boxShadow: "0 1px 5px rgba(0,0,0,0.05)", border: `1px solid ${e.clase === "urgent" ? "#f5c6c6" : "#fde9a8"}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14, color: "#2e4d29" }}>{e.clase === "urgent" ? "⚠️" : "🕐"} {a.nombre}</div>
                            <div style={{ fontSize: 12, color: "#6a7d6a", marginTop: 3 }}>Caduca en <strong>{a.dias} días</strong> · {a.categoria}</div>
                          </div>
                          <Badge clase={e.clase} texto={e.texto} />
                        </div>
                      </div>
                    );
                  })}
                </div>
          )}

          {/* ── SUGERENCIAS ── */}
          {seccion === "sugerencias" && (
            recetas.length === 0
              ? <Empty icon="🍳" msg="Sin sugerencias aún." sub={"Agrega leche, tomate,\nhuevo, queso o tortilla."} />
              : <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {recetas.map((r, i) => (
                    <div key={i} style={{ background: "white", borderRadius: 15, padding: 16, boxShadow: "0 1px 5px rgba(0,0,0,0.05)", border: "1px solid #e4ece1" }}>
                      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 600, color: "#3d6b34", marginBottom: 7 }}>🍳 {r.nombre}</div>
                      <p style={{ fontSize: 13, color: "#6a7d6a", lineHeight: 1.6, margin: 0 }}>{r.descripcion}</p>
                      <span style={{ display: "inline-block", marginTop: 10, padding: "4px 11px", background: "#edf5ea", color: "#3d6b34", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{r.tag}</span>
                    </div>
                  ))}
                </div>
          )}

          {/* ── USUARIOS (Room DB) ── */}
          {seccion === "usuarios" && (
            <div>
              {/* Success banner */}
              {userSuccess && (
                <div style={{ background: "#dcefd9", border: "1px solid #a8d5a2", borderRadius: 14, padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12, animation: "pop 0.4s ease" }}>
                  <div style={{ fontSize: 26 }}>✅</div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#2e4d29", fontSize: 14 }}>¡Usuario registrado con éxito!</div>
                    <div style={{ fontSize: 12, color: "#4a7a3f", marginTop: 2 }}>El registro fue guardado en la base de datos.</div>
                  </div>
                </div>
              )}

              {/* Form */}
              <div style={{ background: "white", borderRadius: 17, padding: "18px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e4ece1", marginBottom: 14 }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 600, color: "#2e4d29", marginBottom: 14 }}>Registrar usuario</div>

                {(["nombre", "apellidos", "direccion", "telefono"] as const).map((field) => {
                  const labels: Record<string, string> = { nombre: "Nombre", apellidos: "Apellidos", direccion: "Dirección", telefono: "Teléfono" };
                  const placeholders: Record<string, string> = { nombre: "Ingresa el nombre", apellidos: "Ingresa los apellidos", direccion: "Calle, número, colonia", telefono: "10 dígitos" };
                  const hasError = touched[field] && !userForm[field];
                  return (
                    <div key={field} style={{ marginBottom: 13 }}>
                      <label style={{ display: "block", marginBottom: 5, fontSize: 12, fontWeight: 600, color: "#4a604a" }}>{labels[field]}</label>
                      <input
                        type={field === "telefono" ? "tel" : "text"}
                        placeholder={placeholders[field]}
                        value={userForm[field]}
                        onChange={(e) => setUserForm({ ...userForm, [field]: e.target.value })}
                        style={hasError ? inputErr : inputSt}
                      />
                      {hasError && <div style={{ color: "#c0392b", fontSize: 11, marginTop: 3 }}>Este campo es obligatorio</div>}
                    </div>
                  );
                })}

                <button onClick={guardarUsuario} style={{ ...btnGreen, marginTop: 4 }}>💾 Guardar usuario</button>
              </div>

              {/* User list */}
              {users.length > 0 && (
                <div>
                  <div style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 600, color: "#2e4d29", marginBottom: 10 }}>
                    {users.length} usuario{users.length !== 1 ? "s" : ""} registrado{users.length !== 1 ? "s" : ""}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {users.map((u) => (
                      <div key={u.id} style={{ background: "white", borderRadius: 14, padding: "13px 15px", boxShadow: "0 1px 5px rgba(0,0,0,0.05)", border: "1px solid #e4ece1" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 7 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: "#2e4d29" }}>{u.nombre} {u.apellidos}</div>
                          <span style={{ background: "#edf5ea", color: "#3d6b34", borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 700 }}>ID: {u.id}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#6a7d6a" }}>📍 {u.direccion}</div>
                        <div style={{ fontSize: 12, color: "#6a7d6a", marginTop: 3 }}>📞 {u.telefono}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #e4ece1", display: "flex", zIndex: 100, paddingBottom: 18, boxShadow: "0 -3px 16px rgba(0,0,0,0.07)" }}>
          {NAV.map((item) => {
            const active = seccion === item.id;
            return (
              <button key={item.id} onClick={() => setSeccion(item.id)} style={{ flex: 1, border: "none", background: "transparent", padding: "9px 1px 3px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer", position: "relative" }}>
                {active && <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 24, height: 3, background: "#4a7a3f", borderRadius: "0 0 4px 4px" }} />}
                <span style={{ fontSize: 17 }}>{item.icon}</span>
                <span style={{ fontSize: 8, fontWeight: active ? 700 : 400, color: active ? "#4a7a3f" : "#8fa08a" }}>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Toast */}
        {toast && (
          <div style={{ position: "absolute", bottom: 86, left: "50%", transform: "translateX(-50%)", background: "#2e4d29", color: "white", padding: "10px 20px", borderRadius: 12, fontSize: 12, fontWeight: 500, boxShadow: "0 4px 18px rgba(0,0,0,0.22)", zIndex: 200, whiteSpace: "nowrap", animation: "fadeUp 0.22s ease" }}>
            {toast}
          </div>
        )}

      </div>
    </PhoneFrame>
  );
}
