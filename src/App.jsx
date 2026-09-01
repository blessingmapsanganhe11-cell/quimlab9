import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Beaker, BookOpen, Trophy, Lock, LogOut, User, GraduationCap, ShieldCheck,
  MessageCircle, Send, Upload, FileText, CheckCircle2, XCircle, Award,
  ChevronRight, Plus, Trash2, ExternalLink, Eye, EyeOff, AlertTriangle,
  Sparkles, Home, Library, FlaskConical, Users, ClipboardList, Medal,
  RotateCcw, ChevronLeft, Loader2, X
} from "lucide-react";
import { supabase } from "./supabaseClient";

/* ============================================================
   DADOS ESTÁTICOS — Unidades, exercícios, biblioteca
   ============================================================ */
const UNITS = [
  {
    id: 1,
    title: "Classes dos Compostos Inorgânicos",
    subtitle: "Óxidos, ácidos, bases, indicadores e sais — composição, nomenclatura e propriedades",
    color: "emerald",
    exercises: [
      {
        id: "u1e1",
        q: "Um óxido é um composto binário formado por oxigénio e:",
        options: ["Outro elemento químico", "Hidrogénio apenas", "Um halogéneo apenas", "Água"],
        correct: 0,
        explain: "Um óxido resulta da combinação do oxigénio com outro elemento químico (metal ou não metal)."
      },
      {
        id: "u1e2",
        q: "Os óxidos formados por um metal e oxigénio classificam-se como:",
        options: ["Óxidos ácidos", "Óxidos básicos (metálicos)", "Óxidos neutros", "Hidróxidos"],
        correct: 1,
        explain: "Um óxido metálico (formado por metal + oxigénio) é classificado como óxido básico."
      },
      {
        id: "u1e3",
        q: "Os óxidos formados por um não metal e oxigénio classificam-se como:",
        options: ["Óxidos básicos", "Óxidos ácidos (não metálicos)", "Sais", "Bases"],
        correct: 1,
        explain: "Um óxido não metálico reage com água formando um ácido, por isso é chamado óxido ácido."
      },
      {
        id: "u1e4",
        q: "O óxido de cálcio (CaO), ao reagir com água, forma:",
        options: ["Um ácido", "Uma base — hidróxido de cálcio, Ca(OH)₂", "Um sal", "Apenas gás hidrogénio"],
        correct: 1,
        explain: "Óxido básico + água → base. CaO + H₂O → Ca(OH)₂."
      },
      {
        id: "u1e5",
        q: "A fórmula química correcta do óxido de sódio é:",
        options: ["Na₂O", "NaO₂", "NaO", "Na₂O₂"],
        correct: 0,
        explain: "O sódio tem valência 1 e o oxigénio valência 2, pelo que a fórmula é Na₂O."
      },
      {
        id: "u1e6",
        q: "Segundo Arrhenius, um ácido é uma substância que, em solução aquosa, liberta:",
        options: ["Iões hidróxido (OH⁻)", "Iões hidrogénio (H⁺)", "Electrões livres", "Iões metálicos"],
        correct: 1,
        explain: "Arrhenius definiu ácido como a substância que, dissolvida em água, liberta iões H⁺."
      },
      {
        id: "u1e7",
        q: "Quanto à presença de oxigénio, o ácido sulfúrico (H₂SO₄) classifica-se como:",
        options: ["Hidrácido", "Oxiácido", "Base", "Sal"],
        correct: 1,
        explain: "Por conter oxigénio na sua composição, o H₂SO₄ é um oxiácido."
      },
      {
        id: "u1e8",
        q: "O ácido clorídrico (HCl) é um exemplo de:",
        options: ["Oxiácido", "Hidrácido", "Óxido ácido", "Base"],
        correct: 1,
        explain: "Por não conter oxigénio na sua composição, o HCl é classificado como hidrácido."
      },
      {
        id: "u1e9",
        q: "Quando um ácido reage com um metal reactivo, liberta-se geralmente:",
        options: ["Oxigénio", "Hidrogénio gasoso", "Água apenas", "Um óxido básico"],
        correct: 1,
        explain: "Na reacção de um ácido com um metal reactivo, forma-se um sal e liberta-se hidrogénio gasoso (H₂)."
      },
      {
        id: "u1e10",
        q: "A reacção de um ácido com um óxido básico produz:",
        options: ["Sal e água", "Apenas um gás", "Outro ácido", "Um novo óxido ácido"],
        correct: 0,
        explain: "Ácido + óxido básico → sal + água, de forma semelhante a uma neutralização."
      },
      {
        id: "u1e11",
        q: "O ácido nítrico (HNO₃) é usado principalmente na produção de:",
        options: ["Sabão e detergentes", "Fertilizantes e explosivos", "Vidro", "Cimento"],
        correct: 1,
        explain: "O HNO₃ é matéria-prima essencial na indústria de fertilizantes azotados e de explosivos."
      },
      {
        id: "u1e12",
        q: "Segundo Arrhenius, uma base é uma substância que, em solução aquosa, liberta:",
        options: ["Iões hidrogénio (H⁺)", "Iões hidróxido (OH⁻)", "Iões metálicos livres", "Protões"],
        correct: 1,
        explain: "Uma base, segundo Arrhenius, é a substância que em solução aquosa liberta iões OH⁻."
      },
      {
        id: "u1e13",
        q: "Quanto ao número de iões hidróxido (OH⁻), o hidróxido de cálcio, Ca(OH)₂, classifica-se como:",
        options: ["Monobase", "Dibase", "Tribase", "Um sal"],
        correct: 1,
        explain: "Como possui dois iões OH⁻ na sua fórmula, o Ca(OH)₂ é uma dibase."
      },
      {
        id: "u1e14",
        q: "A reacção entre um ácido e uma base, com formação de sal e água, chama-se:",
        options: ["Oxidação", "Reacção de neutralização", "Combustão", "Decomposição térmica"],
        correct: 1,
        explain: "Ácido + Base → Sal + Água é a chamada reacção de neutralização."
      },
      {
        id: "u1e15",
        q: "Os indicadores ácido-base são substâncias que:",
        options: ["Mudam de massa consoante o pH", "Mudam de cor consoante o meio ser ácido ou básico", "Alteram o estado físico das soluções", "Neutralizam sempre a solução"],
        correct: 1,
        explain: "Os indicadores ácido-base apresentam cores diferentes em meio ácido e em meio básico, permitindo identificar o carácter da solução."
      },
      {
        id: "u1e16",
        q: "A fenolftaleína, um indicador artificial muito utilizado, fica corada (rosa/carmim) em meio:",
        options: ["Ácido", "Básico", "Neutro", "Qualquer meio"],
        correct: 1,
        explain: "A fenolftaleína é incolor em meio ácido/neutro e fica rosa/carmim em meio básico."
      },
      {
        id: "u1e17",
        q: "Segundo Arrhenius, um sal neutro resulta da:",
        options: ["Combustão de um metal", "Neutralização total de um ácido por uma base", "Evaporação simples da água", "Oxidação de um não-metal"],
        correct: 1,
        explain: "Um sal neutro é o produto (além da água) da neutralização total entre um ácido e uma base."
      },
      {
        id: "u1e18",
        q: "A fórmula química correcta do sulfato de cálcio é:",
        options: ["CaSO₄", "CaSO₃", "Ca₂SO₄", "CaS"],
        correct: 0,
        explain: "O ião cálcio (Ca²⁺) combina-se com o ião sulfato (SO₄²⁻) na proporção 1:1, dando CaSO₄."
      },
      {
        id: "u1e19",
        q: "O cloreto de sódio (NaCl), usado na alimentação, é obtido a partir, entre outras fontes, de:",
        options: ["Petróleo", "Água do mar", "Minério de ferro", "Carvão mineral"],
        correct: 1,
        explain: "O NaCl é extraído da água do mar (salinas) e de jazigos de sal-gema."
      },
      {
        id: "u1e20",
        q: "O carbonato de cálcio (CaCO₃), muito comum em Moçambique (mármore e calcário), é usado sobretudo na produção de:",
        options: ["Cimento e vidro", "Sabão", "Ácido sulfúrico", "Plástico"],
        correct: 0,
        explain: "O CaCO₃ é matéria-prima fundamental na produção de cimento, cal viva e vidro."
      }
    ]
  },
  {
    id: 2,
    title: "Estrutura Atómica e Tabela Periódica",
    subtitle: "Partículas subatómicas, isótopos, distribuição electrónica e regularidades periódicas",
    color: "sky",
    exercises: [
      {
        id: "u2e1",
        q: "O modelo atómico que introduziu o conceito de níveis de energia (camadas electrónicas) foi proposto por:",
        options: ["Dalton", "Thomson", "Rutherford", "Bohr"],
        correct: 3,
        explain: "Niels Bohr propôs que os electrões se movem em níveis de energia definidos à volta do núcleo."
      },
      {
        id: "u2e2",
        q: "Segundo o modelo de Rutherford, o átomo é constituído por um núcleo pequeno e denso rodeado por:",
        options: ["Protões livres em movimento", "Uma nuvem de electrões num grande espaço vazio", "Apenas neutrões", "Outro núcleo menor"],
        correct: 1,
        explain: "Rutherford mostrou que o átomo tem um núcleo denso e pequeno, rodeado por um grande espaço vazio onde se movem os electrões."
      },
      {
        id: "u2e3",
        q: "As partículas subatómicas com carga eléctrica positiva chamam-se:",
        options: ["Electrões", "Protões", "Neutrões", "Iões"],
        correct: 1,
        explain: "Os protões, localizados no núcleo, possuem carga eléctrica positiva."
      },
      {
        id: "u2e4",
        q: "As partículas subatómicas sem carga eléctrica chamam-se:",
        options: ["Protões", "Electrões", "Neutrões", "Catiões"],
        correct: 2,
        explain: "Os neutrões, também localizados no núcleo, não possuem carga eléctrica."
      },
      {
        id: "u2e5",
        q: "O número atómico (Z) de um átomo neutro é igual ao número de:",
        options: ["Neutrões no núcleo", "Protões no núcleo (= electrões, se neutro)", "Electrões de valência apenas", "Níveis de energia ocupados"],
        correct: 1,
        explain: "O número atómico corresponde ao número de protões; num átomo neutro, é igual ao número de electrões."
      },
      {
        id: "u2e6",
        q: "O número de massa (A) de um átomo é igual à soma de:",
        options: ["Protões e electrões", "Protões e neutrões", "Neutrões e electrões", "Apenas neutrões"],
        correct: 1,
        explain: "A = Z (nº de protões) + nº de neutrões, pois os electrões têm massa desprezável."
      },
      {
        id: "u2e7",
        q: "Um átomo tem número atómico 12 e número de massa 24. Quantos neutrões possui?",
        options: ["6", "12", "24", "36"],
        correct: 1,
        explain: "Nº de neutrões = A − Z = 24 − 12 = 12."
      },
      {
        id: "u2e8",
        q: "Átomos do mesmo elemento químico, com o mesmo número atómico mas número de massa diferente, chamam-se:",
        options: ["Isóbaros", "Isótopos", "Iões", "Moléculas"],
        correct: 1,
        explain: "Isótopos são átomos do mesmo elemento (mesmo Z) com números de massa diferentes (nº de neutrões diferente)."
      },
      {
        id: "u2e9",
        q: "Átomos de elementos químicos diferentes que possuem o mesmo número de massa chamam-se:",
        options: ["Isótopos", "Isóbaros", "Isómeros", "Catiões"],
        correct: 1,
        explain: "Isóbaros são átomos de elementos diferentes com o mesmo número de massa (A)."
      },
      {
        id: "u2e10",
        q: "Um átomo neutro de cloro (Z = 17) possui quantos electrões?",
        options: ["7", "17", "18", "35"],
        correct: 1,
        explain: "Num átomo neutro, o número de electrões é igual ao número atómico: 17."
      },
      {
        id: "u2e11",
        q: "O cientista que organizou os elementos químicos por ordem crescente da massa atómica e enunciou a lei periódica foi:",
        options: ["Lavoisier", "Dimitri Mendeleev", "Ernest Rutherford", "Niels Bohr"],
        correct: 1,
        explain: "Mendeleev organizou os elementos em 1871 segundo a ordem crescente das massas atómicas, criando a Tabela Periódica."
      },
      {
        id: "u2e12",
        q: "Na Tabela Periódica moderna, as linhas horizontais chamam-se:",
        options: ["Grupos", "Períodos", "Famílias", "Blocos"],
        correct: 1,
        explain: "As linhas horizontais da Tabela Periódica são designadas períodos."
      },
      {
        id: "u2e13",
        q: "Na Tabela Periódica, as colunas verticais chamam-se:",
        options: ["Períodos", "Grupos (ou famílias)", "Séries", "Camadas"],
        correct: 1,
        explain: "As colunas verticais da Tabela Periódica chamam-se grupos ou famílias."
      },
      {
        id: "u2e14",
        q: "Elementos do mesmo grupo da Tabela Periódica apresentam propriedades químicas semelhantes porque possuem o mesmo número de:",
        options: ["Neutrões", "Protões", "Electrões na última camada (electrões de valência)", "Níveis de energia"],
        correct: 2,
        explain: "Elementos do mesmo grupo têm o mesmo número de electrões de valência, o que determina propriedades químicas semelhantes."
      },
      {
        id: "u2e15",
        q: "Qual é a distribuição electrónica correcta, por níveis de energia, do elemento sódio (Z = 11)?",
        options: ["2, 8, 1", "2, 8, 2", "2, 9", "1, 8, 2"],
        correct: 0,
        explain: "O sódio (Z=11) distribui os seus 11 electrões em 2 no 1º nível, 8 no 2º nível e 1 no 3º nível: 2, 8, 1."
      },
      {
        id: "u2e16",
        q: "Ao longo de um grupo, de cima para baixo, o raio atómico dos elementos geralmente:",
        options: ["Diminui", "Aumenta", "Mantém-se constante", "Torna-se nulo"],
        correct: 1,
        explain: "Descendo num grupo, aumenta o número de níveis de energia ocupados, pelo que o raio atómico aumenta."
      },
      {
        id: "u2e17",
        q: "Ao longo de um período, da esquerda para a direita, o carácter metálico dos elementos geralmente:",
        options: ["Aumenta", "Diminui", "Mantém-se constante", "Desaparece por completo"],
        correct: 1,
        explain: "Ao longo do período, o carácter metálico diminui e o carácter ametálico aumenta."
      },
      {
        id: "u2e18",
        q: "A electronegatividade de um elemento mede a sua capacidade de:",
        options: ["Perder electrões facilmente", "Atrair electrões numa ligação química", "Ganhar massa atómica", "Perder protões"],
        correct: 1,
        explain: "A electronegatividade traduz a capacidade de um átomo atrair para si os electrões partilhados numa ligação química."
      },
      {
        id: "u2e19",
        q: "Os gases nobres, muito estáveis, possuem geralmente na última camada:",
        options: ["1 electrão de valência", "2 electrões de valência", "7 electrões de valência", "8 electrões de valência (excepto o Hélio)"],
        correct: 3,
        explain: "A estabilidade dos gases nobres deve-se, em geral, aos 8 electrões na última camada (regra do octeto), excepto o Hélio, que tem 2."
      },
      {
        id: "u2e20",
        q: "Um ião X²⁺ resulta de um átomo neutro X que:",
        options: ["Ganhou 2 electrões", "Perdeu 2 electrões", "Ganhou 2 protões", "Perdeu 2 neutrões"],
        correct: 1,
        explain: "Um catião com carga 2+ forma-se quando o átomo neutro perde 2 electrões, ficando com mais protões do que electrões."
      }
    ]
  }
];

