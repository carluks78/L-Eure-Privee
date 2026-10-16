import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Menu, Phone, Search, Send, ShoppingBag, SlidersHorizontal, X } from "lucide-react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { config, searchServices, universes, type Service } from "./catalog";
import { useApp } from "./context";

export function Logo({ compact = false }: { compact?: boolean }) {
  return <span className={`logo ${compact ? "logo--compact" : ""}`}>
    <svg viewBox="0 0 48 64" aria-hidden="true">
      <path d="M5 61V27C5 16.5 13.5 8 24 8s19 8.5 19 19v34M14.5 61V31.5c0-5.2 4.3-9.5 9.5-9.5s9.5 4.3 9.5 9.5V61M24 33.5V48M1.5 61h45" />
      <circle cx="24" cy="30" r="2.2" />
    </svg>
    {!compact && <span><b>EURE PRIVÉE</b><small>CONCIERGERIE PRIVÉE • VALLÉE DE L&apos;EURE</small></span>}
  </span>;
}

const nav = [
  ["Services", "/services"], ["Rechercher une prestation", "/recherche"],
  ["Confier une demande", "/demande"], ["Notre maison", "/notre-maison"],
  ["Notre philosophie", "/notre-philosophie"], ["Propriétaires", "/proprietaires"],
  ["Séjours & art de vivre", "/sejours"], ["Destinations", "/destinations"],
  ["Guides", "/guides"], ["Contact", "/contact"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const { basket } = useApp();
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [location]);
  return <header className="site-header">
    <Link to="/services" className="header-logo" aria-label="Eure Privée — accueil"><Logo /></Link>
    <nav className="desktop-nav" aria-label="Navigation principale">
      {nav.map(([label, to], index) => <NavLink key={to} to={to} onMouseEnter={() => index === 0 && setMega(true)} className={({ isActive }) => isActive ? "active" : ""}>
        {label}{index === 0 && <ChevronDown size={12} />}
      </NavLink>)}
    </nav>
    <Link className="basket-link" to="/demande" aria-label="Ouvrir votre demande"><ShoppingBag size={17} />{basket.length > 0 && <span>{basket.length}</span>}</Link>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Ouvrir le menu">{open ? <X /> : <Menu />}</button>
    {mega && <div className="mega-menu" onMouseLeave={() => setMega(false)}>
      <div><p className="eyebrow">Nos univers</p><h2>Seize univers, un seul interlocuteur.</h2><Link className="text-link" to="/services" onClick={() => setMega(false)}>Voir tout le catalogue <ArrowRight size={14} /></Link></div>
      <div className="mega-links">{universes.map((universe, index) => <Link to={`/services/${universe.slug}`} key={universe.slug} onClick={() => setMega(false)}><span>{String(index + 1).padStart(2, "0")}</span>{universe.title}</Link>)}</div>
    </div>}
    {open && <div className="mobile-nav">{nav.map(([label, to]) => <NavLink key={to} to={to}>{label}</NavLink>)}<a href={`tel:${config.phone_raw}`}>{config.phone}</a></div>}
  </header>;
}

export function Footer() {
  return <footer className="site-footer">
    <div className="footer-grid">
      <div><Logo /><p>Maison de service privée pour propriétaires, familles et voyageurs exigeants de la Vallée de l&apos;Eure.</p></div>
      <div><p className="eyebrow">Navigation</p>{nav.slice(0, 7).map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}</div>
      <div><p className="eyebrow">Univers de services</p>{universes.slice(0, 8).map((universe) => <Link key={universe.slug} to={`/services/${universe.slug}`}>{universe.title}</Link>)}</div>
      <div><p className="eyebrow">Nous joindre</p><a href={`tel:${config.phone_raw}`}><Phone size={14} /> {config.phone}</a><a href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp — 12 langues</a><Link to="/contact">Être rappelé</Link><p className="footer-zones">{config.zones.join(" • ")}</p></div>
    </div>
    <div className="footer-bottom"><div><Link to="/mentions-legales">Mentions légales</Link><Link to="/confidentialite">Confidentialité</Link><Link to="/cookies">Cookies</Link><Link to="/plan-du-site">Plan du site</Link><Link to="/login">Espace privé</Link></div><p>© {new Date().getFullYear()} Eure Privée — Conciergerie privée • Vallée de l&apos;Eure</p></div>
  </footer>;
}

