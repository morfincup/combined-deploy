import React, { useEffect, useMemo, useRef, useState } from "react";

/* =========================
   20 ta izoh (10 lotin + 10 kiril)
   ========================= */
const TESTIMONIALS = [
  // LOTIN (25)
  { name: "Azizbek Qodirov", text: "Darslar juda aniq va amaliy. Rahbarlik ko‘nikmalarim sezilarli oshdi." },
  { name: "Dilnoza To‘lqinova", text: "Platforma ixcham va qulay. O‘qish jarayoni tartibli." },
  { name: "Jasur Abdullayev", text: "Telefonimda ham bir xil chiroyli ishlaydi. Dizayn premium." },
  { name: "Mohira Yo‘ldosheva", text: "Ma’ruza matnlari tushunarli. Testlar bilimni mustahkamlaydi." },
  { name: "Umid Shukurov", text: "O‘zimga ishonch oshdi. Rahbar sifatida yondashuvim o‘zgardi." },
  { name: "Nigina Rasulova", text: "Maktab bo‘limi kerakli mavzularni to‘liq qamrab olgan." },
  { name: "Sardor Karimov", text: "Yondashuv real, natijaga yo‘naltirilgan. Tavsiya qilaman." },
  { name: "Shahzoda Ergasheva", text: "Tungi rejim yoqimli. Ko‘z charchamaydi." },
  { name: "Bekzod Ismoilov", text: "Tizim tartibli, hammasi joyida. Katta rahmat!" },
  { name: "Maftuna Norqobilova", text: "MTM bo‘limi rahbarlari uchun ham juda foydali bo‘ldi." },
  { name: "Sanjar To‘raev", text: "Modullar ketma-ketligi zo‘r: bosqichma-bosqich o‘sasiz." },
  { name: "Madina Usmonova", text: "Testlarda savollar mantiqan tuzilgan, chalg‘itmaydi." },
  { name: "Rustam Xolmatov", text: "Interfeys tez, yuklanishlar yo‘q. Ishlash yoqimli." },
  { name: "Zuhra Hamidova", text: "Ma’ruzalar qisqa, lekin mazmunli. Vaqt tejaydi." },
  { name: "Akmal Nabiev", text: "Sertifikatga tayyorlov reja asosida ketadi." },
  { name: "Dilorom Eshonqulova", text: "Bog‘lanish bo‘limi ham aniq: admin tez javob berdi." },
  { name: "Sherzod Mamatqulov", text: "Kurs materiallari amaliy. Jamoa boshqaruvi bo‘yicha foydali." },
  { name: "Nozima Jalilova", text: "Har bir mavzudan keyin test bo‘lgani yaxshi." },
  { name: "Farruh Mirzaev", text: "Tizimda tartib bor: nima qayerda ekanini tez topasiz." },
  { name: "Sevara Turg‘unova", text: "Premium ko‘rinish, professional yechim. Zo‘r!" },
  { name: "Islomjon O‘rinboyev", text: "Har kuni oz-ozdan o‘qib, tez natija oldim." },
  { name: "Gulbahor Qahhorova", text: "Maktab rahbarlari uchun real misollar ko‘p." },
  { name: "Jamshid Sodiqov", text: "MTM yo‘nalishi ham puxta ishlangan." },
  { name: "Malika Alimuhamedova", text: "Yangi mavzularni oson yodda saqlaysiz, strukturasi yaxshi." },
  { name: "Anvar Raxmatov", text: "Kursdan keyin rejalashtirish va nazoratim ancha yaxshilandi." },

  // KIRIL (15)
  { name: "Муҳаммад Каримов", text: "Жуда замонавий платформа. Матнлар тушунарли ва тартибли." },
  { name: "Шаҳноз Нурматова", text: "Тестлар яхши ўйланган. Билимни тез текшириб оласиз." },
  { name: "Азиза Абдураҳмонова", text: "Телефонда ҳам муаммосиз ишлайди. Дизайн ёқимли." },
  { name: "Жасмина Ҳамидова", text: "Маъруза матнлари аниқ. Ўқиш жараёни енгил бўлди." },
  { name: "Фаррух Иброҳимов", text: "Платформа тез ишлайди. Қулай интерфейс." },
  { name: "Ситора Тошпўлатова", text: "Режим алмашганда ҳамма нарса жойида қолади." },
  { name: "Баҳром Шукуров", text: "МТМ раҳбарлари учун керакли мавзулар жамланган." },
  { name: "Дилором Холиқова", text: "Интро қисми замонавий, чиройли кўринади." },
  { name: "Улуғбек Қодиров", text: "Материаллар тизимли. Мақсад аниқ — натижа яхши." },
  { name: "Малика Рахимова", text: "Раҳмат! Сифатли контент ва чиройли дизайн." },
  { name: "Отабек Жўраев", text: "Мавзулар қисқа, лекин мазмунли. Вақт тежайди." },
  { name: "Зуҳра Юлдошева", text: "Саволлар мантқий, тушунтиришлар етарли." },
  { name: "Шерзод Носиров", text: "Курсдан кейин бошқарув кўникмаларим анча ошди." },
  { name: "Гулнора Саидова", text: "Боғланиш хизмати тез. Админ ёрдам берди." },
  { name: "Комил Рустамов", text: "Тизим тартибли, фойдаланиш жуда қулай." }
];

/* =========================
   Hududlar (demo)
   Keyin backendga ulaymiz
   ========================= */
const REGIONS = {
  "Andijon": ["Andijon tumani", "Asaka", "Baliqchi", "Boʻston", "Buloqboshi", "Izboskan", "Jalaquduq", "Xoʻjaobod", "Qoʻrgʻontepa", "Marhamat", "Oltinkoʻl", "Paxtaobod", "Shahrixon", "Ulugʻnor"],
  "Buxoro": ["Olot", "Buxoro tumani", "Gʻijduvon", "Jondor", "Kogon tumani", "Qorakoʻl", "Qorovulbozor", "Peshku", "Romitan", "Shofirkon", "Vobkent"],
  "Fargʻona": ["Bagʻdod", "Beshariq", "Buvayda", "Dangʻara", "Fargʻona tumani", "Furqat", "Qoʻshtepa", "Quva", "Rishton", "Soʻx", "Toshloq", "Uchkoʻprik", "Oʻzbekiston tumani", "Yozyovon"],
  "Jizzax": ["Arnasoy", "Baxmal", "Doʻstlik", "Forish", "Gʻallaorol", "Sharof Rashidov", "Mirzachoʻl", "Paxtakor", "Yangiobod", "Zomin", "Zafarobod", "Zarbdor"],
  "Namangan": ["Chortoq", "Chust", "Kosonsoy", "Mingbuloq", "Namangan tumani", "Norin", "Pop", "Toʻraqoʻrgʻon", "Uchqoʻrgʻon", "Uychi", "Yangiqoʻrgʻon"],
  "Navoiy": ["Konimex", "Qiziltepa", "Xatirchi", "Navbahor", "Karmana", "Nurota", "Tomdi", "Uchquduq"],
  "Qashqadaryo": ["Chiroqchi", "Dehqonobod", "Gʻuzor", "Qamashi", "Qarshi tumani", "Koson", "Kasbi", "Kitob", "Mirishkor", "Muborak", "Nishon", "Shahrisabz", "Yakkabogʻ"],
  "Samarqand": ["Bulungʻur", "Ishtixon", "Jomboy", "Kattaqoʻrgʻon tumani", "Qoʻshrabot", "Narpay", "Nurobod", "Oqdaryo", "Paxtachi", "Payariq", "Pastdargʻom", "Samarqand tumani", "Toyloq", "Urgut"],
  "Sirdaryo": ["Oqoltin", "Boyovut", "Guliston tumani", "Xovos", "Mirzaobod", "Sardoba", "Sayxunobod", "Sirdaryo tumani"],
  "Surxondaryo": ["Angor", "Bandixon", "Boysun", "Denov", "Jarqoʻrgʻon", "Qiziriq", "Qumqoʻrgʻon", "Muzrabot", "Oltinsoy", "Sariosiyo", "Sherobod", "Shoʻrchi", "Termiz tumani", "Uzun"],
  "Toshkent viloyati": ["Bekobod", "Boʻstonliq", "Boʻka", "Chinoz", "Qibray", "Ohangaron", "Oqqoʻrgʻon", "Parkent", "Piskent", "Quyichirchiq", "Zangiota", "Oʻrtachirchiq", "Yangiyoʻl", "Yuqorichirchiq", "Toshkent tumani"],
  "Xorazm": ["Bogʻot", "Gurlan", "Xonqa", "Hazorasp", "Xiva", "Qoʻshkoʻpir", "Shovot", "Urganch tumani", "Yangiariq", "Yangibozor", "Tuproqqalʼa"],
  "Toshkent shahri": ["Bektemir", "Chilonzor", "Yashnobod", "Mirobod", "Mirzo Ulugʻbek", "Sergeli", "Shayxontohur", "Olmazor", "Uchtepa", "Yakkasaroy", "Yunusobod", "Yangi Hayot"]
};

/* =========================
   Demo kontent tuzilmasi
   (keyin realda admin paneldan kiritiladi)
   ========================= */
function buildDemoCourse(courseType) {
  // 10 ta modul, har modulda 3 ta mavzu (demo)
  const modules = Array.from({ length: 10 }, (_, mi) => {
    const moduleNo = mi + 1;
    const topics = Array.from({ length: 3 }, (_, ti) => {
      const topicNo = ti + 1;
      return {
        id: `m${moduleNo}-t${topicNo}`,
        title:
          courseType === "maktab"
            ? `Modul ${moduleNo} — Mavzu ${topicNo} (Maktab)`
            : `Modul ${moduleNo} — Mavzu ${topicNo} (MTM)`,
        lecture: [
          "Bu yerga keyin ma’ruza matni joylanadi (admin panel orqali).",
          "Maqsad: rahbarlik ko‘nikmalarini tizimli ravishda oshirish.",
          "Amaliy yondashuv: real vaziyatlar, qaror qabul qilish, jamoa boshqaruvi.",
        ].join("\n\n"),
        questionBankSize: 60, // mavzu banki (demo)
      };
    });
    return {
      id: `module-${moduleNo}`,
      title: `Modul ${moduleNo}`,
      topics,
      moduleQuestionBankSize: 120, // modul yakuniy bank (demo)
    };
  });

  return modules;
}