const LIBRARY_LINKS = [
  { name: "Khan Academy (Português)", url: "https://pt.khanacademy.org/science/chemistry", desc: "Vídeo-aulas e exercícios gratuitos de Química em português." },
  { name: "PhET Interactive Simulations", url: "https://phet.colorado.edu/pt/simulations/filter?subjects=chemistry", desc: "Simulações interactivas gratuitas de Química (Universidade do Colorado)." },
  { name: "ChemCollective — Virtual Labs", url: "http://chemcollective.org/vlabs", desc: "Laboratório virtual de Química com experiências guiadas." },
  { name: "LibreTexts Química", url: "https://chem.libretexts.org", desc: "Livros e materiais abertos de Química para todos os níveis." },
  { name: "CK-12 Foundation", url: "https://www.ck12.org/chemistry/", desc: "Recursos e exercícios gratuitos de Ciências e Química." },
  { name: "RSC Learn Chemistry", url: "https://edu.rsc.org", desc: "Recursos didácticos gratuitos da Royal Society of Chemistry." }
];

const TEACHER_CODE = "PROF-B";
const ADMIN_CODE = "ADMIN-S";
const PASS_TO_UNLOCK = 0.6;

const COLOR_MAP = {
  emerald: { bg: "bg-emerald-600", light: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-600", ring: "ring-emerald-500" },
  sky: { bg: "bg-sky-600", light: "bg-sky-50", text: "text-sky-700", border: "border-sky-600", ring: "ring-sky-500" },
  violet: { bg: "bg-violet-600", light: "bg-violet-50", text: "text-violet-700", border: "border-violet-600", ring: "ring-violet-500" },
  amber: { bg: "bg-amber-600", light: "bg-amber-50", text: "text-amber-700", border: "border-amber-600", ring: "ring-amber-500" },
  rose: { bg: "bg-rose-600", light: "bg-rose-50", text: "text-rose-700", border: "border-rose-600", ring: "ring-rose-500" }
};

/* ============================================================
   ARMAZENAMENTO — helpers para Supabase (base de dados real)
   ============================================================ */
// Domínio "falso" usado para transformar o nome de utilizador num email
// aceite pelo Supabase Auth. Ninguém precisa de receber correio nesta
// morada — serve apenas para o sistema de autenticação funcionar com
// nome de utilizador em vez de email.
const AUTH_EMAIL_DOMAIN = "quimlab9.app";
function usernameToEmail(username) {
  return `${username.toLowerCase().trim()}@${AUTH_EMAIL_DOMAIN}`;
}

async function fetchProfileById(id) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}
async function fetchAllProfiles() {
  const { data, error } = await supabase.from("profiles").select("*");
  if (error) { console.error(error); return []; }
  return data || [];
}
async function fetchStudentProfiles() {
  const { data, error } = await supabase.from("profiles").select("*").eq("role", "aluno");
  if (error) { console.error(error); return []; }
  return data || [];
}
async function updateProfile(id, patch) {
  const { error } = await supabase.from("profiles").update(patch).eq("id", id);
  if (error) console.error("Falha ao actualizar perfil", error);
  return !error;
}
async function deleteProfile(id) {
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) console.error("Falha ao remover perfil", error);
}