export function Layout() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);
  return <div className="app-shell"><Header /><main><Outlet /></main><Footer /><WhatsAppConcierge /><CookieConsent /></div>;
}

export function PageHero({ eyebrow, title, intro, image, children }: { eyebrow: string; title: string; intro?: string; image?: string; children?: ReactNode }) {
  return <section className={`page-hero ${image ? "page-hero--image" : ""}`}>
    {image && <img src={image} alt="" />}<div className="page-hero__veil" />
    <div className="page-hero__content reveal-up"><p className="breadcrumbs">ACCUEIL <span>›</span> {eyebrow.toUpperCase()}</p><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{intro && <p className="hero-intro">{intro}</p>}{children}</div>
  </section>;
}

export function SearchBox({ dark = false, full = false }: { dark?: boolean; full?: boolean }) {
  const [query, setQuery] = useState("");
  const [universe, setUniverse] = useState<string | null>(null);
  const { add, has, basket } = useApp();
  const navigate = useNavigate();
  const allResults = query ? searchServices(query, universe) : [];
  const results = allResults;
  const suggestions = [
    { label: "Préparer ma maison avant mon arrivée", universe: "maison-residence" },
    { label: "Organiser un séjour", universe: "sejours-locations" },
    { label: "Trouver un chauffeur", universe: "chauffeurs" },
    { label: "Entretenir mon jardin", universe: "jardin-exterieurs" },
    { label: "Organiser une réception", universe: "evenements" },
  ];
  const chooseSuggestion = (label: string, targetUniverse: string) => {
    setUniverse(targetUniverse);
    setQuery(label);
    window.setTimeout(() => {
      document.getElementById("service-search-results")?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  };
  return <div className={`search-box ${dark ? "search-box--dark" : ""}`}>
    <label className="search-input"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="De quoi avez-vous besoin aujourd’hui ?" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Effacer la recherche"><X size={15} /></button>}</label>
    <div className="filter-chips"><button type="button" className={!universe ? "selected" : ""} onClick={() => setUniverse(null)}>Tous</button>{universes.map((item) => <button type="button" key={item.slug} className={universe === item.slug ? "selected" : ""} onClick={() => setUniverse(universe === item.slug ? null : item.slug)}>{item.title}</button>)}</div>
    {!query && <div className="suggestions">{suggestions.map((item) => <button type="button" key={item.label} onClick={() => chooseSuggestion(item.label, item.universe)}>{item.label}</button>)}<button type="button" className="gold" onClick={() => navigate("/demande")}>Une demande particulière</button></div>}
    {query && <div id="service-search-results" className={`results ${full ? "results--page" : ""}`}><p className="eyebrow">{allResults.length} PRESTATIONS CORRESPONDANTES</p>{results.length ? results.map((service) => <div className="result-item" key={service.slug}><button type="button" className="result-main" onClick={() => navigate(`/prestations/${service.slug}`)}><b>{service.name}</b><small>{service.summary}</small></button><button type="button" className={`add-button ${has(service.slug) ? "selected" : ""}`} onClick={() => add(service)} aria-label={`Ajouter ${service.name}`}>{has(service.slug) ? <Check size={14} /> : <span>+</span>}</button></div>) : <div className="no-results"><h3>Aucune prestation ne correspond exactement à « {query} ».</h3><p>Notre métier consiste précisément à trouver la solution.</p><Link className="button gold-button" to="/demande">Je ne trouve pas mon service</Link></div>}</div>}
    {basket.length > 0 && <Link className="basket-notice" to="/demande">Composer ma demande ({basket.length}) <ArrowRight size={14} /></Link>}
  </div>;
}

const languages = [
  ["fr", "Français", "linear-gradient(to right,#002395 0 33%,#fff 33% 66%,#ed2939 66%)"],
  ["en", "English", "linear-gradient(to bottom,transparent 42%,#fff 42% 58%,transparent 58%),linear-gradient(to right,transparent 42%,#fff 42% 58%,transparent 58%),linear-gradient(to bottom,transparent 46%,#c8102e 46% 54%,transparent 54%),linear-gradient(to right,transparent 46%,#c8102e 46% 54%,transparent 54%),#012169"],
  ["de", "Deutsch", "linear-gradient(to bottom,#000 0 33%,#dd0000 33% 66%,#ffce00 66%)"],
  ["es", "Español", "linear-gradient(to bottom,#aa151b 0 25%,#f1bf00 25% 75%,#aa151b 75%)"],
  ["it", "Italiano", "linear-gradient(to right,#008c45 0 33%,#f4f5f0 33% 66%,#cd212a 66%)"],
  ["nl", "Nederlands", "linear-gradient(to bottom,#ae1c28 0 33%,#fff 33% 66%,#21468b 66%)"],
  ["pt", "Português", "radial-gradient(circle at 40% 50%,#ffe600 0 14%,transparent 15%),linear-gradient(to right,#046a38 0 40%,#da291c 40%)"],
  ["ru", "Русский", "linear-gradient(to bottom,#fff 0 33%,#0039a6 33% 66%,#d52b1e 66%)"],
  ["ar", "العربية", "linear-gradient(to right,#ef3340 0 25%,transparent 25%),linear-gradient(to bottom,#00843d 0 33%,#fff 33% 66%,#000 66%)"],
  ["zh", "中文", "radial-gradient(circle at 25% 32%,#ffde00 0 11%,transparent 12%),#ee1c25"],
  ["ja", "日本語", "radial-gradient(circle at 50% 50%,#bc002d 0 31%,#fff 32%)"],
  ["sv", "Svenska", "linear-gradient(to right,transparent 30%,#ffcd00 30% 44%,transparent 44%),linear-gradient(to bottom,transparent 40%,#ffcd00 40% 58%,transparent 58%),#006aa7"],
];
export function WhatsAppConcierge() {
  const [open, setOpen] = useState(false), [step, setStep] = useState(1);
  const [language, setLanguage] = useState<(typeof languages)[number] | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [criteria, setCriteria] = useState({ town: "", date: "", details: "" });
  const { basket } = useApp();
  const send = () => {
    const names = [...basket.map((item) => item.name), ...selected].join(", ") || "une demande particulière";
    const text = `Bonjour Eure Privée, je souhaite organiser : ${names}.${criteria.town ? ` Commune : ${criteria.town}.` : ""}${criteria.date ? ` Date souhaitée : ${criteria.date}.` : ""}${criteria.details ? ` Précisions : ${criteria.details}.` : ""} Merci de me recontacter (${language?.[1] || "Français"}).`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer"); setOpen(false);
  };
  return <><button className="concierge-button" onClick={() => setOpen(true)} aria-label="Conciergerie WhatsApp"><Logo compact /></button>{open && <aside className="concierge-panel">
    <div className="panel-head"><div><p className="eyebrow">Conciergerie WhatsApp</p><h3>{step === 1 ? "Choisissez votre langue" : step === 2 ? "Vos univers de services" : "Vos critères"}</h3></div><div>{step > 1 && <button onClick={() => setStep(step - 1)}><ArrowLeft size={16} /></button>}<button onClick={() => setOpen(false)}><X size={16} /></button></div></div>
    {step === 1 && <div className="language-grid">{languages.map((item) => <button key={item[0]} onClick={() => { setLanguage(item); setStep(2); }}><span className="language-flag" style={{ background: item[2] }} />{item[1]}</button>)}</div>}
    {step === 2 && <div className="universe-picker">{universes.map((item) => <button key={item.slug} className={selected.includes(item.title) ? "selected" : ""} onClick={() => setSelected(selected.includes(item.title) ? selected.filter((x) => x !== item.title) : [...selected, item.title])}>{item.title}{selected.includes(item.title) && <Check size={14} />}</button>)}</div>}
    {step === 3 && <div className="panel-fields"><input placeholder="Commune (ex. Pacy-sur-Eure)" value={criteria.town} onChange={(e) => setCriteria({ ...criteria, town: e.target.value })} /><input placeholder="Date souhaitée" value={criteria.date} onChange={(e) => setCriteria({ ...criteria, date: e.target.value })} /><textarea placeholder="Précisions : nombre de personnes, horaires…" value={criteria.details} onChange={(e) => setCriteria({ ...criteria, details: e.target.value })} /></div>}
    <div className="panel-foot"><small>{basket.length + selected.length ? `${basket.length + selected.length} sélection(s)` : "Aucune prestation sélectionnée"}</small>{step === 1 && <span>12 LANGUES</span>}{step === 2 && <button className="gold-button" onClick={() => setStep(3)}>Continuer</button>}{step === 3 && <button className="gold-button" onClick={send}><Send size={14} /> Envoyer</button>}</div>
  </aside>}</>;
}

export function CookieConsent() {
  const [show, setShow] = useState(() => localStorage.getItem("ep-consent") === null);
  const [detail, setDetail] = useState(false);
  if (!show) return null;
  const close = (choice: string) => { localStorage.setItem("ep-consent", choice); setShow(false); };
  return <aside className="cookie-panel"><div><p className="eyebrow">Consentement</p><p>Les cookies strictement nécessaires sont toujours actifs. Vous décidez pour la mesure d&apos;audience et les communications.</p>{detail && <label className="consent-option"><input type="checkbox" defaultChecked /> Mesure d&apos;audience anonyme</label>}</div><button className="customize" onClick={() => setDetail(!detail)}><SlidersHorizontal size={14} /> Personnaliser</button><button onClick={() => close("refused")}>Tout refuser</button><button className="gold-button" onClick={() => close("accepted")}>Tout accepter</button></aside>;
}

export function RequestForm({ title = "Confiez-nous votre demande." }: { title?: string }) {
  const { basket, remove, clear } = useApp();
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const previous = JSON.parse(localStorage.getItem("ep-requests") || "[]") as unknown[];
    localStorage.setItem("ep-requests", JSON.stringify([{ ...Object.fromEntries(form), services: basket.map((item) => item.name), date: new Date().toISOString() }, ...previous])); clear(); setSent(true);
  };
  if (sent) return <div className="success-box"><Check /><h2>Votre demande nous est parvenue.</h2><p>Nous revenons personnellement vers vous pour préciser votre besoin.</p></div>;
  return <form className="request-form" onSubmit={submit}><p className="eyebrow eyebrow--dark">Demande confidentielle</p><h2>{title}</h2>
    {basket.length > 0 && <div className="basket-items">{basket.map((item) => <span key={item.slug}>{item.name}<button type="button" onClick={() => remove(item.slug)}><X size={12} /></button></span>)}</div>}
    <div className="form-grid"><label>Nom complet<input name="full_name" required /></label><label>E-mail<input name="email" type="email" required /></label><label>Téléphone<input name="phone" required /></label><label>Commune<input name="town" /></label><label>Date souhaitée<input name="preferred_date" type="date" /></label><label>Budget indicatif<input name="budget" /></label></div>
    <label>Votre demande<textarea name="details" required rows={6} /></label><label className="check-line"><input type="checkbox" required /> J&apos;accepte que mes informations soient utilisées pour traiter cette demande.</label><button className="gold-button submit-button" type="submit">Envoyer ma demande <ArrowRight size={15} /></button>
  </form>;
}
