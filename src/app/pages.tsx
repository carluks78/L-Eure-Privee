import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, Check, Clock, Compass, Landmark, MapPin, Minus, Phone, Plus, ShieldCheck, Sparkles, Utensils } from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { config, imageForService, imageForUniverse, imageSet, services, servicesFor, universeFor, universes, type FaqItem, type Service } from "./catalog";
import { useApp } from "./context";
import { Logo, PageHero, RequestForm, SearchBox } from "./components";
import { poiByDestination, poiLabels, type PoiCategory } from "../data/poi";

export function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = window.setTimeout(() => navigate("/services", { replace: true }), 10000);
    return () => window.clearTimeout(timer);
  }, [navigate]);
  return <section className="splash"><img src={imageSet.hero} alt="Maison de caractère dans la Vallée de l'Eure" /><div className="splash__veil" /><div className="splash__content"><Logo /><h1>L&apos;art de n&apos;avoir à penser à rien.</h1><button className="button ghost-gold" onClick={() => navigate("/services")}>Entrer</button></div><div className="splash__progress"><span /><p>LA MAISON S&apos;OUVRE…</p></div></section>;
}

export function ServicesPage() {
  return <><PageHero eyebrow="Catalogue" title="Tous nos services, univers par univers." intro="Plus de trois cents prestations réparties en seize univers. Sélectionnez ce qui vous concerne : nous traitons vos demandes dans un même dossier, avec un interlocuteur unique."><SearchBox dark /></PageHero>
    <section className="universe-index section"><div className="section-inner universe-grid">{universes.map((item, index) => <Link className="universe-card" to={`/services/${item.slug}`} key={item.slug}><span>{String(index + 1).padStart(2, "0")}</span><h2>{item.title}</h2><p>{item.kicker}</p><small>{servicesFor(item.slug).length} prestations</small></Link>)}</div></section>
    <section className="catalog section"><div className="section-inner"><p className="eyebrow eyebrow--dark">Index complet</p><h2 className="display-title">Chaque prestation possède sa propre fiche.</h2><div className="catalog-groups">{universes.map((universe) => <div key={universe.slug} className="catalog-group"><div><h3>{universe.title}</h3><Link to={`/services/${universe.slug}`}>Voir l&apos;univers <ArrowRight size={13} /></Link></div><ul>{servicesFor(universe.slug).map((service) => <li key={service.slug}><Link to={`/prestations/${service.slug}`}>{service.name}</Link></li>)}</ul></div>)}</div></div></section>
  </>;
}

export function UniversePage() {
  const { slug = "" } = useParams(); const universe = universeFor(slug);
  if (!universe) return <NotFound />;
  const list = servicesFor(slug);
  return <><PageHero eyebrow={`Univers — ${universe.kicker}`} title={universe.title} intro={universe.intro} image={imageForUniverse(universe.slug)}><div className="hero-actions"><Link className="button gold-button" to="/demande">Confier une demande</Link><Link className="button ghost-gold" to="/recherche">Rechercher une prestation</Link></div></PageHero>
    <section className="section universe-services"><div className="section-inner"><div className="section-heading"><h2>{list.length} prestations dans cet univers</h2><span>Sur demande — validation humaine</span></div><div className="service-grid">{list.map((service) => <ServiceCard key={service.slug} service={service} />)}</div></div></section>
    <Process steps={universe.process} /><Faq items={universe.faq} />
  </>;
}

function ServiceCard({ service }: { service: Service }) {
  const { add, has } = useApp();
  return <article className="service-card"><div><p className="eyebrow eyebrow--dark">{universeFor(service.universe)?.title}</p><h3><Link to={`/prestations/${service.slug}`}>{service.name}</Link></h3><p>{service.summary}</p></div><button className={has(service.slug) ? "selected" : ""} onClick={() => add(service)}>{has(service.slug) ? <Check size={14} /> : <Plus size={14} />}</button></article>;
}