async function fetchResources() {
  const { data, error } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
  if (error) { console.error(error); return []; }
  return (data || []).map((r) => ({
    id: r.id, title: r.title, type: r.type, unit: r.unit, content: r.content,
    link: r.link, authorName: r.author_name, createdAt: new Date(r.created_at).getTime()
  }));
}
async function createResource({ title, type, unit, content, link, authorId, authorName }) {
  const { error } = await supabase.from("resources").insert({
    title, type, unit: Number(unit), content, link, author_id: authorId, author_name: authorName
  });
  if (error) console.error("Falha ao publicar recurso", error);
  return !error;
}
async function deleteResource(id) {
  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) console.error("Falha ao remover recurso", error);
}

function emptyProgress() {
  const p = {};
  UNITS.forEach((u) => { p[u.id] = { completed: false, answers: {} }; });
  return p;
}
function isUnitUnlocked(user, unitId) {
  if (unitId === UNITS[0].id) return true;
  const idx = UNITS.findIndex((u) => u.id === unitId);
  const prev = UNITS[idx - 1];
  return !!(user.progress && user.progress[prev.id] && user.progress[prev.id].completed);
}
function unitScore(user, unit) {
  const p = user.progress && user.progress[unit.id];
  if (!p) return 0;
  const correct = unit.exercises.filter((ex) => p.answers[ex.id] && p.answers[ex.id].correctAchieved).length;
  return Math.round((correct / unit.exercises.length) * 100);
}

/* ============================================================
   PEQUENOS COMPONENTES DE INTERFACE
   ============================================================ */