function clampDigits(s) {
  return (s || "").replace(/\D/g, "");
}
function pad9digits(s) {
  const d = clampDigits(s).slice(0, 9);
  return d;
}
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}


/* =========================
   LocalStorage (demo user DB + session)
   Realda backendga ulanadi
   ========================= */
const LS_USERS_KEY = "sm_users_v2";
const LS_SESSION_KEY = "sm_session_phone_v2";

function loadUsers() {
  try {
    const raw = localStorage.getItem(LS_USERS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function saveUsers(users) {
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
}
function loadSessionPhone() {
  try {
    const p = localStorage.getItem(LS_SESSION_KEY);
    return p || "";
  } catch {
    return "";
  }
}
function saveSessionPhone(phone9) {
  if (!phone9) localStorage.removeItem(LS_SESSION_KEY);
  else localStorage.setItem(LS_SESSION_KEY, phone9);
}


/* =========================
   Intro orbit title
   ========================= */
function OrbitTitle({ center = "Shef Menejer", ring = "SHEF MENEJER", radius = 84 }) {
  const chars = Array.from(ring);
  return (
    <div className="sm-orbitTitle" aria-label={center}>
      <div className="sm-orbitCenter">{center}</div>
      <div className="sm-orbitRing" style={{ "--count": chars.length, "--radius": `${radius}px` }}>
        {chars.map((ch, i) => (
          <span key={i} className="sm-orbitChar" style={{ "--i": i }}>
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </div>
    </div>
  );
}

/* =========================
   Icons (inline SVG)
   ========================= */
function Icon({ children, size = 18, style }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
function SunIcon({ size = 18 }) {
  return (
    <Icon size={size}>
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M12 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 20v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M4.93 4.93l1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M17.66 17.66l1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M2 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M4.93 19.07l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </Icon>
  );
}
function MoonIcon({ size = 18 }) {
  return (
    <Icon size={size}>
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M21 14.5A8.5 8.5 0 0 1 9.5 3a6.5 6.5 0 1 0 11.5 11.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </Icon>
  );
}
function PlayIcon({ size = 20 }) {
  return (
    <Icon size={size}>
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M9.5 7.5v9l8-4.5-8-4.5Z"
          fill="currentColor"
        />
        <path
          d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </Icon>
  );
}
function ShieldIcon({ size = 18 }) {
  return (
    <Icon size={size}>
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2 20 6v7c0 5-3.5 9-8 9s-8-4-8-9V6l8-4Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </Icon>
  );
}
function PhoneIcon({ size = 18 }) {
  return (
    <Icon size={size}>
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M7 3h3l2 5-2 1c1 3 4 6 7 7l1-2 5 2v3c0 1-1 2-2 2-10 0-18-8-18-18 0-1 1-2 2-2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </Icon>
  );
}
function TelegramIcon({ size = 18 }) {
  return (
    <Icon size={size}>
      <svg viewBox="0 0 240 240" fill="none">
        <path
          d="M96.5 156.6L92.8 209.1c6.2 0 8.9-2.7 12.2-6l29.3-28.2 60.7 44.4c11.1 6.1 18.9 2.9 21.7-10.2L235.9 27.6c3.3-15.8-5.7-22-16.5-18.1L12.8 95.1c-15.1 6-14.9 14.6-2.6 18.4l52.7 16.5L184 54.1c5.7-3.8 10.9-1.7 6.6 2.1L96.5 156.6Z"
          fill="currentColor"
        />
      </svg>
    </Icon>
  );
}
function InstagramIcon({ size = 18 }) {
  return (
    <Icon size={size}>
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M17.5 6.5h.01"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </Icon>
  );
}
function YouTubeIcon({ size = 18 }) {
  return (
    <Icon size={size}>
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M22 12s0-3.5-.5-5a2.8 2.8 0 0 0-2-2C17.8 4.5 12 4.5 12 4.5s-5.8 0-7.5.5a2.8 2.8 0 0 0-2 2C2 8.5 2 12 2 12s0 3.5.5 5a2.8 2.8 0 0 0 2 2c1.7.5 7.5.5 7.5.5s5.8 0 7.5-.5a2.8 2.8 0 0 0 2-2c.5-1.5.5-5 .5-5Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M10 15V9l6 3-6 3Z" fill="currentColor" />
      </svg>
    </Icon>
  );
}

/* =========================
   UI building blocks
   ========================= */
function Glass({ children, className = "", style }) {
  return (
    <div className={`sm-glass ${className}`} style={style}>
      {children}
    </div>
  );
}
function Card({ children, className = "", style }) {
  return (
    <div className={`sm-card ${className}`} style={style}>
      {children}
    </div>
  );
}
function Button({ children, variant = "soft", className = "", style, ...props }) {
  return (
    <button className={`sm-btn sm-btn--${variant} ${className}`} style={style} {...props}>
      {children}
    </button>
  );
}
function Badge({ children, className = "", style }) {
  return (
    <span className={`sm-badge ${className}`} style={style}>
      {children}
    </span>
  );
}
function Input({ className = "", style, ...props }) {
  return <input className={`sm-input ${className}`} style={style} {...props} />;
}
function Select({ className = "", style, children, ...props }) {
  return (
    <select className={`sm-input ${className}`} style={style} {...props}>
      {children}
    </select>
  );
}

/* =========================
   Modal with fade transition
   ========================= */
function Modal({ open, title, onClose, children }) {
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);
  if (!mounted) return null;

  return (
    <div
      className={`sm-modalOverlay ${open ? "is-open" : "is-closed"}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onAnimationEnd={() => {
        if (!open) setMounted(false);
      }}
    >
      <Glass className="sm-modal">
        <div className="sm-modalHeader">
          <div className="sm-modalTitle">{title}</div>
          <Button onClick={onClose}>Yopish</Button>
        </div>
        <div className="sm-modalBody">{children}</div>
      </Glass>
    </div>
  );
}

/* =========================
   App
   ========================= */
export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Intro
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 2200);
    return () => clearTimeout(t);
  }, []);

  // Simple hash routing: #home, #course, #module, #test, #admin
  const [route, setRoute] = useState("home");
  useEffect(() => {
    function sync() {
      const h = (window.location.hash || "#home").replace("#", "");
      setRoute(h || "home");
    }
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  // User state (demo)
  const [users, setUsers] = useState(() => loadUsers());
  const [user, setUser] = useState(() => {
    const phone = loadSessionPhone();
    if (!phone) return null;
    const list = loadUsers();
    return list.find((u) => u.phone9 === phone) || null;
  }); // demo: localStorage

  const [adminAuthed, setAdminAuthed] = useState(false); // admin login demo only

  // Course select (maktab/mtm)
  const [selectedCourse, setSelectedCourse] = useState("maktab");
  const modules = useMemo(() => buildDemoCourse(selectedCourse), [selectedCourse]);

  // Current view selections
  const [currentModuleId, setCurrentModuleId] = useState(modules[0]?.id || "module-1");
  const currentModule = useMemo(
    () => modules.find((m) => m.id === currentModuleId) || modules[0],
    [modules, currentModuleId]
  );
  const [currentTopicId, setCurrentTopicId] = useState(currentModule?.topics[0]?.id || "");
  const currentTopic = useMemo(
    () => currentModule?.topics.find((t) => t.id === currentTopicId) || currentModule?.topics[0],
    [currentModule, currentTopicId]
  );

  useEffect(() => {
    // course changed => reset module/topic
    setCurrentModuleId(modules[0]?.id || "module-1");
  }, [selectedCourse]); // eslint-disable-line
  useEffect(() => {
    // module changed => reset topic
    setCurrentTopicId(currentModule?.topics[0]?.id || "");
  }, [currentModuleId]); // eslint-disable-line

  // Auth modal
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login"); // login/register
  const [authErr, setAuthErr] = useState("");

  // Izoh qoldirish (demo) — foydalanuvchi yuboradi, lekin asosiy oynada ko‘rinmaydi
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentInfo, setCommentInfo] = useState("");

  // Register form
  const [fullName, setFullName] = useState("");
  const [phone9, setPhone9] = useState("");
  const [password, setPassword] = useState("");
  const [courseType, setCourseType] = useState("maktab");
  const [region, setRegion] = useState("Toshkent shahri");
  const [district, setDistrict] = useState(REGIONS["Toshkent shahri"][0]);

  useEffect(() => {
    setDistrict(REGIONS[region][0]);
  }, [region]);

  // Quote carousel (photo/video placeholder)
  const QUOTES = useMemo(
    () => [
      {
        quote:
          "“O‘qituvchi va tarbiyachilar — jamiyatning eng katta boyligi. Biz ularning bilim va salohiyatiga tayanib, Yangi O‘zbekistonni barpo etamiz.”",
        author: "Shavkat Mirziyoyev",
        note: "Pedagoglar haqida iqtibos",
      },
      {
        quote:
          "“Ta’lim — kelajak poydevori. Rahbarning mas’uliyati esa shu poydevorni mustahkamlashdir.”",
        author: "Shef Menejer — platforma g‘oyasi",
        note: "Motivatsion mazmun",
      },
    ],
    []
  );
  const [quoteIndex, setQuoteIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % QUOTES.length);
    }, 6500);
    return () => clearInterval(t);
  }, [QUOTES.length]);

  // Testimonials loop for marquee
  const marqueeList = useMemo(() => [...TESTIMONIALS, ...TESTIMONIALS], []);

  function openLogin() {
    setAuthTab("login");
    setAuthErr("");
    setAuthOpen(true);
  }
  function openRegister() {
    setAuthTab("register");
    setAuthErr("");
    setAuthOpen(true);
  }
  function logout() {
    setUser(null);
    saveSessionPhone("");
    window.location.hash = "#home";
  }

  function doRegister() {
    setAuthErr("");

    if (fullName.trim().length < 5) return setAuthErr("F.I.Sh kamida 5 ta belgi bo‘lsin.");
    if (pad9digits(phone9).length !== 9) return setAuthErr("Telefon raqam 9 ta raqam bo‘lishi kerak.");
    if (password.length < 4) return setAuthErr("Parol kamida 4 ta belgi bo‘lsin.");

    const phone = pad9digits(phone9);

    const exists = users.some((x) => x.phone9 === phone);
    if (exists) return setAuthErr("Bu telefon raqam bilan avval ro‘yxatdan o‘tilgan.");

    const u = {
      id: `u_${Date.now()}`,
      fullName: fullName.trim(),
      phone9: phone,
      password, // demo: keyin backendda hash bo‘ladi
      courseType,
      region,
      district,
      hasAccess: false, // admin aktivatsiya qilmaguncha yopiq (Premium)
      createdAt: new Date().toISOString(),
    };

    const next = [u, ...users];
    setUsers(next);
    saveUsers(next);

    setUser(u);
    saveSessionPhone(u.phone9);

    setSelectedCourse(courseType);
    setAuthOpen(false);
    window.location.hash = "#course";
  }

  function doLogin() {
    setAuthErr("");
    const phone = pad9digits(phone9);
    if (phone.length !== 9) return setAuthErr("Telefon raqam 9 ta raqam bo‘lishi kerak.");
    if (!password) return setAuthErr("Parolni kiriting.");

    const found = users.find((x) => x.phone9 === phone);
    if (!found) return setAuthErr("Bu telefon bilan ro‘yxatdan o‘tilmagan.");

    if (found.password !== password) return setAuthErr("Telefon yoki parol noto‘g‘ri.");

    setUser(found);
    saveSessionPhone(found.phone9);

    setSelectedCourse(found.courseType);
    setAuthOpen(false);
    window.location.hash = "#course";
  }

  function guardCourse() {
    if (!user) {
      openLogin();
      return false;
    }
    // kurs ajratish: mtm user maktab kontentiga kira olmaydi, va aksincha
    if (selectedCourse !== user.courseType) {
      return false;
    }
    return true;
  }

  // Test state (demo)
  const [testOpen, setTestOpen] = useState(false);
  const [testMode, setTestMode] = useState("topic"); // topic|module|final
  const [testQuestions, setTestQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // {qid: "a"|"b"|"c"|"d"}
  const [showResult, setShowResult] = useState(false);

  function generateQuestion(qid) {
    // demo question generator (keyin admin paneldan keladi)
    const base = [
      "Rahbarlikning asosiy vazifasi nimadan iborat?",
      "Samarali boshqaruv uchun eng muhim ko‘nikma qaysi?",
      "Jamoani motivatsiya qilishning to‘g‘ri usuli qaysi?",
      "Rejalashtirish nima uchun kerak?",
      "Mas’uliyatni delegatsiya qilish nimani anglatadi?",
    ];
    const qText = base[qid % base.length] + ` (Savol #${qid + 1})`;
    const opts = [
      "A variant — amaliy yondashuv",
      "B variant — tizimli reja",
      "C variant — jamoa bilan ishlash",
      "D variant — natijani nazorat qilish",
    ];
    const correct = ["a", "b", "c", "d"][qid % 4];
    return { id: `q${qid}`, q: qText, a: opts[0], b: opts[1], c: opts[2], d: opts[3], correct };
  }

  function startTest(kind) {
    if (!guardCourse()) return;

    if (!user.hasAccess) {
      // yopiq
      return;
    }

    let count = 20;
    if (kind === "topic") count = 15;
    if (kind === "module") count = 20;
    if (kind === "final") count = 30;

    // random generate
    const poolSize =
      kind === "topic"
        ? (currentTopic?.questionBankSize || 60)
        : kind === "module"
        ? (currentModule?.moduleQuestionBankSize || 120)
        : 200;

    const picks = new Set();
    while (picks.size < Math.min(count, poolSize)) {
      picks.add(Math.floor(Math.random() * poolSize));
    }
    const qs = Array.from(picks).map((n) => generateQuestion(n));

    setTestMode(kind);
    setTestQuestions(qs);
    setQIndex(0);
    setAnswers({});
    setShowResult(false);
    setTestOpen(true);
    window.location.hash = "#test";
  }

  function pickAnswer(qid, opt) {
    if (showResult) return;
    setAnswers((prev) => ({ ...prev, [qid]: opt }));
  }

  function nextQ() {
    if (qIndex < testQuestions.length - 1) setQIndex(qIndex + 1);
    else setShowResult(true);
  }
  function prevQ() {
    if (qIndex > 0) setQIndex(qIndex - 1);
  }

  const score = useMemo(() => {
    const total = testQuestions.length || 0;
    if (!total) return { total: 0, correct: 0, percent: 0 };
    let c = 0;
    for (const q of testQuestions) {
      if (answers[q.id] && answers[q.id] === q.correct) c++;
    }
    const percent = Math.round((c / total) * 100);
    return { total, correct: c, percent };
  }, [testQuestions, answers]);

  // Admin (demo login only) — userga ko‘rinmaydi
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminErr, setAdminErr] = useState("");

  function adminLogin() {
    // MUHIM: bu demo. Realda backendda tekshiriladi.
    // Bu yerda hech qachon "admin login/parol" ko‘rsatmaymiz.
    setAdminErr("");
    if (adminUser.trim().length < 3 || adminPass.trim().length < 3) {
      setAdminErr("Login va parolni kiriting.");
      return;
    }
    setAdminAuthed(true);
    window.location.hash = "#adminpanel";
  }

  function adminLogout() {
    setAdminAuthed(false);
    window.location.hash = "#home";
  }

  // Admin panel actions (demo): access toggle, view user creds
  function adminGrantAccess() {
    if (!user) return;
    setPremiumFor(user.phone9, true);
  }
  function adminRevokeAccess() {
    if (!user) return;
    setPremiumFor(user.phone9, false);
  }

  function upsertUser(patch) {
    setUsers((prev) => {
      const next = prev.slice();
      const idx = next.findIndex((x) => x.phone9 === patch.phone9);
      if (idx >= 0) next[idx] = { ...next[idx], ...patch };
      else next.unshift(patch);
      saveUsers(next);
      return next;
    });
    setUser((cur) => (cur && cur.phone9 === patch.phone9 ? { ...cur, ...patch } : cur));
  }

  function setPremiumFor(phone9, hasAccess) {
    setUsers((prev) => {
      const next = prev.map((u) => (u.phone9 === phone9 ? { ...u, hasAccess } : u));
      saveUsers(next);
      return next;
    });
    setUser((cur) => (cur && cur.phone9 === phone9 ? { ...cur, hasAccess } : cur));
  }

  // Theme apply to root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Keep route in sync: if test modal closed, go back to module/course
  useEffect(() => {
    if (route !== "test") setTestOpen(false);
  }, [route]);

  const showAdmin = route === "admin" || route === "adminpanel";

  return (
    <div className="sm-app">
      {/* Intro */}
      {intro && (
        <div className="sm-introOverlay">
          <Glass className="sm-introCard">
            <div className="sm-introGlow" />
            <Badge>Ta’lim platformasi</Badge>
            <OrbitTitle />
            <div className="sm-introSub">
              Maktab va MTM rahbarlarini menejerlik sertifikatiga tayyorlov kursi
            </div>
          </Glass>
        </div>
      )}

      {/* Header */}
      <header className="sm-header">
        <div className="sm-container sm-headerInner">
          <div className="sm-brand" onClick={() => (window.location.hash = "#home")} role="button" tabIndex={0}>
            <div className="sm-logo" aria-hidden="true" />
            <div className="sm-brandText">
              <div className="sm-brandName">Shef Menejer</div>
              <div className="sm-brandTag">Ta’lim platformasi</div>
            </div>
          </div>

          {/* Right actions */}
          <div className="sm-actions">
            <Button
              variant="soft"
              onClick={() => setDarkMode((v) => !v)}
              className="sm-iconBtn"
              title="Rejim"
            >
              {darkMode ? <SunIcon /> : <MoonIcon />} {darkMode ? "Kunduz" : "Tungi"}
            </Button>

            {!user && !showAdmin && (
              <>
                <Button variant="soft" onClick={openLogin}>
                  Kirish
                </Button>
                <Button variant="primary" onClick={openRegister}>
                  Ro‘yxatdan o‘tish
                </Button>
              </>
            )}

            {user && !showAdmin && (
              <>
                <div className="sm-userPill">
                  <div className="sm-userLine">
                    <span className="sm-userName">{user.fullName}</span>
                    <span className="sm-dot">•</span>
                    <span className="sm-userMeta">+998{user.phone9}</span>
                  </div>
                  <div className="sm-userLine sm-userLine2">
                    <span className="sm-userMeta">{user.courseType.toUpperCase()}</span>
                    <span className="sm-dot">•</span>
                    <span className="sm-userMeta">{user.region}, {user.district}</span>
                  </div>
                </div>
                <Button variant="soft" onClick={logout}>Chiqish</Button>
              </>
            )}

            {/* Admin panel tugmasi oddiy userga ko‘rinmaydi — ataylab yo‘q */}
          </div>
        </div>
      </header>

      {/* Pages */}
      {!showAdmin && (
        <>
          {route === "home" && (
            <Landing
              quote={QUOTES[quoteIndex]}
              marqueeList={marqueeList}
              onGoCourse={(type) => {
                setSelectedCourse(type);
                if (!user) openRegister();
                else {
                  // kurs ajratish qoidasi
                  if (user.courseType !== type) {
                    // noto‘g‘ri kursga kirmasin
                    // demo: u holda register qilib tanlashi kerak
                    return;
                  }
                  window.location.hash = "#course";
                }
              }}
              onContact={() => scrollToId("contacts")}
              onLeaveComment={() => {
                setCommentInfo("");
                setCommentName(user?.fullName || "");
                setCommentText("");
                setCommentOpen(true);
              }}
            />
          )}

          {route === "course" && (
            <CoursePage
              user={user}
              selectedCourse={selectedCourse}
              setSelectedCourse={(v) => {
                setSelectedCourse(v);
              }}
              modules={modules}
              currentModuleId={currentModuleId}
              setCurrentModuleId={setCurrentModuleId}
              currentTopicId={currentTopicId}
              setCurrentTopicId={setCurrentTopicId}
              currentModule={currentModule}
              currentTopic={currentTopic}
              onRequireAuth={() => openLogin()}
              onStartTopicTest={() => startTest("topic")}
              onStartModuleTest={() => startTest("module")}
              onStartFinalTest={() => startTest("final")}
            />
          )}

          {route === "module" && (
            <CoursePage
              user={user}
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              modules={modules}
              currentModuleId={currentModuleId}
              setCurrentModuleId={setCurrentModuleId}
              currentTopicId={currentTopicId}
              setCurrentTopicId={setCurrentTopicId}
              currentModule={currentModule}
              currentTopic={currentTopic}
              onRequireAuth={() => openLogin()}
              onStartTopicTest={() => startTest("topic")}
              onStartModuleTest={() => startTest("module")}
              onStartFinalTest={() => startTest("final")}
              forceModuleView
            />
          )}

          {/* Contacts always at bottom */}
          <div id="contacts" />
          <Contacts />
        </>
      )}

      {/* Admin routes (hidden) */}
      {route === "admin" && (
        <AdminLogin
          adminUser={adminUser}
          adminPass={adminPass}
          setAdminUser={setAdminUser}
          setAdminPass={setAdminPass}
          adminErr={adminErr}
          onLogin={adminLogin}
        />
      )}

      {route === "adminpanel" && (
        <AdminPanel
          authed={adminAuthed}
          onLogout={adminLogout}
          users={users}
          currentUser={user}
          onSetPremium={(phone9, v) => setPremiumFor(phone9, v)}
        />
      )}

      {/* Auth Modal */}
      <Modal
        open={authOpen}
        title={authTab === "login" ? "Kirish" : "Ro‘yxatdan o‘tish"}
        onClose={() => {
          setAuthOpen(false);
          setAuthErr("");
        }}
      >
        <div className="sm-authTabs">
          <button
            className={`sm-authTab ${authTab === "login" ? "is-active" : ""}`}
            onClick={() => {
              setAuthTab("login");
              setAuthErr("");
            }}
          >
            Kirish
          </button>
          <button
            className={`sm-authTab ${authTab === "register" ? "is-active" : ""}`}
            onClick={() => {
              setAuthTab("register");
              setAuthErr("");
            }}
          >
            Ro‘yxatdan o‘tish
          </button>
        </div>

        {authErr && <div className="sm-alert">{authErr}</div>}

        {authTab === "register" ? (
          <div className="sm-form">
            <div className="sm-grid2">
              <div className="sm-field">
                <div className="sm-label">Kurs turi</div>
                <Select value={courseType} onChange={(e) => setCourseType(e.target.value)}>
                  <option value="maktab">Maktab</option>
                  <option value="mtm">MTM</option>
                </Select>
              </div>
              <div className="sm-field">
                <div className="sm-label">F.I.Sh</div>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ism Familiya Sharif" />
              </div>
            </div>

            <div className="sm-grid2">
              <div className="sm-field">
                <div className="sm-label">Viloyat</div>
                <Select value={region} onChange={(e) => setRegion(e.target.value)}>
                  {Object.keys(REGIONS).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </Select>
              </div>
              <div className="sm-field">
                <div className="sm-label">Tuman</div>
                <Select value={district} onChange={(e) => setDistrict(e.target.value)}>
                  {REGIONS[region].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="sm-grid2">
              <div className="sm-field">
                <div className="sm-label">Telefon</div>
                <div className="sm-phoneRow">
                  <div className="sm-phonePrefix">+998</div>
                  <Input
                    value={phone9}
                    onChange={(e) => setPhone9(pad9digits(e.target.value))}
                    placeholder="901234567"
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div className="sm-field">
                <div className="sm-label">Parol</div>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Parol" />
              </div>
            </div>

            <Button variant="primary" onClick={doRegister}>
              Ro‘yxatdan o‘tish
            </Button>

            <div className="sm-mutedNote">
              Kursga kirish uchun: <b>hisobni to‘ldirish</b> kerak. <b>Admin bilan bog‘laning.</b>
            </div>
          </div>
        ) : (
          <div className="sm-form">
            <div className="sm-grid2">
              <div className="sm-field">
                <div className="sm-label">Telefon</div>
                <div className="sm-phoneRow">
                  <div className="sm-phonePrefix">+998</div>
                  <Input
                    value={phone9}
                    onChange={(e) => setPhone9(pad9digits(e.target.value))}
                    placeholder="901234567"
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div className="sm-field">
                <div className="sm-label">Parol</div>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Parol" />
              </div>
            </div>

            <Button variant="primary" onClick={doLogin}>
              Kirish
            </Button>
          </div>
        )}
      </Modal>

      {/* Leave comment modal (demo) */}
      <Modal
        open={commentOpen}
        title="Izoh qoldirish"
        onClose={() => {
          setCommentOpen(false);
          setCommentInfo("");
        }}
      >
        {commentInfo && <div className="sm-alert sm-alertOk">{commentInfo}</div>}

        <div className="sm-form">
          <div className="sm-field">
            <div className="sm-label">Ism va familiya</div>
            <Input
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              placeholder="Masalan: Azizbek Qodirov"
            />
          </div>
          <div className="sm-field">
            <div className="sm-label">Izoh</div>
            <textarea
              className="sm-textarea"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Fikringizni yozing..."
              rows={5}
            />
          </div>

          <Button
            variant="primary"
            onClick={() => {
              const n = (commentName || "").trim();
              const t = (commentText || "").trim();
              if (n.length < 5) return setCommentInfo("Ism-familiyani to‘liq kiriting.");
              if (t.length < 10) return setCommentInfo("Izoh kamida 10 ta belgi bo‘lsin.");
              // MUHIM: demo talabiga ko‘ra izoh asosiy oynada ko‘rinmaydi.
              setCommentInfo("Rahmat! Izohingiz moderatsiyadan so‘ng e’lon qilinadi.");
              setCommentText("");
            }}
          >
            Yuborish
          </Button>

          <div className="sm-mutedNote">
            Eslatma: izohlar moderatsiyadan so‘ng ko‘rinadi. Hozircha asosiy oynada faqat tasdiqlangan izohlar chiqadi.
          </div>
        </div>
      </Modal>

      {/* Test modal/page */}
      <Modal
        open={testOpen}
        title={
          testMode === "topic"
            ? "Mavzu testi"
            : testMode === "module"
            ? "Modul testi"
            : "Yakuniy test"
        }
        onClose={() => {
          setTestOpen(false);
          window.location.hash = "#module";
        }}
      >
        <TestUI
          questions={testQuestions}
          qIndex={qIndex}
          setQIndex={setQIndex}
          answers={answers}
          pickAnswer={pickAnswer}
          showResult={showResult}
          setShowResult={setShowResult}
          score={score}
          nextQ={nextQ}
          prevQ={prevQ}
        />
      </Modal>

      <footer className="sm-footer">
        <div className="sm-container sm-footerInner">
          © {new Date().getFullYear()} Shef Menejer — Premium ta’lim platformasi
          <span className="sm-footerHint">
            Admin sahifa (yashirin): <code>#admin</code>
          </span>
        </div>
      </footer>

      {/* CSS (App ichida) */}
      <style>{APP_CSS}</style>
    </div>
  );
}

/* =========================
   Landing
   ========================= */
function Landing({ quote, marqueeList, onGoCourse, onContact, onLeaveComment }) {
  return (
    <main>
      <section className="sm-hero">
        <div className="sm-blob sm-blob1" />
        <div className="sm-blob sm-blob2" />

        <div className="sm-container sm-heroGrid">
          <div>
            <h1 className="sm-h1">
              Menejerlik Sertifikatiga
              <span className="sm-h1Accent">Professional Tayyorlov</span>
            </h1>

            <p className="sm-lead">
              “Shef Menejer” — maktab va MTM rahbarlari uchun zamonaviy, ixcham va natijaga yo‘naltirilgan ta’lim platformasi.
            </p>

            <div className="sm-ctaRow">
              <Button variant="primary" onClick={() => onGoCourse("maktab")}>
                Maktab bo‘limi
              </Button>
              <Button variant="soft" onClick={() => onGoCourse("mtm")}>
                MTM bo‘limi
              </Button>
              <Button variant="soft" onClick={onContact}>
                Bog‘lanish
              </Button>
            </div>

            <div className="sm-stats">
              <Card className="sm-stat">
                <div className="sm-statValue">500+</div>
                <div className="sm-statLabel">Rahbarlar</div>
              </Card>
              <Card className="sm-stat">
                <div className="sm-statValue">85%</div>
                <div className="sm-statLabel">O‘tish natijasi</div>
              </Card>
              <Card className="sm-stat">
                <div className="sm-statValue">10+</div>
                <div className="sm-statLabel">Modullar</div>
              </Card>
            </div>
          </div>

          <Glass className="sm-heroMedia">
            <div className="sm-videoFrame">
              <div className="sm-videoBtn">
                <PlayIcon size={22} />
              </div>
              <div className="sm-videoText">
                Bu joyga keyin video yoki iqtibosli fotosuratlar qo‘yiladi
              </div>
            </div>

            <div className="sm-quoteBox">
              <div className="sm-quoteNote">{quote.note}</div>
              <div className="sm-quoteText">“{quote.quote.replace(/“|”/g, "")}”</div>
              <div className="sm-quoteAuthor">— {quote.author}</div>
            </div>

            <div className="sm-miniCards">
              <button className="sm-miniCard" onClick={() => (window.location.hash = "#course")}>
                <div className="sm-miniTitle">Kurslar</div>
                <div className="sm-miniSub">Modullar va mavzular</div>
              </button>
              <button className="sm-miniCard" onClick={onContact}>
                <div className="sm-miniTitle">Bog‘lanish</div>
                <div className="sm-miniSub">Admin bilan aloqa</div>
              </button>
            </div>
          </Glass>
        </div>
      </section>

      {/* Testimonials marquee */}
      <section className="sm-section">
        <div className="sm-container">
          <div className="sm-sectionHeadRow">
            <h2 className="sm-h2">Ishtirokchilar fikri</h2>
            <Button variant="primary" onClick={onLeaveComment}>Izoh qoldirish</Button>
          </div>
          <p className="sm-sub">
            Izohlar o‘ngdan chapga uzluksiz aylanadi (ustiga borsangiz to‘xtaydi).
          </p>

          <Glass className="sm-marqueeShell">
            <div className="sm-marqueeTrack">
              {marqueeList.map((t, i) => (
                <div className="sm-review" key={i}>
                  <div className="sm-reviewText">{t.text}</div>
                  <div className="sm-reviewName">— {t.name}</div>
                </div>
              ))}
            </div>
          </Glass>
        </div>
      </section>
    </main>
  );
}

/* =========================
   Course page (module/topic/lecture + tests)
   ========================= */
function CoursePage({
  user,
  selectedCourse,
  setSelectedCourse,
  modules,
  currentModuleId,
  setCurrentModuleId,
  currentTopicId,
  setCurrentTopicId,
  currentModule,
  currentTopic,
  onRequireAuth,
  onStartTopicTest,
  onStartModuleTest,
  onStartFinalTest,
  forceModuleView = false,
}) {
  const wrongCourse = user && user.courseType !== selectedCourse;

  return (
    <main className="sm-section">
      <div className="sm-container">
        <div className="sm-topRow">
          <div>
            <h2 className="sm-h2">Kurs bo‘limi</h2>
            <div className="sm-sub">
              {user ? (
                <>
                  Siz tanlagan yo‘nalish: <b>{selectedCourse.toUpperCase()}</b>
                </>
              ) : (
                <>Kursni ko‘rish uchun avval kirish yoki ro‘yxatdan o‘tish kerak.</>
              )}
            </div>
          </div>

          <div className="sm-courseSwitch">
            <Button
              variant={selectedCourse === "maktab" ? "primary" : "soft"}
              onClick={() => setSelectedCourse("maktab")}
            >
              Maktab
            </Button>
            <Button
              variant={selectedCourse === "mtm" ? "primary" : "soft"}
              onClick={() => setSelectedCourse("mtm")}
            >
              MTM
            </Button>
          </div>
        </div>

        {user && wrongCourse && (
          <div className="sm-alert">
            Siz <b>{user.courseType.toUpperCase()}</b> bo‘limida ro‘yxatdan o‘tgansiz.
            Shu sababli boshqa bo‘lim kontentiga kira olmaysiz.
          </div>
        )}

        {!user && (
          <div className="sm-lockCard">
            <div className="sm-lockLeft">
              <div className="sm-lockIcon">
                <ShieldIcon />
              </div>
              <div>
                <div className="sm-lockTitle">Kurs yopiq</div>
                <div className="sm-lockSub">Kirish uchun avval ro‘yxatdan o‘ting yoki tizimga kiring.</div>
              </div>
            </div>
            <Button variant="primary" onClick={onRequireAuth}>Kirish / Ro‘yxatdan o‘tish</Button>
          </div>
        )}

        {user && user.courseType === selectedCourse && (
          <>
            {!user.hasAccess && (
              <div className="sm-lockCard">
                <div className="sm-lockLeft">
                  <div className="sm-lockIcon">
                    <ShieldIcon />
                  </div>
                  <div>
                    <div className="sm-lockTitle">Kontent yopiq</div>
                    <div className="sm-lockSub">
                      Kursga kirish uchun <b>hisobni to‘ldirish</b> kerak. <b>Admin bilan bog‘laning.</b>
                    </div>
                  </div>
                </div>
                <Button variant="primary" onClick={() => scrollToId("contacts")}>
                  Bog‘lanish
                </Button>
              </div>
            )}

            <div className="sm-courseGrid">
              <Card className="sm-sidebar">
                <div className="sm-sideTitle">Modullar</div>
                <div className="sm-sideList">
                  {modules.map((m) => (
                    <button
                      key={m.id}
                      className={`sm-sideItem ${m.id === currentModuleId ? "is-active" : ""}`}
                      onClick={() => {
                        setCurrentModuleId(m.id);
                        window.location.hash = "#module";
                      }}
                    >
                      <div className="sm-sideItemTitle">{m.title}</div>
                      <div className="sm-sideItemMeta">{m.topics.length} ta mavzu</div>
                    </button>
                  ))}
                </div>

                <div className="sm-sideDivider" />

                <div className="sm-sideTitle">Yakuniy imtihon</div>
                <div className="sm-sideSmall">
                  Kurs yakunida umumiy test.
                </div>
                <Button
                  variant="primary"
                  onClick={onStartFinalTest}
                  disabled={!user.hasAccess}
                  className="sm-full"
                >
                  Yakuniy testni boshlash
                </Button>
              </Card>

              <div className="sm-content">
                <Glass className="sm-moduleTop">
                  <div className="sm-moduleHead">
                    <div>
                      <div className="sm-moduleTitle">{currentModule?.title}</div>
                      <div className="sm-moduleSub">
                        Mavzuni tanlang, ma’ruza matnini o‘qing, so‘ng testni ishlang.
                      </div>
                    </div>

                    <Button
                      variant="soft"
                      onClick={onStartModuleTest}
                      disabled={!user.hasAccess}
                      title="Modul bo‘yicha test"
                    >
                      Modul testi
                    </Button>
                  </div>

                  <div className="sm-topicsRow">
                    {currentModule?.topics.map((t) => (
                      <button
                        key={t.id}
                        className={`sm-topicPill ${t.id === currentTopicId ? "is-active" : ""}`}
                        onClick={() => setCurrentTopicId(t.id)}
                      >
                        {t.title}
                      </button>
                    ))}
                  </div>
                </Glass>

                <Card className="sm-lecture">
                  <div className="sm-lectureTitle">Ma’ruza matni</div>
                  <div className="sm-lectureText">
                    {currentTopic?.lecture || "Ma’ruza matni topilmadi (demo)."}
                  </div>

                  <div className="sm-lectureActions">
                    <Button
                      variant="primary"
                      onClick={onStartTopicTest}
                      disabled={!user.hasAccess}
                    >
                      Testni boshlash
                    </Button>
                    {!user.hasAccess && (
                      <div className="sm-mutedNote">
                        Testlar va ma’ruzalar yopiq. Hisobni to‘ldirish uchun admin bilan bog‘laning.
                      </div>
                    )}
                  </div>
                </Card>

                {forceModuleView && (
                  <div className="sm-mutedNote" style={{ marginTop: 10 }}>
                    Siz modul sahifasidasiz (demo). Keyin realda modul/mavzu soni admin panel orqali boshqariladi.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

/* =========================
   Test UI
   ========================= */
function TestUI({
  questions,
  qIndex,
  answers,
  pickAnswer,
  showResult,
  setShowResult,
  score,
  nextQ,
  prevQ,
}) {
  const q = questions[qIndex];

  if (!questions.length) {
    return (
      <div className="sm-mutedNote">
        Test savollari yo‘q (demo). Keyin admin paneldan savollar qo‘shiladi.
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="sm-result">
        <div className="sm-resultBig">{score.percent}%</div>
        <div className="sm-resultSub">
          To‘g‘ri javoblar: <b>{score.correct}</b> / {score.total}
        </div>

        <div className="sm-resultActions">
          <Button variant="soft" onClick={() => setShowResult(false)}>
            Savollarga qaytish
          </Button>
          <Button variant="primary" onClick={() => window.location.hash = "#module"}>
            Modulga qaytish
          </Button>
        </div>
      </div>
    );
  }

  const chosen = answers[q.id];

  function optionBtn(optKey, text) {
    const isChosen = chosen === optKey;
    const isCorrect = chosen && q.correct === optKey;
    const isWrongChosen = chosen && isChosen && q.correct !== optKey;

    return (
      <button
        className={[
          "sm-opt",
          isChosen ? "is-chosen" : "",
          isCorrect ? "is-correct" : "",
          isWrongChosen ? "is-wrong" : "",
        ].join(" ")}
        onClick={() => pickAnswer(q.id, optKey)}
      >
        <div className="sm-optKey">{optKey.toUpperCase()}</div>
        <div className="sm-optText">{text}</div>
      </button>
    );
  }

  return (
    <div>
      <div className="sm-testTop">
        <div className="sm-testCount">
          Savol <b>{qIndex + 1}</b> / {questions.length}
        </div>
        <div className="sm-testHint">To‘g‘ri tanlov: yashil, noto‘g‘ri: qizil</div>
      </div>

      <div className="sm-question">{q.q}</div>

      <div className="sm-opts">
        {optionBtn("a", q.a)}
        {optionBtn("b", q.b)}
        {optionBtn("c", q.c)}
        {optionBtn("d", q.d)}
      </div>

      <div className="sm-testActions">
        <Button variant="soft" onClick={prevQ} disabled={qIndex === 0}>
          Orqaga
        </Button>
        <Button variant="primary" onClick={nextQ}>
          {qIndex === questions.length - 1 ? "Yakunlash" : "Keyingisi"}
        </Button>
      </div>
    </div>
  );
}

/* =========================
   Contacts
   ========================= */
function Contacts() {
  const items = [
    {
      title: "Telegram kanal",
      value: "@shef_menejer",
      icon: <TelegramIcon />,
      action: () => window.open("https://t.me/shef_menejer", "_blank"),
      btn: "Ochish",
    },
    {
      title: "Telegram admin",
      value: "@Shef_menejer_admin",
      icon: <ShieldIcon />,
      action: () => window.open("https://t.me/Shef_menejer_admin", "_blank"),
      btn: "Yozish",
    },
    {
      title: "Telefon",
      value: "+998 70 217 09 66",
      icon: <PhoneIcon />,
      action: () => navigator.clipboard?.writeText("+998702170966"),
      btn: "Nusxa",
    },
  ];

  return (
    <section className="sm-section">
      <div className="sm-container">
        <h2 className="sm-h2">Bog‘lanish</h2>
        <p className="sm-sub">
          Kursga kirish (hisobni to‘ldirish) uchun admin bilan bog‘laning.
        </p>

        <div className="sm-contactGrid">
          {items.map((it) => (
            <Glass className="sm-contactCard" key={it.title}>
              <div className="sm-contactIcon">{it.icon}</div>
              <div className="sm-contactBody">
                <div className="sm-contactTitle">{it.title}</div>
                <div className="sm-contactValue">{it.value}</div>
              </div>
              <Button variant="soft" onClick={it.action}>{it.btn}</Button>
            </Glass>
          ))}

          {/* Bot alohida: tayyorlov boti */}
          <Glass className="sm-contactCard sm-contactCardWide">
            <div className="sm-contactIcon">
              <TelegramIcon />
            </div>
            <div className="sm-contactBody">
              <div className="sm-contactTitle">Telegram bot (tayyorlov boti)</div>
              <div className="sm-contactValue">@ShefMenejer_bot</div>
              <div className="sm-contactNote">
                Eslatma: bot avtomatik tayyorlov uchun. Admin javobi alohida admin orqali.
              </div>
            </div>
            <Button variant="soft" onClick={() => window.open("https://t.me/ShefMenejer_bot", "_blank")}>Ochish</Button>
          </Glass>

          {/* Instagram / YouTube: linksiz */}
          <Glass className="sm-contactCard">
            <div className="sm-contactIcon"><InstagramIcon /></div>
            <div className="sm-contactBody">
              <div className="sm-contactTitle">Instagram</div>
              <div className="sm-contactValue">Shef Menejer</div>
            </div>
            <Button variant="soft" disabled>Link yo‘q</Button>
          </Glass>

          <Glass className="sm-contactCard">
            <div className="sm-contactIcon"><YouTubeIcon /></div>
            <div className="sm-contactBody">
              <div className="sm-contactTitle">YouTube</div>
              <div className="sm-contactValue">Shef Menejer</div>
            </div>
            <Button variant="soft" disabled>Link yo‘q</Button>
          </Glass>
        </div>
      </div>
    </section>
  );
}

/* =========================
   Admin (hidden)
   - oddiy userga button yo‘q
   - faqat URL: #admin
   ========================= */
function AdminLogin({ adminUser, adminPass, setAdminUser, setAdminPass, adminErr, onLogin }) {
  return (
    <main className="sm-section">
      <div className="sm-container" style={{ maxWidth: 720 }}>
        <h2 className="sm-h2">Admin kirish</h2>
        <p className="sm-sub">
          Bu sahifa oddiy foydalanuvchilarga ko‘rinmaydi (faqat yashirin manzil orqali).
        </p>

        {adminErr && <div className="sm-alert">{adminErr}</div>}

        <Card className="sm-adminBox">
          <div className="sm-form">
            <div className="sm-field">
              <div className="sm-label">Admin login</div>
              <Input value={adminUser} onChange={(e) => setAdminUser(e.target.value)} placeholder="Login" />
            </div>
            <div className="sm-field">
              <div className="sm-label">Admin parol</div>
              <Input value={adminPass} onChange={(e) => setAdminPass(e.target.value)} type="password" placeholder="Parol" />
            </div>

            <Button variant="primary" onClick={onLogin}>Kirish</Button>
          </div>
        </Card>
      </div>
    </main>
  );
}

function AdminPanel({ authed, onLogout, users, currentUser, onSetPremium }) {
  if (!authed) {
    return (
      <main className="sm-section">
        <div className="sm-container" style={{ maxWidth: 720 }}>
          <div className="sm-alert">
            Admin sessiya yo‘q. <a href="#admin">Admin login</a> sahifasiga qayting.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="sm-section">
      <div className="sm-container">
        <div className="sm-topRow">
          <div>
            <h2 className="sm-h2">Admin panel</h2>
            <p className="sm-sub">
              Bu demo versiya: foydalanuvchi hisoblarini boshqarish va to‘lovdan keyin Premium obunani yoqish/o‘chirish.
              Real backend ulanganidan so‘ng billing, to‘lovlar tarixi, kontent va testlar ham shu yerda bo‘ladi.
            </p>
          </div>
          <Button variant="soft" onClick={onLogout}>Chiqish</Button>
        </div>

        <div className="sm-adminGrid">
          <Card className="sm-adminCard" style={{ gridColumn: "1 / -1" }}>
            <div className="sm-adminTitle">Foydalanuvchilar</div>

            {(!users || users.length === 0) ? (
              <div className="sm-mutedNote">Hali foydalanuvchi ro‘yxatdan o‘tmagan.</div>
            ) : (
              <div className="sm-adminTableWrap">
                <table className="sm-adminTable">
                  <thead>
                    <tr>
                      <th>F.I.Sh</th>
                      <th>Telefon</th>
                      <th>Kurs</th>
                      <th>Hudud</th>
                      <th>Premium</th>
                      <th>Amal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.phone9} className={currentUser?.phone9 === u.phone9 ? "is-current" : ""}>
                        <td><b>{u.fullName}</b></td>
                        <td>+998{u.phone9}</td>
                        <td>{(u.courseType || "").toUpperCase()}</td>
                        <td>{u.region}, {u.district}</td>
                        <td>
                          <span className={u.hasAccess ? "sm-pill sm-pillOk" : "sm-pill sm-pillBad"}>
                            {u.hasAccess ? "Yoqilgan" : "O‘chiq"}
                          </span>
                        </td>
                        <td>
                          <div className="sm-adminActions sm-adminActionsRow">
                            <Button
                              variant="primary"
                              onClick={() => onSetPremium(u.phone9, true)}
                              disabled={u.hasAccess}
                              title="To‘lov qilgan foydalanuvchiga Premium yoqish"
                            >
                              Premium yoqish
                            </Button>
                            <Button
                              variant="soft"
                              onClick={() => onSetPremium(u.phone9, false)}
                              disabled={!u.hasAccess}
                            >
                              Premium o‘chirish
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="sm-mutedNote" style={{ marginTop: 12 }}>
                  Eslatma: demo rejimda parol va sessiya localStorage’da saqlanadi. Real loyihada backend + token (JWT) bilan ishlanadi.
                </div>
              </div>
            )}
          </Card>

          <Card className="sm-adminCard">
            <div className="sm-adminTitle">Billing (keyingi bosqich)</div>
            <div className="sm-mutedNote">
              Realda bu bo‘limda: to‘lov yozuvlari, aktivatsiya tarixi, summa, chek/ID, izohlar va avtomatik Premium muddati (masalan, 30 kun) bo‘ladi.
            </div>
          </Card>

          <Card className="sm-adminCard">
            <div className="sm-adminTitle">Kontent boshqaruvi (keyingi bosqich)</div>
            <div className="sm-mutedNote">
              Realda admin: modul → mavzu → ma’ruza matni qo‘shish/tahrirlash/o‘chirish va testlarni jadval ko‘rinishida kiritish imkoniga ega bo‘ladi.
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}


/* =========================
   CSS (App.jsx ichida)
   Sizning index.css dagi rang o'zgaruvchilaringiz bilan ishlaydi.
   ========================= */
const APP_CSS = `
/* extra vars */
:root{
  --ok: #1FAD66;
  --bad: #E5484D;
}

/* layout */
.sm-app{
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* container */
.sm-container{
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 18px;
}

/* header */
.sm-header{
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(14px);
  background: color-mix(in srgb, var(--bg-primary) 70%, transparent);
}
.sm-headerInner{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
  padding: 12px 0;
}
.sm-brand{
  display:flex;
  align-items:center;
  gap: 10px;
  cursor:pointer;
  user-select:none;
}
.sm-logo{
  width: 38px;
  height: 38px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--accent), var(--accent-light));
  box-shadow: 0 14px 40px var(--accent-glow);
}
.sm-brandName{
  font-weight: 950;
  letter-spacing: -0.02em;
  line-height: 1.1;
}
.sm-brandTag{
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 700;
}
.sm-actions{
  display:flex;
  align-items:center;
  justify-content:flex-end;
  flex-wrap: wrap;
  gap: 10px;
}
.sm-userPill{
  padding: 10px 12px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  box-shadow: var(--shadow2);
}
.sm-userLine{
  display:flex;
  gap: 8px;
  align-items:center;
}
.sm-userLine2{
  margin-top: 2px;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 700;
}
.sm-userName{ font-weight: 950; }
.sm-userMeta{ color: var(--text-secondary); font-weight: 800; font-size: 12px; }
.sm-dot{ opacity:.55; }

/* intro */
.sm-introOverlay{
  position: fixed;
  inset: 0;
  z-index: 80;
  display:grid;
  place-items:center;
  background: rgba(0,0,0,.35);
  animation: smFadeIn .35s ease-out;
}
.sm-introCard{
  padding: 22px 22px 18px;
  width: min(560px, 92vw);
  position: relative;
  overflow: hidden;
}
.sm-introGlow{
  position:absolute;
  inset: -50px;
  opacity: .20;
  filter: blur(28px);
  background:
    radial-gradient(circle at 30% 30%, var(--accent-light), transparent 60%),
    radial-gradient(circle at 70% 70%, var(--accent), transparent 60%);
}
.sm-introTitle{
  margin: 10px 0 6px;
  font-size: 46px;
  font-weight: 950;
  letter-spacing: -0.04em;
  line-height: 1.02;
  background: linear-gradient(135deg, var(--accent), var(--accent-light));
  -webkit-background-clip: text;
  color: transparent;
}
.sm-introSub{
  color: var(--text-secondary);
  font-weight: 700;
  line-height: 1.5;
}

/* orbit title */
.sm-orbitTitle{
  position: relative;
  width: 220px;
  height: 220px;
  margin: 6px auto 2px;
  display:flex;
  align-items:center;
  justify-content:center;
}
.sm-orbitCenter{
  font-size: 42px;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.02em;
  text-align:center;
  background: linear-gradient(135deg, var(--text-primary), color-mix(in srgb, var(--accent) 65%, var(--text-primary)));
  -webkit-background-clip: text;
  background-clip:text;
  color: transparent;
  padding: 0 10px;
}
.sm-orbitRing{
  position:absolute;
  inset: 0;
  border-radius: 999px;
  animation: sm-rotate 10s linear infinite;
}
.sm-orbitChar{
  position:absolute;
  top: 50%;
  left: 50%;
  transform:
    rotate(calc((360deg / var(--count)) * var(--i)))
    translate(var(--radius))
    rotate(calc(-1 * (360deg / var(--count)) * var(--i)));
  transform-origin: 0 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  opacity: 0.9;
  color: color-mix(in srgb, var(--text-secondary) 85%, var(--accent));
  user-select:none;
}
@keyframes sm-rotate{
  from{ transform: rotate(0deg); }
  to{ transform: rotate(360deg); }
}


/* components */
.sm-glass{
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow2);
  border-radius: var(--radius-xl);
}
.sm-card{
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  box-shadow: var(--shadow2);
  border-radius: var(--radius-xl);
}
.sm-btn{
  border-radius: 14px;
  padding: 12px 16px;
  font-weight: 900;
  cursor:pointer;
  border: 1px solid transparent;
  transition: transform .15s ease, box-shadow .2s ease, opacity .15s ease;
}
.sm-btn:active{ transform: translateY(1px); }
.sm-btn--primary{
  background: linear-gradient(135deg, var(--accent), var(--accent-light));
  color: white;
  box-shadow: 0 14px 40px var(--accent-glow);
}
.sm-btn--primary:hover{
  box-shadow: 0 20px 55px var(--accent-glow);
}
.sm-btn--soft{
  background: rgba(107,70,193,.08);
  border-color: rgba(107,70,193,.18);
  color: var(--text-primary);
}
[data-theme="dark"] .sm-btn--soft{
  background: rgba(183,148,244,.10);
  border-color: rgba(183,148,244,.16);
}
.sm-badge{
  display:inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  background: color-mix(in srgb, var(--bg-secondary) 70%, transparent);
}
.sm-input{
  width: 100%;
  margin-top: 6px;
  border-radius: 14px;
  padding: 12px 12px;
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  color: var(--text-primary);
  outline: none;
  font-weight: 800;
}
.sm-input:focus{
  box-shadow: 0 0 0 4px var(--accent-glow);
  border-color: color-mix(in srgb, var(--accent) 35%, var(--border));
}

/* hero */
.sm-hero{
  position: relative;
  overflow: hidden;
  padding: 28px 0 18px;
}
.sm-heroGrid{
  display:grid;
  grid-template-columns: 1.15fr .85fr;
  gap: 14px;
  align-items: stretch;
}
.sm-blob{
  position:absolute;
  width: 520px;
  height: 520px;
  border-radius: 999px;
  filter: blur(55px);
  opacity: .20;
  pointer-events:none;
  background:
    radial-gradient(circle at 30% 30%, var(--accent-light), transparent 60%),
    radial-gradient(circle at 70% 70%, var(--accent), transparent 60%);
  animation: smFloat 7s ease-in-out infinite;
}
.sm-blob1{ right: -220px; top: -160px; }
.sm-blob2{ left: -240px; bottom: -240px; opacity: .16; animation-delay: 1s; }

.sm-h1{
  font-size: 52px;
  font-weight: 950;
  letter-spacing: -0.04em;
  line-height: 1.05;
  margin: 0;
}
.sm-h1Accent{
  display:block;
  margin-top: 6px;
  background: linear-gradient(135deg, var(--accent), var(--accent-light));
  -webkit-background-clip: text;
  color: transparent;
}
.sm-lead{
  margin-top: 12px;
  font-size: 18px;
  line-height: 1.65;
  color: var(--text-secondary);
  max-width: 720px;
}
.sm-ctaRow{
  margin-top: 14px;
  display:flex;
  gap: 10px;
  flex-wrap: wrap;
}
.sm-stats{
  margin-top: 16px;
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.sm-stat{
  padding: 14px;
}
.sm-statValue{
  font-size: 30px;
  font-weight: 950;
}
.sm-statLabel{
  color: var(--text-secondary);
  font-weight: 800;
}

/* media */
.sm-heroMedia{
  padding: 14px;
}
.sm-videoFrame{
  border-radius: 20px;
  border: 1px solid var(--border);
  min-height: 220px;
  display:grid;
  place-items:center;
  position: relative;
  overflow:hidden;
  background:
    radial-gradient(circle at 30% 30%, rgba(159,122,234,.18), transparent 55%),
    radial-gradient(circle at 70% 70%, rgba(107,70,193,.18), transparent 55%),
    color-mix(in srgb, var(--bg-secondary) 70%, transparent);
}
.sm-videoBtn{
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display:grid;
  place-items:center;
  background: linear-gradient(135deg, var(--accent), var(--accent-light));
  color:white;
  box-shadow: 0 18px 50px var(--accent-glow);
}
.sm-videoText{
  position:absolute;
  bottom: 10px;
  left: 12px;
  right: 12px;
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 800;
  opacity: .95;
}

.sm-quoteBox{
  margin-top: 12px;
  padding: 12px;
  border-radius: 18px;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg-secondary) 80%, transparent);
}
.sm-quoteNote{
  font-size: 12px;
  font-weight: 900;
  color: var(--text-muted);
}
.sm-quoteText{
  margin-top: 6px;
  font-style: italic;
  line-height: 1.6;
  color: var(--text-primary);
  font-weight: 700;
}
.sm-quoteAuthor{
  margin-top: 8px;
  font-weight: 950;
  color: var(--accent);
}
.sm-miniCards{
  margin-top: 12px;
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.sm-miniCard{
  border-radius: 18px;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg-secondary) 85%, transparent);
  padding: 12px;
  text-align:left;
  cursor:pointer;
  transition: transform .15s ease, box-shadow .2s ease;
}
.sm-miniCard:hover{
  transform: translateY(-1px);
  box-shadow: var(--shadow2);
}
.sm-miniTitle{ font-weight: 950; }
.sm-miniSub{ color: var(--text-secondary); font-weight: 800; font-size: 12px; margin-top: 4px; }

/* section */
.sm-section{
  padding: 18px 0 26px;
}
.sm-h2{
  font-size: 34px;
  font-weight: 950;
  letter-spacing: -0.03em;
  margin: 0;
}
.sm-sub{
  margin-top: 6px;
  color: var(--text-secondary);
  font-weight: 800;
}

/* marquee */
.sm-marqueeShell{
  margin-top: 12px;
  padding: 14px;
  overflow:hidden;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}
.sm-marqueeTrack{
  display:flex;
  width:max-content;
  gap: 14px;
  animation: smMarquee 55s linear infinite;
}
.sm-marqueeShell:hover .sm-marqueeTrack{
  animation-play-state: paused;
}
.sm-review{
  width: 320px;
  flex: 0 0 auto;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg-secondary) 85%, transparent);
}
.sm-reviewText{
  color: var(--text-secondary);
  font-weight: 800;
  font-size: 14px;
  line-height: 1.55;
}
.sm-reviewName{
  margin-top: 10px;
  font-weight: 950;
  color: var(--accent);
}

/* course */
.sm-topRow{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.sm-courseSwitch{
  display:flex;
  gap: 10px;
}
.sm-lockCard{
  margin-top: 12px;
  padding: 14px;
  border-radius: 22px;
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  box-shadow: var(--shadow2);
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap: 12px;
  flex-wrap: wrap;
}
.sm-lockLeft{
  display:flex;
  gap: 12px;
  align-items:center;
}
.sm-lockIcon{
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display:grid;
  place-items:center;
  background: linear-gradient(135deg, var(--accent), var(--accent-light));
  color:white;
}
.sm-lockTitle{
  font-weight: 950;
}
.sm-lockSub{
  color: var(--text-secondary);
  font-weight: 800;
  margin-top: 4px;
}

.sm-courseGrid{
  margin-top: 12px;
  display:grid;
  grid-template-columns: 340px 1fr;
  gap: 12px;
}
.sm-sidebar{
  padding: 14px;
  position: sticky;
  top: 74px;
  height: fit-content;
}
.sm-sideTitle{
  font-weight: 950;
  letter-spacing: -0.02em;
}
.sm-sideList{
  margin-top: 10px;
  display:flex;
  flex-direction: column;
  gap: 8px;
}
.sm-sideItem{
  text-align:left;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg-secondary) 86%, transparent);
  padding: 10px 10px;
  cursor:pointer;
  transition: transform .15s ease, border-color .2s ease;
}
.sm-sideItem:hover{
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--accent) 28%, var(--border));
}
.sm-sideItem.is-active{
  border-color: color-mix(in srgb, var(--accent) 48%, var(--border));
  box-shadow: 0 18px 55px var(--accent-glow);
}
.sm-sideItemTitle{
  font-weight: 950;
}
.sm-sideItemMeta{
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 800;
}
.sm-sideDivider{
  height:1px;
  background: var(--border);
  margin: 14px 0;
}
.sm-sideSmall{
  margin-top: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 800;
}
.sm-full{ width: 100%; margin-top: 10px; }

.sm-content{
  display:flex;
  flex-direction: column;
  gap: 12px;
}
.sm-moduleTop{
  padding: 14px;
}
.sm-moduleHead{
  display:flex;
  justify-content:space-between;
  gap: 12px;
  align-items:flex-start;
  flex-wrap: wrap;
}
.sm-moduleTitle{
  font-size: 22px;
  font-weight: 950;
  letter-spacing: -0.02em;
}
.sm-moduleSub{
  color: var(--text-secondary);
  font-weight: 800;
  margin-top: 4px;
}
.sm-topicsRow{
  margin-top: 12px;
  display:flex;
  gap: 10px;
  flex-wrap: wrap;
}
.sm-topicPill{
  border-radius: 999px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg-secondary) 80%, transparent);
  cursor:pointer;
  font-weight: 900;
  color: var(--text-secondary);
}
.sm-topicPill.is-active{
  color: var(--text-primary);
  border-color: color-mix(in srgb, var(--accent) 40%, var(--border));
  box-shadow: 0 16px 45px var(--accent-glow);
}
.sm-lecture{
  padding: 14px;
}
.sm-lectureTitle{
  font-weight: 950;
  letter-spacing: -0.02em;
}
.sm-lectureText{
  margin-top: 10px;
  white-space: pre-wrap;
  line-height: 1.75;
  color: var(--text-secondary);
  font-weight: 800;
}
.sm-lectureActions{
  margin-top: 12px;
  display:flex;
  gap: 12px;
  align-items:center;
  flex-wrap: wrap;
}

/* test */
.sm-testTop{
  display:flex;
  justify-content:space-between;
  gap: 10px;
  align-items:center;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.sm-testCount{
  color: var(--text-secondary);
  font-weight: 900;
}
.sm-testHint{
  color: var(--text-muted);
  font-weight: 800;
  font-size: 12px;
}
.sm-question{
  font-weight: 950;
  font-size: 18px;
  letter-spacing: -0.01em;
  margin-bottom: 10px;
}
.sm-opts{
  display:grid;
  gap: 10px;
}
.sm-opt{
  border-radius: 18px;
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  padding: 12px;
  text-align:left;
  cursor:pointer;
  display:flex;
  gap: 10px;
  align-items:flex-start;
  transition: transform .12s ease, border-color .2s ease, box-shadow .2s ease;
}
.sm-opt:hover{
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--accent) 28%, var(--border));
}
.sm-optKey{
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display:grid;
  place-items:center;
  font-weight: 950;
  background: rgba(107,70,193,.10);
  border: 1px solid rgba(107,70,193,.18);
  color: var(--accent);
  flex: 0 0 auto;
}
[data-theme="dark"] .sm-optKey{
  background: rgba(183,148,244,.10);
  border-color: rgba(183,148,244,.16);
}
.sm-optText{
  font-weight: 800;
  color: var(--text-secondary);
  line-height: 1.55;
}
.sm-opt.is-chosen{
  box-shadow: 0 16px 45px var(--accent-glow);
}
.sm-opt.is-correct{
  border-color: rgba(31,173,102,.45);
  box-shadow: 0 16px 45px rgba(31,173,102,.15);
}
.sm-opt.is-wrong{
  border-color: rgba(229,72,77,.45);
  box-shadow: 0 16px 45px rgba(229,72,77,.15);
}
.sm-testActions{
  margin-top: 12px;
  display:flex;
  justify-content:space-between;
  gap: 10px;
}
.sm-result{
  text-align:center;
  padding: 10px;
}
.sm-resultBig{
  font-size: 56px;
  font-weight: 950;
  background: linear-gradient(135deg, var(--accent), var(--accent-light));
  -webkit-background-clip: text;
  color: transparent;
}
.sm-resultSub{
  margin-top: 6px;
  color: var(--text-secondary);
  font-weight: 900;
}
.sm-resultActions{
  margin-top: 12px;
  display:flex;
  justify-content:center;
  gap: 10px;
  flex-wrap: wrap;
}

/* contacts */
.sm-contactGrid{
  margin-top: 12px;
  display:grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}
.sm-contactCard{
  padding: 14px;
  display:flex;
  gap: 12px;
  align-items:center;
}
.sm-contactCardWide{
  grid-column: 1 / -1;
}
.sm-contactIcon{
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display:grid;
  place-items:center;
  background: linear-gradient(135deg, var(--accent), var(--accent-light));
  color: white;
  box-shadow: 0 14px 40px var(--accent-glow);
  flex: 0 0 auto;
}
.sm-contactBody{
  flex: 1;
}
.sm-contactTitle{
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 900;
}
.sm-contactValue{
  font-weight: 950;
  letter-spacing: -0.01em;
}
.sm-contactNote{
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 800;
}

/* auth */
.sm-authTabs{
  display:flex;
  gap: 10px;
  margin-bottom: 10px;
}
.sm-authTab{
  flex: 1;
  border-radius: 14px;
  padding: 12px 12px;
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  cursor:pointer;
  font-weight: 950;
  color: var(--text-secondary);
}
.sm-authTab.is-active{
  border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
  box-shadow: 0 16px 45px var(--accent-glow);
  color: var(--text-primary);
}
.sm-form{
  display:grid;
  gap: 10px;
}
.sm-grid2{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.sm-field .sm-label{
  font-size: 12px;
  font-weight: 950;
  color: var(--text-muted);
}
.sm-phoneRow{
  display:flex;
  gap: 8px;
  align-items:center;
  margin-top: 6px;
}
.sm-phonePrefix{
  width: 80px;
  text-align:center;
  padding: 12px 10px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  font-weight: 950;
}
.sm-alert{
  margin: 10px 0;
  padding: 12px;
  border-radius: 18px;
  border: 1px solid rgba(229,72,77,.25);
  background: color-mix(in srgb, var(--bg-secondary) 80%, rgba(229,72,77,.08));
  color: var(--text-secondary);
  font-weight: 900;
}
.sm-mutedNote{
  margin-top: 6px;
  color: var(--text-muted);
  font-weight: 800;
  font-size: 12px;
}

/* modal */
.sm-modalOverlay{
  position: fixed;
  inset: 0;
  z-index: 60;
  display:grid;
  place-items:center;
  padding: 18px;
  background: rgba(0,0,0,.35);
}
.sm-modal{
  width: min(860px, 100%);
  padding: 14px;
}
.sm-modalHeader{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
}
.sm-modalTitle{
  font-weight: 950;
  letter-spacing: -0.02em;
  font-size: 18px;
}
.sm-modalBody{
  margin-top: 12px;
}

/* fade */
.sm-modalOverlay.is-open{ animation: smFadeIn .18s ease-out both; }
.sm-modalOverlay.is-closed{ animation: smFadeOut .16s ease-out both; }
@keyframes smFadeIn{ from{ opacity:0 } to{ opacity:1 } }
@keyframes smFadeOut{ from{ opacity:1 } to{ opacity:0 } }
@keyframes smFloat{ 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-18px) } }
@keyframes smMarquee{ from{ transform: translateX(0) } to{ transform: translateX(-50%) } }

/* footer */
.sm-footer{
  padding: 18px 0 30px;
  border-top: 1px solid var(--border);
  margin-top: 10px;
}
.sm-footerInner{
  color: var(--text-muted);
  font-weight: 800;
  display:flex;
  justify-content:space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.sm-footerHint{ opacity: .8; }

/* responsive */
@media (max-width: 980px){
  .sm-heroGrid{ grid-template-columns: 1fr; }
  .sm-stats{ grid-template-columns: 1fr; }
  .sm-courseGrid{ grid-template-columns: 1fr; }
  .sm-sidebar{ position: relative; top: 0; }
}
@media (max-width: 860px){
  .sm-grid2{ grid-template-columns: 1fr; }
  .sm-contactGrid{ grid-template-columns: 1fr; }
  .sm-contactCardWide{ grid-column: auto; }
}

/* section head row */
.sm-sectionHeadRow{
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  gap: 12px;
  margin-bottom: 6px;
}

/* alerts */
.sm-alertOk{
  border-color: color-mix(in srgb, var(--ok) 45%, var(--border));
  background: color-mix(in srgb, var(--ok) 14%, var(--bg-primary));
}

/* textarea */
.sm-textarea{
  width:100%;
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: 14px;
  padding: 12px 14px;
  outline: none;
  resize: vertical;
}
.sm-textarea:focus{
  border-color: color-mix(in srgb, var(--accent) 55%, var(--border));
  box-shadow: 0 0 0 4px var(--accent-glow);
}

/* admin table */
.sm-adminTableWrap{ overflow:auto; }
.sm-adminTable{
  width:100%;
  border-collapse: collapse;
  min-width: 880px;
}
.sm-adminTable th,
.sm-adminTable td{
  text-align:left;
  padding: 12px 12px;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
}
.sm-adminTable thead th{
  color: var(--text-secondary);
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.sm-adminTable tr.is-current{
  background: color-mix(in srgb, var(--accent) 10%, transparent);
}
.sm-adminActionsRow{
  flex-wrap: wrap;
}
.sm-pill{
  display:inline-flex;
  align-items:center;
  gap: 6px;
  border-radius: 999px;
  padding: 6px 10px;
  font-weight: 700;
  font-size: 12px;
  border: 1px solid var(--border);
}
.sm-pillOk{
  border-color: color-mix(in srgb, var(--ok) 45%, var(--border));
  background: color-mix(in srgb, var(--ok) 14%, var(--bg-primary));
  color: color-mix(in srgb, var(--ok) 60%, var(--text-primary));
}
.sm-pillBad{
  border-color: color-mix(in srgb, var(--bad) 45%, var(--border));
  background: color-mix(in srgb, var(--bad) 10%, var(--bg-primary));
  color: color-mix(in srgb, var(--bad) 55%, var(--text-primary));
}

`;