export function ServiceDetail() {
  const { slug = "" } = useParams(); const service = services.find((item) => item.slug === slug); const { add, has } = useApp();
  if (!service) return <NotFound />;
  const universe = universeFor(service.universe);
  return <><PageHero eyebrow={universe?.title || "Prestation"} title={service.name} intro={service.summary} image={imageForService(service)}><button className="button gold-button" onClick={() => add(service)}>{has(service.slug) ? <Check size={15} /> : <Plus size={15} />} {has(service.slug) ? "Ajoutée à votre demande" : "Ajouter à ma demande"}</button></PageHero>
    <section className="section detail-section"><div className="section-inner detail-grid"><article><p className="eyebrow eyebrow--dark">La prestation</p><h2 className="display-title">Une prise en charge discrète, du premier échange au compte rendu.</h2><p className="lead-copy">{service.editorial}</p><div className="promise-grid"><div><Clock /><h3>Selon vos délais</h3><p>La date est confirmée après vérification des disponibilités.</p></div><div><ShieldCheck /><h3>Validation humaine</h3><p>Chaque demande est relue et qualifiée personnellement.</p></div></div></article><aside className="detail-aside"><p className="eyebrow">Demande contextualisée</p><h3>Vous souhaitez cette prestation ?</h3><p>Ajoutez-la à votre demande. Nous vous rappelons pour préciser les modalités.</p><button className="gold-button" onClick={() => add(service)}>Demander cette prestation</button><a className="ghost-gold button" href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp — 12 langues</a></aside></div></section><Faq items={service.faq} />
  </>;
}

export function SearchPage() {
  return <><PageHero eyebrow="Recherche" title="Que pouvons-nous organiser pour vous ?" intro="Décrivez simplement votre besoin. Notre catalogue réunit 296 prestations, et nous étudions aussi les demandes particulières." /><section className="section"><div className="section-inner"><SearchBox full /></div></section></>;
}
export function DemandePage() {
  return <><PageHero eyebrow="Demande confidentielle" title="Confiez-nous votre demande." intro="Une prestation du catalogue, plusieurs besoins ou une situation singulière : dites-nous ce que vous souhaitez, nous orchestrons le reste." image={imageSet.interior} /><section className="section request-section"><div className="form-shell"><RequestForm /></div></section></>;
}

const editorialPages = {
  "/notre-maison": { eyebrow: "Notre maison", title: "Une maison de service, au rythme de la vallée.", intro: "Eure Privée est née d'une conviction simple : le vrai luxe tient moins à ce que l'on possède qu'au temps que l'on retrouve.", image: imageSet.interior, body: ["Un interlocuteur unique", "Une sélection exigeante", "Une présence de proximité", "Une discrétion absolue"] },
  "/notre-philosophie": { eyebrow: "Notre philosophie", title: "L'art de n'avoir à penser à rien.", intro: "Anticiper, vérifier, coordonner, rendre compte. Le service est réussi lorsqu'il paraît évident.", image: imageSet.linen, body: ["Écouter avant de proposer", "Privilégier le juste partenaire", "Ne rien engager sans votre accord", "Rester présent jusqu'au dernier détail"] },
  "/proprietaires": { eyebrow: "Propriétaires", title: "Votre résidence secondaire, tenue toute l'année.", intro: "Une maison fermée s'abîme, une maison ouverte se prépare. Nous assurons les deux.", image: imageSet.keys, body: ["Ouverture et préparation", "Surveillance de courtoisie", "Fermeture après départ", "Entretien continu", "Approvisionnement", "Travaux et artisans"] },
  "/sejours": { eyebrow: "Séjours & art de vivre", title: "La vallée, vécue comme une adresse privée.", intro: "Une arrivée préparée, une table réservée, un chauffeur ponctuel et des expériences choisies avec attention.", image: imageSet.table, body: ["Séjours sur mesure", "Tables et produits locaux", "Chauffeurs & transferts", "Réceptions privées"] },
};
export function EditorialPage({ path }: { path: keyof typeof editorialPages }) {
  const page = editorialPages[path];
  return <><PageHero eyebrow={page.eyebrow} title={page.title} intro={page.intro} image={page.image}><Link className="button gold-button" to="/demande">Nous confier votre demande</Link></PageHero><section className="section editorial-section"><div className="section-inner editorial-grid"><div><p className="eyebrow eyebrow--dark">Notre engagement</p><h2 className="display-title">Présents sans être visibles. Exigeants sans être compliqués.</h2><p className="lead-copy">Notre maison organise chaque intervention avec méthode, confidentialité et sens du détail. Vous gardez la décision ; nous prenons en charge la coordination.</p></div><div className="number-list">{page.body.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3></div>)}</div></div></section><Process steps={["Vous nous confiez votre besoin et vos préférences.", "Nous recherchons la solution et vérifions sa faisabilité.", "Vous recevez une proposition claire avant tout engagement.", "Nous coordonnons et vous rendons compte."]} /></>;
}