function Avatar({ name, size = "w-9 h-9", role }) {
  const initials = (name || "?").trim().split(/\s+/).map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  const bg = role === "professor" ? "bg-sky-700" : role === "administrador" ? "bg-violet-700" : "bg-emerald-700";
  return (
    <div className={`${size} ${bg} rounded-full flex items-center justify-center text-white font-semibold font-display shrink-0`}>
      {initials}
    </div>
  );
}

function RoleBadge({ role }) {
  const map = {
    aluno: { label: "Estudante", cls: "bg-emerald-100 text-emerald-800" },
    professor: { label: "Professor(a)", cls: "bg-sky-100 text-sky-800" },
    administrador: { label: "Administrador", cls: "bg-violet-100 text-violet-800" }
  };
  const m = map[role] || map.aluno;
  return <span className={`text-xs font-medium px-2 py-0.5 rounded ${m.cls}`}>{m.label}</span>;
}

function PointsPill({ points }) {
  return (
    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-full text-sm font-semibold font-display">
      <Sparkles size={15} className="text-amber-500" />
      {points} pts
    </div>
  );
}

/* ============================================================
   ECRÃ DE ENTRADA — Login / Registo
   ============================================================ */
function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("aluno");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const reset = () => { setError(""); };

  const handleLogin = async (e) => {
    e.preventDefault();
    reset();
    if (!username || !password) return setError("Preenche o utilizador e a senha.");
    setBusy(true);
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: usernameToEmail(username),
      password
    });
    if (authError || !data.user) {
      setBusy(false);
      return setError("Utilizador ou senha incorrectos.");
    }
    const profile = await fetchProfileById(data.user.id);
    setBusy(false);
    if (!profile) return setError("Não foi possível carregar o teu perfil. Tenta novamente.");
    onLogin(profile);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    reset();
    if (!name || !username || !password) return setError("Preenche todos os campos obrigatórios.");
    if (password.length < 6) return setError("A senha deve ter pelo menos 6 caracteres.");
    if (role === "professor" && code !== TEACHER_CODE) return setError("Código de professor inválido. Pede-o à direcção da escola.");
    if (role === "administrador" && code !== ADMIN_CODE) return setError("Código de administrador inválido.");
    setBusy(true);
    const uname = username.toLowerCase().trim();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: usernameToEmail(uname),
      password
    });
    if (signUpError || !data.user) {
      setBusy(false);
      return setError(signUpError?.message?.includes("already") ? "Esse nome de utilizador já existe." : "Não foi possível criar a conta. Tenta novamente.");
    }
    // Em alguns projectos Supabase (plano gratuito), a confirmação de email
    // fica forçada e o signUp não devolve sessão activa de imediato. Como a
    // base de dados tem um "trigger" que confirma automaticamente as contas
    // (ver supabase/schema.sql), basta tentar entrar logo a seguir.
    let session = data.session;
    if (!session) {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: usernameToEmail(uname),
        password
      });
      if (signInError || !signInData.session) {
        setBusy(false);
        return setError("Conta criada! Tenta entrar agora com o teu utilizador e senha na aba \"Entrar\".");
      }
      session = signInData.session;
    }
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      username: uname,
      name: name.trim(),
      role,
      points: 0,
      progress: emptyProgress()
    });
    if (profileError) {
      setBusy(false);
      return setError("Esse nome de utilizador já existe.");
    }
    const profile = await fetchProfileById(data.user.id);
    setBusy(false);
    onLogin(profile);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 font-body relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
        backgroundSize: "26px 26px"
      }} />
      <div className="relative w-full max-w-4xl grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        {/* Lado ilustrativo */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 p-8 text-white">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <FlaskConical size={22} />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">QuimLab 9</span>
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight mb-3">
              Química da 9.ª classe,<br />passo a passo.
            </h1>
            <p className="text-emerald-100 text-sm leading-relaxed max-w-xs">
              Resolve exercícios com correcção imediata, sobe unidades, disputa o ranking da turma
              e experimenta o laboratório virtual — tudo num só lugar.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-emerald-50/90">
            <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Feedback automático em cada resposta</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Unidades desbloqueadas por mérito</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Ranking da escola em tempo real</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Professor(a) IA disponível 24/7</li>
          </ul>
        </div>

        {/* Formulário */}
        <div className="bg-white p-8">
          <div className="flex gap-1 mb-6 bg-stone-100 rounded-lg p-1">
            <button onClick={() => { setMode("login"); reset(); }}
              className={`flex-1 py-2 rounded-md text-sm font-semibold font-display transition ${mode === "login" ? "bg-white shadow text-slate-900" : "text-slate-500"}`}>
              Entrar
            </button>
            <button onClick={() => { setMode("register"); reset(); }}
              className={`flex-1 py-2 rounded-md text-sm font-semibold font-display transition ${mode === "register" ? "bg-white shadow text-slate-900" : "text-slate-500"}`}>
              Criar conta
            </button>
          </div>

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <h2 className="font-display font-bold text-xl text-slate-900">Bem-vindo de volta</h2>
              <div>
                <label className="text-xs font-medium text-slate-600">Utilizador</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)}
                  className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="ex: maria.chimoio" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Senha</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-slate-400">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {error && <p className="text-rose-600 text-sm flex items-center gap-1.5"><AlertTriangle size={14} />{error}</p>}
              <button disabled={busy} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold font-display py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2">
                {busy && <Loader2 size={15} className="animate-spin" />} Entrar
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <h2 className="font-display font-bold text-xl text-slate-900">Criar a tua conta</h2>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { k: "aluno", label: "Estudante", icon: GraduationCap },
                  { k: "professor", label: "Professor", icon: BookOpen },
                  { k: "administrador", label: "Admin", icon: ShieldCheck }
                ].map(({ k, label, icon: Icon }) => (
                  <button type="button" key={k} onClick={() => setRole(k)}
                    className={`flex flex-col items-center gap-1 border rounded-lg py-2 text-xs font-medium transition ${role === k ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-slate-200 text-slate-500"}`}>
                    <Icon size={16} /> {label}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Nome completo</label>
                <input value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Nome de utilizador</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)}
                  className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Senha</label>
                <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              {(role === "professor" || role === "administrador") && (
                <div>
                  <label className="text-xs font-medium text-slate-600">Código de acesso ({role === "professor" ? "professor" : "administrador"})</label>
                  <input value={code} onChange={(e) => setCode(e.target.value)}
                    className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="fornecido pela direcção da escola" />
                </div>
              )}
              {error && <p className="text-rose-600 text-sm flex items-center gap-1.5"><AlertTriangle size={14} />{error}</p>}
              <button disabled={busy} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold font-display py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2">
                {busy && <Loader2 size={15} className="animate-spin" />} Criar conta
              </button>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Demonstração: código de professor <span className="font-mono">{TEACHER_CODE}</span> · código de administrador <span className="font-mono">{ADMIN_CODE}</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   BARRA LATERAL
   ============================================================ */
