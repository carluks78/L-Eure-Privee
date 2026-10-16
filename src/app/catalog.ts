import universeData from "../data/universes.json";
import serviceData from "../data/services.json";
import configData from "../data/config.json";

export type FaqItem = { question: string; answer: string };
export type Universe = {
  slug: string; title: string; kicker: string; intro: string; image_url: string;
  process: string[]; info_needed: string[]; faq: FaqItem[];
};
export type Service = {
  slug: string; name: string; universe: string; summary: string; editorial: string;
  image_url: string; faq: FaqItem[]; featured: boolean; regulated: boolean;
};

export const universes = universeData as Universe[];
export const services = serviceData as Service[];
export const config = configData;
export const imageSet = {
  hero: "https://media.base44.com/images/public/6ad28da00502a335d39b8694/7c37cca32_generated_image.png",
  interior: "https://media.base44.com/images/public/6ad28da00502a335d39b8694/7c43f2e77_generated_image.png",
  garden: "https://media.base44.com/images/public/6ad28da00502a335d39b8694/c09e67077_generated_image.png",
  table: "https://media.base44.com/images/public/6ad28da00502a335d39b8694/18ba61e79_generated_image.png",
  driver: "https://media.base44.com/images/public/6ad28da00502a335d39b8694/999c009bc_generated_image.png",
  valley: "https://media.base44.com/images/public/6ad28da00502a335d39b8694/bbf965a80_generated_image.png",
  linen: "https://media.base44.com/images/public/6ad28da00502a335d39b8694/d2103ffdf_generated_image.png",
  keys: "https://media.base44.com/images/public/6ad28da00502a335d39b8694/3b2bd7ed9_generated_image.png",
  artisan: "https://media.base44.com/images/public/6ad28da00502a335d39b8694/4aef9f64f_generated_image.png",
  flowers: "https://media.base44.com/images/public/6ad28da00502a335d39b8694/292778b1a_generated_image.png",
};

const contextualImages: Record<string, string> = {
  "maison-residence": imageSet.keys,
  "menage-entretien": imageSet.linen,
  "jardin-exterieurs": imageSet.garden,
  "courses-livraisons": "https://media.base44.com/images/public/6ad28da00502a335d39b8694/d76186490_generated_image.png",
  gastronomie: imageSet.table,
  chauffeurs: imageSet.driver,
  "famille-enfants": "https://images.unsplash.com/photo-1632952297007-bafc2ced0c1c?auto=format&fit=crop&w=1800&q=85",
  "bien-etre-assistance": "https://images.unsplash.com/photo-1720118509152-2df877673bee?auto=format&fit=crop&w=1800&q=85",
  "artisans-travaux": imageSet.artisan,
  "sejours-locations": imageSet.valley,
  evenements: imageSet.flowers,
  "shopping-personnels": "https://images.unsplash.com/photo-1682364853446-db043f643207?auto=format&fit=crop&w=1800&q=85",
  animaux: "https://images.unsplash.com/photo-1705950065482-170be4f30a1c?auto=format&fit=crop&w=1800&q=85",
  "securite-prevention": "https://images.unsplash.com/photo-1759355787286-f1c5fd456a0d?auto=format&fit=crop&w=1800&q=85",
  "professionnel-vip": "https://images.unsplash.com/photo-1714974528737-3e6c7e4d11af?auto=format&fit=crop&w=1800&q=85",
  "demandes-exceptionnelles": imageSet.hero,
};

export const imageForUniverse = (slug: string) =>
  contextualImages[slug] || universeData.find((item) => item.slug === slug)?.image_url || imageSet.hero;
export const imageForService = (service: Service) => imageForUniverse(service.universe);
export const universeFor = (slug: string) => universes.find((item) => item.slug === slug);
export const servicesFor = (slug: string) =>
  services.filter((item) => item.universe === slug).sort((a, b) => a.name.localeCompare(b.name));
const normalize = (value: string) =>
  value.toLocaleLowerCase("fr").normalize("NFD").replace(/\p{Diacritic}/gu, "");

const stopWords = new Set(["a", "au", "aux", "de", "des", "du", "en", "et", "faire", "je", "la", "le", "les", "ma", "mes", "mon", "pour", "un", "une"]);
const intents: Array<[string, string[]]> = [
  ["jardin-exterieurs", ["jard", "pelouse", "tondre", "tonte", "haie", "exterieur", "paysag"]],
  ["menage-entretien", ["menage", "nettoy", "linge", "repass", "interieur", "vitre"]],
  ["maison-residence", ["maison", "residence", "cle", "gardien", "surveillance", "volet"]],
  ["courses-livraisons", ["course", "livrai", "refrigerateur", "approvision", "colis"]],
  ["gastronomie", ["restaurant", "repas", "chef", "gastronom", "traiteur", "cuisine"]],
  ["chauffeurs", ["chauffeur", "taxi", "gare", "aeroport", "transport", "voiture"]],
  ["famille-enfants", ["enfant", "famille", "baby", "ecole", "nounou"]],
  ["bien-etre-assistance", ["bien etre", "massage", "spa", "compagnie", "assistance"]],
  ["artisans-travaux", ["artisan", "travaux", "plomb", "electric", "peint", "repar"]],
  ["sejours-locations", ["sejour", "voyage", "location", "vacance", "arrivee"]],
  ["evenements", ["evenement", "anniversaire", "mariage", "reception", "fete"]],
  ["shopping-personnels", ["shopping", "achat", "cadeau", "vetement", "boutique"]],
  ["animaux", ["animal", "animaux", "chien", "chat", "veterin", "promen"]],
  ["securite-prevention", ["securite", "alarme", "prevention", "urgence"]],
  ["professionnel-vip", ["vip", "professionnel", "business", "entreprise"]],
];

export function searchServices(query: string, universe?: string | null) {
  const normalizedQuery = normalize(query).replace(/['’]/g, " ");
  const words = normalizedQuery.split(/\s+/).filter((word) => word.length > 1 && !stopWords.has(word));
  const inferredUniverse = intents.find(([, clues]) => clues.some((clue) => normalizedQuery.includes(clue)))?.[0];
  const targetUniverse = universe || inferredUniverse;

  return services
    .filter((service) => !targetUniverse || service.universe === targetUniverse)
    .map((service) => {
      const title = normalize(service.name);
      const text = normalize(`${service.name} ${service.summary} ${service.editorial} ${universeFor(service.universe)?.title || ""}`);
      const score = words.reduce((total, word) => {
        if (title.includes(word)) return total + 5;
        if (text.includes(word)) return total + 2;
        if (word.length > 5 && text.includes(word.slice(0, -2))) return total + 1;
        return total;
      }, targetUniverse ? 2 : 0);
      return { service, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.service.name.localeCompare(b.service.name))
    .map(({ service }) => service);
}