export function Destinations() {
  const destinations = config.zones_detail || [];
  return <><PageHero eyebrow="Destinations" title="La Vallée de l'Eure, commune par commune." intro="Notre maison s'attache à un territoire précis, à ses demeures, ses artisans, ses paysages et ses rythmes." image={imageSet.valley} /><section className="section"><div className="section-inner destination-grid">{destinations.map((item) => <Link to={`/destinations/${item.slug}`} key={item.slug}><MapPin /><h2>{item.name}</h2><p>{item.blurb}</p><small>{poiByDestination[item.slug]?.length || 0} adresses et expériences sélectionnées</small><span>Découvrir <ArrowRight size={13} /></span></Link>)}</div></section></>;
}
export function DestinationPage() {
  const { slug } = useParams(); const place = config.zones_detail?.find((item) => item.slug === slug);
  const pois = poiByDestination[slug || ""] || [];
  useEffect(() => {
    if (!place) return;
    document.title = `Que faire à ${place.name} — restaurants, visites et activités | Eure Privée`;
    const description = `Les meilleures adresses autour de ${place.name} : restaurants remarqués, domaines, patrimoine, visites et activités sélectionnés par Eure Privée.`;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = description;
    const oldScript = document.getElementById("destination-jsonld");
    oldScript?.remove();
    const script = document.createElement("script");
    script.id = "destination-jsonld";
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TouristDestination",
      name: place.name,
      description: place.blurb,
      containedInPlace: { "@type": "AdministrativeArea", name: "Eure, Normandie, France" },
      touristType: ["Voyageurs exigeants", "Familles", "Propriétaires de résidences secondaires"],
      includesAttraction: pois.map((poi) => ({
        "@type": poi.category === "table" ? "Restaurant" : "TouristAttraction",
        name: poi.name,
        description: poi.description,
        address: poi.location,
      })),
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, [place, pois]);
  if (!place) return <NotFound />;
  const icons: Record<PoiCategory, typeof Landmark> = { visiter: Landmark, table: Utensils, activite: Compass };
  return <><PageHero eyebrow="Destination" title={`Conciergerie privée à ${place.name}`} intro={place.blurb} image={imageSet.valley}><Link className="button gold-button" to="/demande">Faire une demande</Link></PageHero>
    <section className="section"><div className="section-inner editorial-grid"><div><p className="eyebrow eyebrow--dark">À vos côtés</p><h2 className="display-title">Une présence locale, attentive à votre maison.</h2></div><div className="number-list">{place.highlights.map((item, index) => <div key={item}><span>0{index + 1}</span><h3>{item}</h3></div>)}</div></div></section>
    <section className="section poi-section"><div className="section-inner"><p className="eyebrow eyebrow--dark">Carnet local</p><h2 className="display-title">Que faire à {place.name} et aux alentours ?</h2><p className="poi-intro">Patrimoine, domaines, tables remarquées et expériences choisies. Nous pouvons vérifier les horaires, réserver et organiser vos déplacements.</p>
      <div className="poi-grid">{pois.map((poi) => { const Icon = icons[poi.category]; return <a key={poi.name} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(poi.query)}`} target="_blank" rel="noreferrer"><div><Icon /><span>{poiLabels[poi.category]}</span></div><h3>{poi.name}</h3><small><MapPin size={12} /> {poi.location}</small><p>{poi.description}</p><b>Voir sur la carte <ArrowRight size={13} /></b></a>; })}</div>
      <p className="poi-note">Sélection éditoriale susceptible d’évoluer. Horaires, périodes d’ouverture et disponibilités sont vérifiés au moment de votre demande.</p>
    </div></section>
  </>;
}

const guideData = [
  ["preparer-residence-secondaire", "Préparer sa résidence secondaire avant une arrivée", imageSet.keys],
  ["week-end-giverny", "Organiser un week-end privé autour de Giverny", imageSet.valley],
  ["recevoir-sans-contrainte", "Recevoir chez soi sans en porter la logistique", imageSet.table],
  ["entretien-jardin", "Entretenir un jardin de maison de campagne", imageSet.garden],
];
export function Guides() {
  return <><PageHero eyebrow="Guides" title="Carnets de maison et art de vivre." intro="Conseils pratiques, adresses et inspirations pour profiter pleinement de votre maison et de la vallée." /><section className="section"><div className="section-inner guide-grid">{guideData.map(([slug, title, image]) => <Link key={slug} to={`/guides/${slug}`}><img src={image} alt="" /><p className="eyebrow eyebrow--dark">Guide privé</p><h2>{title}</h2><span>Lire le guide <ArrowRight size={13} /></span></Link>)}</div></section></>;
}
export function GuideArticle() {
  const { slug } = useParams(); const guide = guideData.find((item) => item[0] === slug) || guideData[0];
  return <><PageHero eyebrow="Guide privé" title={guide[1]} image={guide[2]} intro="Nos repères pour anticiper chaque détail et profiter de l'essentiel." /><section className="section article"><div className="article-inner"><p className="lead-copy">Une maison accueillante est d&apos;abord une maison préparée. Température, linge, lumière, courses et vérifications techniques composent une arrivée fluide.</p><h2>Anticiper sans surcharger</h2><p>Nous conseillons de transmettre les dates, les habitudes de la maison et les préférences de chacun quelques jours avant l&apos;arrivée.</p><h2>Un seul fil de conversation</h2><p>Centraliser les échanges évite les oublis. Eure Privée suit chaque étape, confirme les horaires et rend compte une fois la mission achevée.</p><Link className="button gold-button" to="/demande">Nous confier cette organisation</Link></div></section></>;
}

export function FaqPage() {
  const items = universes.flatMap((item) => item.faq).filter((item, index, array) => array.findIndex((x) => x.question === item.question) === index);
  return <><PageHero eyebrow="Questions fréquentes" title="Avant de nous confier votre demande." intro="Fonctionnement, tarifs, zones desservies et confidentialité : voici les réponses essentielles." /><Faq items={items.slice(0, 16)} /></>;
}
export function ContactPage() {
  return <><PageHero eyebrow="Contact" title="Parlons de ce que nous pouvons vous simplifier." intro="Téléphone, WhatsApp ou demande en ligne : choisissez le canal qui vous convient." image={imageSet.flowers}><div className="hero-actions"><a className="button gold-button" href={`tel:${config.phone_raw}`}><Phone size={15} /> {config.phone}</a><a className="button ghost-gold" href={`https://wa.me/${config.whatsapp}`}>WhatsApp</a></div></PageHero><section className="section request-section"><div className="form-shell"><RequestForm title="Demander à être rappelé." /></div></section></>;
}
export function ProviderPage() {
  return <><PageHero eyebrow="Rejoindre notre réseau" title="Le goût du travail bien fait." intro="Artisans, chauffeurs, jardiniers, gouvernantes, traiteurs : nous construisons un réseau local exigeant." image={imageSet.artisan} /><section className="section"><div className="section-inner editorial-grid"><div><h2 className="display-title">Une relation claire et durable.</h2><p className="lead-copy">Chaque candidature est étudiée sur documents, références et assurances avant toute mise en relation.</p></div><RequestForm title="Présentez votre activité." /></div></section></>;
}

export function Process({ steps }: { steps: string[] }) {
  return <section className="process section"><div className="section-inner"><p className="eyebrow">Le déroulé</p><h2 className="display-title light">Une organisation simple, une attention constante.</h2><div>{steps.map((step, index) => <article key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></article>)}</div></div></section>;
}
export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return <section className="faq section"><div className="section-inner faq-inner"><div><p className="eyebrow eyebrow--dark">Questions fréquentes</p><h2 className="display-title">Ce qu&apos;il est utile de savoir.</h2></div><div>{items.map((item, index) => <article key={`${item.question}-${index}`} className={open === index ? "open" : ""}><button onClick={() => setOpen(open === index ? null : index)}><span>{item.question}</span>{open === index ? <Minus /> : <Plus />}</button>{open === index && <p>{item.answer}</p>}</article>)}</div></div></section>;
}

export function LegalPage({ doc }: { doc: string }) {
  const titles: Record<string, string> = { mentions: "Mentions légales", confidentialite: "Politique de confidentialité", cookies: "Politique relative aux cookies", cgv: "Conditions générales de vente", accessibilite: "Accessibilité" };
  return <><PageHero eyebrow="Informations" title={titles[doc] || "Informations légales"} /><section className="section article"><div className="article-inner"><h2>Éditeur du site</h2><p>Eure Privée — Conciergerie privée en Vallée de l&apos;Eure.</p><h2>Informations et données</h2><p>Les informations transmises servent exclusivement au traitement des demandes. Dans cette démonstration sans backend, les formulaires et préférences restent stockés dans votre navigateur.</p><h2>Responsabilité</h2><p>Chaque prestation est soumise à une validation humaine, à la disponibilité des partenaires et à une proposition acceptée par le client.</p></div></section></>;
}
export function Sitemap() {
  return <><PageHero eyebrow="Navigation" title="Plan du site" /><section className="section"><div className="section-inner sitemap"><div><h2>La maison</h2>{["notre-maison", "notre-philosophie", "proprietaires", "sejours", "contact", "faq"].map((path) => <Link key={path} to={`/${path}`}>{path.replaceAll("-", " ")}</Link>)}</div><div><h2>Univers</h2>{universes.map((item) => <Link key={item.slug} to={`/services/${item.slug}`}>{item.title}</Link>)}</div><div><h2>Destinations</h2>{config.zones_detail?.map((item) => <Link key={item.slug} to={`/destinations/${item.slug}`}>{item.name}</Link>)}</div></div></section></>;
}

export function AuthPage({ mode }: { mode: "login" | "register" | "forgot" | "reset" }) {
  const navigate = useNavigate(); const [message, setMessage] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget));
    if (mode === "register") localStorage.setItem("ep-account", JSON.stringify(data));
    if (mode === "login") { localStorage.setItem("ep-auth", "true"); navigate("/admin"); return; }
    setMessage(mode === "register" ? "Votre espace privé local a été créé." : "Les instructions ont été préparées.");
  };
  const title = { login: "Accéder à votre espace", register: "Créer votre espace privé", forgot: "Mot de passe oublié", reset: "Choisir un nouveau mot de passe" }[mode];
  return <section className="auth-page"><div className="auth-image"><img src={imageSet.interior} alt="" /><Logo /></div><div className="auth-form"><Link to="/services"><Logo /></Link><p className="eyebrow eyebrow--dark">Espace privé</p><h1>{title}</h1>{message ? <div className="success-box"><Check /><p>{message}</p><Link to="/login">Se connecter</Link></div> : <form onSubmit={submit}>{mode === "register" && <label>Nom complet<input name="name" required /></label>}<label>E-mail<input type="email" name="email" required /></label>{mode !== "forgot" && <label>Mot de passe<input type="password" name="password" required /></label>}<button className="gold-button" type="submit">{mode === "login" ? "Se connecter" : "Continuer"}</button></form>}<div className="auth-links">{mode === "login" && <><Link to="/forgot-password">Mot de passe oublié ?</Link><Link to="/register">Créer un compte</Link></>}{mode !== "login" && <Link to="/login">Retour à la connexion</Link>}</div></div></section>;
}
export function Admin() {
  if (localStorage.getItem("ep-auth") !== "true") return <Navigate to="/login" replace />;
  const requests = useMemo(() => JSON.parse(localStorage.getItem("ep-requests") || "[]") as Record<string, string>[], []);
  return <section className="admin-page"><aside><Logo /><nav><button className="active">Demandes</button><button>Catalogue</button><button>Configuration</button><button onClick={() => { localStorage.removeItem("ep-auth"); location.href = "/login"; }}>Déconnexion</button></nav></aside><main><p className="eyebrow eyebrow--dark">Administration locale</p><h1>Demandes reçues</h1><div className="admin-stats"><div><b>{requests.length}</b><span>Demandes</span></div><div><b>{services.length}</b><span>Prestations</span></div><div><b>{universes.length}</b><span>Univers</span></div></div>{requests.length ? <div className="request-list">{requests.map((request, index) => <article key={index}><h3>{request.full_name || "Demande"}</h3><p>{request.details}</p><small>{request.email} · {request.phone}</small></article>)}</div> : <div className="empty-state"><Sparkles /><h2>Aucune demande enregistrée</h2><p>Les formulaires envoyés apparaîtront ici, dans ce navigateur.</p></div>}</main></section>;
}
export function NotFound() {
  return <section className="not-found"><p>404</p><h1>Cette page reste à imaginer.</h1><Link className="button gold-button" to="/services">Retour aux services</Link></section>;
}