function Sidebar({ user, page, setPage, onLogout }) {
  const alunoItems = [
    { k: "inicio", label: "Unidades", icon: Home },
    { k: "ranking", label: "Ranking", icon: Trophy },
    { k: "lab", label: "Laboratório Virtual", icon: FlaskConical },
    { k: "biblioteca", label: "Biblioteca Virtual", icon: Library },
    { k: "ia", label: "Professor IA", icon: MessageCircle },
    { k: "perfil", label: "Perfil", icon: User }
  ];
  const profItems = [
    { k: "painel_prof", label: "Painel do Professor", icon: ClipboardList },
    { k: "ranking", label: "Ranking dos Alunos", icon: Trophy },
    { k: "biblioteca", label: "Biblioteca Virtual", icon: Library },
    { k: "ia", label: "Professor IA (apoio)", icon: MessageCircle },
    { k: "perfil", label: "Perfil", icon: User }
  ];
  const adminItems = [
    { k: "painel_admin", label: "Painel de Administração", icon: ShieldCheck },
    { k: "ranking", label: "Ranking Geral", icon: Trophy },
    { k: "painel_prof", label: "Recursos dos Professores", icon: ClipboardList },
    { k: "perfil", label: "Perfil", icon: User }
  ];
  const items = user.role === "professor" ? profItems : user.role === "administrador" ? adminItems : alunoItems;

  return (
    <div className="w-64 shrink-0 bg-slate-950 text-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-slate-800 flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center"><FlaskConical size={18} /></div>
        <div>
          <p className="font-display font-bold text-sm leading-none">QuimLab 9</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Química · 9.ª Classe</p>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items.map(({ k, label, icon: Icon }) => (
          <button key={k} onClick={() => setPage(k)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${page === k ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"}`}>
            <Icon size={17} /> {label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-2 px-2 py-2 mb-1">
          <Avatar name={user.name} size="w-8 h-8" role={user.role} />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <RoleBadge role={user.role} />
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-slate-900">
          <LogOut size={16} /> Sair
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   UNIDADES — Lista + Execução de exercícios
   ============================================================ */
function UnitsList({ user, setSelectedUnit }) {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-900 mb-1">As tuas unidades</h1>
      <p className="text-slate-500 text-sm mb-6">Termina uma unidade com sucesso para desbloquear a seguinte.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {UNITS.map((unit, idx) => {
          const unlocked = isUnitUnlocked(user, unit.id);
          const completed = user.progress[unit.id]?.completed;
          const score = unitScore(user, unit);
          const c = COLOR_MAP[unit.color];
          return (
            <button key={unit.id} disabled={!unlocked} onClick={() => setSelectedUnit(unit.id)}
              className={`text-left rounded-xl border p-5 transition relative overflow-hidden ${unlocked ? "bg-white border-slate-200 hover:shadow-md hover:-translate-y-0.5" : "bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed"}`}>
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-semibold font-display px-2 py-1 rounded ${c.light} ${c.text}`}>Unidade {idx + 1}</span>
                {completed ? <CheckCircle2 className="text-emerald-600" size={20} /> : !unlocked ? <Lock className="text-slate-400" size={18} /> : null}
              </div>
              <h3 className="font-display font-bold text-slate-900 mb-1">{unit.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{unit.subtitle}</p>
              {unlocked ? (
                <div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${c.bg}`} style={{ width: `${score}%` }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">{score}% concluído · {unit.exercises.length} exercícios</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 flex items-center gap-1"><Lock size={12} /> Termina a unidade anterior para desbloquear</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ExerciseRunner({ user, unit, saveUser, onBack }) {
  const [order] = useState(() => {
    const arr = [...unit.exercises];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [tabWarnings, setTabWarnings] = useState(0);
  const [finished, setFinished] = useState(false);

  const ex = order[idx];
  const progress = user.progress[unit.id] || { completed: false, answers: {} };
  const alreadyCorrect = progress.answers[ex.id]?.correctAchieved;

  useEffect(() => {
    const onVis = () => { if (document.hidden) setTabWarnings((w) => w + 1); };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const submit = async () => {
    if (selected === null) return;
    const correct = selected === ex.correct;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setSubmitted(true);

    const newProgress = { ...user.progress };
    const up = { ...(newProgress[unit.id] || { completed: false, answers: {} }) };
    up.answers = { ...up.answers };
    const prevEntry = up.answers[ex.id] || { correctAchieved: false, pointsAwarded: false };
    let pointsDelta = 0;

    if (correct && !prevEntry.pointsAwarded) {
      pointsDelta = 10;
      up.answers[ex.id] = { correctAchieved: true, pointsAwarded: true };
    } else if (correct) {
      up.answers[ex.id] = { correctAchieved: true, pointsAwarded: true };
    } else if (newAttempts >= 3) {
      // revela e permite avançar sem pontos após 3 tentativas
      up.answers[ex.id] = { correctAchieved: true, pointsAwarded: prevEntry.pointsAwarded || false };
    } else {
      up.answers[ex.id] = prevEntry;
    }
    newProgress[unit.id] = up;

    const allDone = unit.exercises.every((e) => newProgress[unit.id].answers[e.id]?.correctAchieved);
    let bonus = 0;
    if (allDone && !up.completed) {
      up.completed = true;
      bonus = 20;
      newProgress[unit.id] = up;
    }

    const updatedUser = { ...user, points: user.points + pointsDelta + bonus, progress: newProgress };
    await saveUser(updatedUser);
  };

  const next = () => {
    setSubmitted(false);
    setSelected(null);
    setAttempts(0);
    if (idx < order.length - 1) setIdx(idx + 1);
    else setFinished(true);
  };

  const c = COLOR_MAP[unit.color];
  const correctNow = submitted && selected === ex.correct;
  const forcedReveal = submitted && !correctNow && attempts >= 3;

  if (finished) {
    const score = unitScore(user, unit);
    const completed = user.progress[unit.id]?.completed;
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className={`w-16 h-16 rounded-full ${completed ? "bg-emerald-100" : "bg-amber-100"} flex items-center justify-center mx-auto mb-4`}>
          {completed ? <Trophy className="text-emerald-600" size={28} /> : <RotateCcw className="text-amber-600" size={28} />}
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">
          {completed ? "Unidade concluída!" : "Quase lá!"}
        </h2>
        <p className="text-slate-500 mb-6">Pontuação nesta unidade: <span className="font-semibold text-slate-800">{score}%</span></p>
        <button onClick={onBack} className="bg-emerald-700 hover:bg-emerald-800 text-white font-display font-semibold px-6 py-2.5 rounded-lg text-sm">
          Voltar às unidades
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto" onCopy={(e) => e.preventDefault()}>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-slate-500 mb-4 hover:text-slate-800">
        <ChevronLeft size={16} /> Voltar
      </button>

      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold font-display px-2 py-1 rounded ${c.light} ${c.text}`}>{unit.title}</span>
        <span className="text-xs text-slate-400">Pergunta {idx + 1} de {order.length}</span>
      </div>

      <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg px-3 py-2 mb-4 flex items-start gap-2">
        <ShieldCheck size={14} className="mt-0.5 shrink-0" />
        <span>
          Modo de integridade académica activo: ordem das perguntas aleatória e cópia de texto desactivada.
          {tabWarnings > 0 && <> Mudaste de separador {tabWarnings}x — mantém o foco.</>}
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="font-display font-semibold text-lg text-slate-900 mb-5 select-none">{ex.q}</h3>
        <div className="space-y-2.5">
          {ex.options.map((opt, i) => {
            let cls = "border-slate-200 hover:border-slate-300";
            if (submitted) {
              if (i === ex.correct) cls = "border-emerald-500 bg-emerald-50";
              else if (i === selected) cls = "border-rose-400 bg-rose-50";
              else cls = "border-slate-200 opacity-60";
            } else if (selected === i) {
              cls = `${c.border} ${c.light}`;
            }
            return (
              <button key={i} disabled={submitted} onClick={() => setSelected(i)}
                className={`w-full text-left border rounded-lg px-4 py-3 text-sm font-medium text-slate-800 transition flex items-center justify-between ${cls}`}>
                {opt}
                {submitted && i === ex.correct && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
                {submitted && i === selected && i !== ex.correct && <XCircle size={16} className="text-rose-500 shrink-0" />}
              </button>
            );
          })}
        </div>

        {submitted && (
          <div className={`mt-4 rounded-lg p-4 text-sm ${correctNow ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
            <p className="font-semibold font-display mb-1">
              {correctNow ? "Correcto! +10 pontos" : forcedReveal ? "Resposta correcta revelada" : "Ainda não é essa — tenta outra vez"}
            </p>
            <p className="text-sm leading-relaxed">{ex.explain}</p>
          </div>
        )}

        <div className="mt-5 flex justify-end">
          {!submitted ? (
            <button disabled={selected === null} onClick={submit}
              className="bg-slate-900 disabled:opacity-40 hover:bg-slate-800 text-white font-display font-semibold px-5 py-2.5 rounded-lg text-sm">
              Confirmar resposta
            </button>
          ) : (correctNow || forcedReveal) ? (
            <button onClick={next} className="bg-emerald-700 hover:bg-emerald-800 text-white font-display font-semibold px-5 py-2.5 rounded-lg text-sm flex items-center gap-1.5">
              {idx === order.length - 1 ? "Terminar unidade" : "Próxima pergunta"} <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={() => { setSubmitted(false); setSelected(null); }}
              className="bg-slate-700 hover:bg-slate-800 text-white font-display font-semibold px-5 py-2.5 rounded-lg text-sm">
              Tentar novamente ({3 - attempts} restantes)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   RANKING / GAMIFICAÇÃO
   ============================================================ */
function Ranking({ currentUser }) {
  const [rows, setRows] = useState(null);

  const load = useCallback(async () => {
    const users = await fetchStudentProfiles();
    users.sort((a, b) => b.points - a.points);
    setRows(users);
  }, []);

  useEffect(() => { load(); const t = setInterval(load, 8000); return () => clearInterval(t); }, [load]);

  if (!rows) return <p className="text-slate-400 text-sm">A carregar ranking…</p>;

  const medal = (i) => i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-slate-900 mb-1">Ranking da Escola</h1>
      <p className="text-slate-500 text-sm mb-6">Classificação por pontos acumulados a resolver exercícios.</p>

      {rows.length === 0 ? (
        <p className="text-sm text-slate-400">Ainda não há estudantes classificados.</p>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
          {rows.map((u, i) => (
            <div key={u.username} className={`flex items-center gap-4 px-4 py-3 ${currentUser && u.username === currentUser.username ? "bg-emerald-50" : ""}`}>
              <span className="w-8 text-center font-display font-bold text-slate-400">{medal(i) || i + 1}</span>
              <Avatar name={u.name} size="w-8 h-8" role={u.role} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{u.name}{currentUser && u.username === currentUser.username ? " (tu)" : ""}</p>
                <p className="text-xs text-slate-400">{Object.values(u.progress || {}).filter((p) => p.completed).length} unidades concluídas</p>
              </div>
              <PointsPill points={u.points} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   LABORATÓRIO VIRTUAL — Simulação de titulação ácido-base
   ============================================================ */
function VirtualLab() {
  const [vol, setVol] = useState(0);

  const acidMoles = 0.1 * 0.025;
  const addedMoles = 0.1 * (vol / 1000);
  const totalVolL = 0.025 + vol / 1000;
  let pH;
  if (vol < 25) {
    const excessH = (acidMoles - addedMoles) / totalVolL;
    pH = -Math.log10(Math.max(excessH, 1e-14));
  } else if (vol === 25) {
    pH = 7;
  } else {
    const excessOH = (addedMoles - acidMoles) / totalVolL;
    const pOH = -Math.log10(Math.max(excessOH, 1e-14));
    pH = 14 - pOH;
  }
  pH = Math.max(0, Math.min(14, pH));
  const isPink = pH >= 8.2;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-slate-900 mb-1">Laboratório Virtual</h1>
      <p className="text-slate-500 text-sm mb-6">Experiência: titulação de ácido clorídrico (HCl) com hidróxido de sódio (NaOH), usando fenolftaleína como indicador.</p>

      <div className="bg-white border border-slate-200 rounded-xl p-6 grid md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-36 border-2 border-slate-300 rounded-b-2xl rounded-t-md overflow-hidden flex items-end bg-slate-50">
            <div className="w-full transition-all duration-300" style={{
              height: "70%",
              backgroundColor: isPink ? "#f472b6" : "#bae6fd",
              opacity: 0.85
            }} />
          </div>
          <p className="text-xs text-slate-400 mt-3">25 mL de HCl 0,1M + fenolftaleína</p>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600">Volume de NaOH 0,1M adicionado: <span className="font-semibold text-slate-900">{vol} mL</span></label>
          <input type="range" min={0} max={50} value={vol} onChange={(e) => setVol(Number(e.target.value))}
            className="w-full mt-2 accent-emerald-600" />
          <div className="mt-5 bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">pH estimado da solução</p>
            <div className="flex items-end gap-2">
              <span className="font-display text-3xl font-bold text-slate-900">{pH.toFixed(1)}</span>
              <span className="text-xs text-slate-400 mb-1">{pH < 7 ? "ácido" : pH === 7 ? "neutro" : "básico"}</span>
            </div>
            <div className="w-full h-2 rounded-full mt-3" style={{ background: "linear-gradient(to right, #ef4444, #facc15, #22c55e, #3b82f6, #8b5cf6)" }}>
              <div className="relative">
                <div className="w-1 h-4 bg-slate-900 -mt-3 rounded" style={{ marginLeft: `${(pH / 14) * 100}%` }} />
              </div>
            </div>
          </div>
          {isPink && vol >= 25 && (
            <p className="text-xs text-rose-500 mt-3">Ponto de viragem ultrapassado: a solução ficou rosa — excesso de base.</p>
          )}
          {!isPink && vol < 25 && vol > 20 && (
            <p className="text-xs text-slate-400 mt-3">Aproximas-te do ponto de equivalência (25 mL).</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-display font-semibold text-slate-800 mb-3">Mais laboratórios virtuais gratuitos</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[LIBRARY_LINKS[1], LIBRARY_LINKS[2]].map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
              className="flex items-start gap-3 border border-slate-200 rounded-lg p-4 hover:shadow-sm transition bg-white">
              <FlaskConical className="text-emerald-600 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-1">{l.name} <ExternalLink size={12} className="text-slate-400" /></p>
                <p className="text-xs text-slate-500 mt-0.5">{l.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   BIBLIOTECA VIRTUAL
   ============================================================ */
function VirtualLibrary() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-slate-900 mb-1">Biblioteca Virtual</h1>
      <p className="text-slate-500 text-sm mb-6">Recursos gratuitos para aprofundar cada unidade.</p>
      <div className="space-y-3">
        {LIBRARY_LINKS.map((l) => (
          <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
            className="flex items-start gap-3 border border-slate-200 rounded-lg p-4 hover:shadow-sm transition bg-white">
            <Library className="text-sky-600 shrink-0 mt-0.5" size={18} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800 flex items-center gap-1">{l.name} <ExternalLink size={12} className="text-slate-400" /></p>
              <p className="text-xs text-slate-500 mt-0.5">{l.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   PROFESSOR IA
   ============================================================ */
function AITeacher() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Olá! Sou o teu Professor de Química IA. Pergunta-me sobre qualquer unidade — vou ajudar-te a raciocinar em vez de dar já a resposta, para aprenderes de verdade." }
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || busy) return;
    const userMsg = { role: "user", text: input.trim() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setBusy(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: "Tu és um(a) professor(a) de Química virtual para estudantes moçambicanos da 9ª classe. Responde sempre em português, de forma clara, simpática e didáctica, com exemplos do dia-a-dia quando possível. Se o estudante pedir a resposta directa de um exercício de avaliação, não a dês de imediato: guia-o com perguntas socráticas e pistas até ele chegar à resposta sozinho, para preservar a integridade académica. Podes explicar livremente conceitos, dar exemplos e corrigir erros de raciocínio.",
          messages: history.map((m) => ({ role: m.role, content: m.text }))
        })
      });
      const data = await response.json();
      const text = (data.content || []).map((b) => b.text || "").join("\n").trim() || "Não consegui gerar uma resposta agora. Tenta novamente.";
      setMessages((h) => [...h, { role: "assistant", text }]);
    } catch (e) {
      setMessages((h) => [...h, { role: "assistant", text: "Não foi possível contactar o Professor IA neste momento. Tenta novamente dentro de instantes." }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      <h1 className="font-display text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2"><Sparkles className="text-amber-500" size={22} /> Professor IA</h1>
      <p className="text-slate-500 text-sm mb-4">Tira dúvidas sobre Química a qualquer hora.</p>
      <div className="flex-1 overflow-y-auto bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-800"}`}>
              {m.text}
            </div>
          </div>
        ))}
        {busy && <div className="flex justify-start"><div className="bg-slate-100 rounded-xl px-4 py-2.5 text-sm text-slate-400 flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> a pensar…</div></div>}
        <div ref={endRef} />
      </div>
      <div className="mt-3 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Escreve a tua pergunta de Química…"
          className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        <button onClick={send} disabled={busy} className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white px-4 rounded-lg">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   PAINEL DO PROFESSOR — recursos + acompanhamento
   ============================================================ */
function TeacherPanel({ user }) {
  const [resources, setResources] = useState(null);
  const [students, setStudents] = useState(null);
  const [form, setForm] = useState({ title: "", type: "Ficha de Exercícios", unit: UNITS[0].id, content: "", link: "" });
  const [showForm, setShowForm] = useState(false);

  const loadResources = useCallback(async () => {
    const items = await fetchResources();
    setResources(items);
  }, []);
  const loadStudents = useCallback(async () => {
    const items = await fetchStudentProfiles();
    items.sort((a, b) => b.points - a.points);
    setStudents(items);
  }, []);
  useEffect(() => { loadResources(); loadStudents(); }, [loadResources, loadStudents]);

  const submitResource = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await createResource({ ...form, authorId: user.id, authorName: user.name });
    setForm({ title: "", type: "Ficha de Exercícios", unit: UNITS[0].id, content: "", link: "" });
    setShowForm(false);
    loadResources();
  };

  const removeResource = async (id) => {
    await deleteResource(id);
    loadResources();
  };

  const downloadResource = (r) => {
    const blob = new Blob([`${r.title}\n${r.type} — Unidade: ${UNITS.find((u) => u.id === Number(r.unit))?.title || ""}\nAutor(a): ${r.authorName}\n\n${r.content || ""}${r.link ? "\n\nLigação: " + r.link : ""}`], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${r.title.replace(/\s+/g, "_")}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl font-bold text-slate-900">Painel do Professor</h1>
        {user.role === "professor" && (
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold font-display px-4 py-2 rounded-lg">
            <Plus size={16} /> Novo recurso
          </button>
        )}
      </div>
      <p className="text-slate-500 text-sm mb-6">Deposita fichas de exercícios, fichas de apoio e preparações para testes.</p>

      {showForm && (
        <form onSubmit={submitResource} className="bg-white border border-slate-200 rounded-xl p-5 mb-6 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600">Título</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm" required />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Tipo</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm">
                <option>Ficha de Exercícios</option>
                <option>Ficha de Apoio</option>
                <option>Preparação para Teste</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Unidade relacionada</label>
            <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm">
              {UNITS.map((u) => <option key={u.id} value={u.id}>{u.title}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Conteúdo (texto da ficha)</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={5} className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Escreve aqui as perguntas, instruções ou tópicos de revisão…" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Ligação externa (opcional)</label>
            <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="https://…" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-500">Cancelar</button>
            <button className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold font-display px-4 py-2 rounded-lg flex items-center gap-1.5"><Upload size={14} /> Publicar</button>
          </div>
        </form>
      )}

      <h3 className="font-display font-semibold text-slate-800 mb-3">Recursos publicados</h3>
      <div className="space-y-2 mb-10">
        {resources === null && <p className="text-sm text-slate-400">A carregar…</p>}
        {resources && resources.length === 0 && <p className="text-sm text-slate-400">Ainda não há recursos publicados.</p>}
        {resources && resources.map((r) => (
          <div key={r.id} className="flex items-start gap-3 border border-slate-200 rounded-lg p-4 bg-white">
            <FileText className="text-sky-600 shrink-0 mt-0.5" size={18} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">{r.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{r.type} · {UNITS.find((u) => u.id === Number(r.unit))?.title} · por {r.authorName}</p>
              {r.link && <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-600 flex items-center gap-1 mt-1">{r.link} <ExternalLink size={11} /></a>}
            </div>
            <button onClick={() => downloadResource(r)} className="text-xs text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5">Descarregar</button>
            {(user.role === "administrador" || r.authorName === user.name) && (
              <button onClick={() => removeResource(r.id)} className="text-rose-400 hover:text-rose-600"><Trash2 size={16} /></button>
            )}
          </div>
        ))}
      </div>

      <h3 className="font-display font-semibold text-slate-800 mb-3">Acompanhamento dos estudantes</h3>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
        {students === null && <p className="text-sm text-slate-400 p-4">A carregar…</p>}
        {students && students.length === 0 && <p className="text-sm text-slate-400 p-4">Ainda sem estudantes registados.</p>}
        {students && students.map((s) => {
          const completedCount = Object.values(s.progress || {}).filter((p) => p.completed).length;
          return (
            <div key={s.username} className="flex items-center gap-3 px-4 py-3">
              <Avatar name={s.name} size="w-8 h-8" role="aluno" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{s.name}</p>
                <p className="text-xs text-slate-400">{completedCount} / {UNITS.length} unidades concluídas</p>
              </div>
              <PointsPill points={s.points} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   PAINEL DE ADMINISTRAÇÃO
   ============================================================ */
function AdminPanel() {
  const [users, setUsers] = useState(null);

  const load = useCallback(async () => {
    const items = await fetchAllProfiles();
    items.sort((a, b) => (a.role === b.role ? b.points - a.points : a.role.localeCompare(b.role)));
    setUsers(items);
  }, []);
  useEffect(() => { load(); }, [load]);

  const changeRole = async (u, role) => {
    await updateProfile(u.id, { role });
    load();
  };
  const removeUser = async (u) => {
    await deleteProfile(u.id);
    load();
  };
  const resetPoints = async (u) => {
    await updateProfile(u.id, { points: 0, progress: emptyProgress() });
    load();
  };

  if (!users) return <p className="text-sm text-slate-400">A carregar…</p>;

  const totals = {
    alunos: users.filter((u) => u.role === "aluno").length,
    professores: users.filter((u) => u.role === "professor").length,
    admins: users.filter((u) => u.role === "administrador").length
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-slate-900 mb-1">Painel de Administração</h1>
      <p className="text-slate-500 text-sm mb-6">Gestão de contas da plataforma.</p>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {[["Estudantes", totals.alunos, Users, "emerald"], ["Professores", totals.professores, BookOpen, "sky"], ["Administradores", totals.admins, ShieldCheck, "violet"]].map(([label, val, Icon, color]) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-4">
            <Icon className={`text-${color}-600 mb-2`} size={18} />
            <p className="font-display font-bold text-2xl text-slate-900">{val}</p>
            <p className="text-xs text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
        {users.map((u) => (
          <div key={u.username} className="flex items-center gap-3 px-4 py-3 flex-wrap">
            <Avatar name={u.name} size="w-8 h-8" role={u.role} />
            <div className="flex-1 min-w-[140px]">
              <p className="text-sm font-medium text-slate-800">{u.name}</p>
              <p className="text-xs text-slate-400">@{u.username}</p>
            </div>
            <select value={u.role} onChange={(e) => changeRole(u, e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5">
              <option value="aluno">Estudante</option>
              <option value="professor">Professor</option>
              <option value="administrador">Administrador</option>
            </select>
            {u.role === "aluno" && <PointsPill points={u.points} />}
            {u.role === "aluno" && (
              <button onClick={() => resetPoints(u)} title="Repor progresso" className="text-slate-400 hover:text-slate-700"><RotateCcw size={16} /></button>
            )}
            <button onClick={() => removeUser(u)} title="Remover conta" className="text-rose-400 hover:text-rose-600"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   PERFIL
   ============================================================ */
function Profile({ user }) {
  const completedCount = Object.values(user.progress || {}).filter((p) => p.completed).length;
  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-display text-2xl font-bold text-slate-900 mb-6">O meu perfil</h1>
      <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
        <Avatar name={user.name} size="w-16 h-16 mx-auto text-lg" role={user.role} />
        <h2 className="font-display font-bold text-lg text-slate-900 mt-3">{user.name}</h2>
        <div className="mt-1"><RoleBadge role={user.role} /></div>
        <p className="text-xs text-slate-400 mt-1">@{user.username}</p>
        {user.role === "aluno" && (
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-emerald-50 rounded-lg p-4">
              <p className="font-display font-bold text-2xl text-emerald-700">{user.points}</p>
              <p className="text-xs text-slate-500">Pontos totais</p>
            </div>
            <div className="bg-sky-50 rounded-lg p-4">
              <p className="font-display font-bold text-2xl text-sky-700">{completedCount}/{UNITS.length}</p>
              <p className="text-xs text-slate-500">Unidades concluídas</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   APLICAÇÃO PRINCIPAL
   ============================================================ */
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("inicio");
  const [selectedUnitId, setSelectedUnitId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const profile = await fetchProfileById(session.user.id);
          if (profile) { setUser(profile); setPage(profile.role === "aluno" ? "inicio" : profile.role === "professor" ? "painel_prof" : "painel_admin"); }
        }
      } catch (e) {}
      setLoading(false);
    })();
    // Mantém a sessão sincronizada caso expire ou seja terminada noutro separador
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") setUser(null);
    });
    return () => sub?.subscription?.unsubscribe();
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    setPage(u.role === "aluno" ? "inicio" : u.role === "professor" ? "painel_prof" : "painel_admin");
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };
  const saveUser = async (updated) => {
    setUser(updated);
    await updateProfile(updated.id, { points: updated.points, progress: updated.progress });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-emerald-500" size={28} /></div>;
  }
  if (!user) return <><FontStyles /><LoginScreen onLogin={handleLogin} /></>;

  const selectedUnit = UNITS.find((u) => u.id === selectedUnitId);

  return (
    <div className="flex min-h-screen bg-stone-50 font-body">
      <FontStyles />
      <Sidebar user={user} page={page} setPage={(p) => { setPage(p); setSelectedUnitId(null); }} onLogout={handleLogout} />
      <main className="flex-1 p-8 overflow-y-auto">
        {page === "inicio" && !selectedUnit && <UnitsList user={user} setSelectedUnit={setSelectedUnitId} />}
        {page === "inicio" && selectedUnit && (
          <ExerciseRunner user={user} unit={selectedUnit} saveUser={saveUser} onBack={() => setSelectedUnitId(null)} />
        )}
        {page === "ranking" && <Ranking currentUser={user} />}
        {page === "lab" && <VirtualLab />}
        {page === "biblioteca" && <VirtualLibrary />}
        {page === "ia" && <AITeacher />}
        {page === "painel_prof" && <TeacherPanel user={user} />}
        {page === "painel_admin" && <AdminPanel />}
        {page === "perfil" && <Profile user={user} />}
      </main>
    </div>
  );
}

function FontStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
      .font-display { font-family: 'Space Grotesk', sans-serif; }
      .font-body { font-family: 'Inter', sans-serif; }
    `}</style>
  );
}
