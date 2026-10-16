export type PoiCategory = "visiter" | "table" | "activite";
export type Poi = {
  name: string;
  category: PoiCategory;
  location: string;
  description: string;
  query: string;
};

export const poiByDestination: Record<string, Poi[]> = {
  "pacy-sur-eure": [
    { name: "Chemin de fer de la Vallée de l’Eure", category: "activite", location: "Pacy-sur-Eure", description: "Voyage patrimonial en train ancien au fil de la vallée.", query: "Chemin de fer de la Vallée de l'Eure Pacy-sur-Eure" },
    { name: "Centre historique et bords de l’Eure", category: "visiter", location: "Pacy-sur-Eure", description: "Ponts, maisons anciennes et promenade paisible au bord de l’eau.", query: "Centre historique Pacy-sur-Eure" },
    { name: "Domaine de la Haie des Granges", category: "table", location: "Ménilles, à proximité", description: "Hôtel de campagne et table élégante aux portes de Pacy.", query: "Domaine de la Haie des Granges restaurant" },
    { name: "Marché de Pacy-sur-Eure", category: "activite", location: "Pacy-sur-Eure", description: "Produits normands, artisans et spécialités locales.", query: "Marché Pacy-sur-Eure" },
  ],
  vernon: [
    { name: "Le Vieux-Moulin", category: "visiter", location: "Vernon", description: "L’emblématique moulin suspendu au-dessus de la Seine.", query: "Vieux Moulin Vernon" },
    { name: "Château de Bizy", category: "visiter", location: "Vernon", description: "Domaine historique, parc et fontaines inspirés de Versailles.", query: "Château de Bizy Vernon" },
    { name: "Musée Blanche Hoschedé-Monet", category: "visiter", location: "Vernon", description: "Collections impressionnistes et histoire artistique locale.", query: "Musée Blanche Hoschedé-Monet Vernon" },
    { name: "Le Jardin des Plumes", category: "table", location: "Giverny, à proximité", description: "Une table gastronomique reconnue dans un décor contemporain.", query: "Le Jardin des Plumes Giverny" },
  ],
  "saint-aquilin-de-pacy": [
    { name: "Château du Buisson de May", category: "visiter", location: "Saint-Aquilin-de-Pacy", description: "Élégante demeure néoclassique entourée d’un parc paysager.", query: "Château du Buisson de May" },
    { name: "Voie verte de la Vallée de l’Eure", category: "activite", location: "Autour de Pacy", description: "Balade à vélo ou à pied entre villages et paysages normands.", query: "Voie verte Vallée de l'Eure Pacy" },
    { name: "Domaine de la Haie des Granges", category: "table", location: "Ménilles, à proximité", description: "Cuisine de saison dans un domaine de campagne.", query: "Domaine de la Haie des Granges restaurant" },
  ],
  menilles: [
    { name: "Domaine de la Haie des Granges", category: "table", location: "Ménilles", description: "Domaine, hôtel et restaurant dans un cadre verdoyant.", query: "Domaine de la Haie des Granges Ménilles" },
    { name: "Promenade de la vallée", category: "activite", location: "Ménilles", description: "Chemins champêtres entre rivière, coteaux boisés et villages.", query: "Randonnée Ménilles Eure" },
    { name: "Giverny et les jardins de Monet", category: "visiter", location: "À proximité", description: "Une excursion incontournable à travers les paysages impressionnistes.", query: "Maison et jardins de Claude Monet Giverny" },
  ],
  "houlbec-cocherel": [
    { name: "Moulin de Cocherel", category: "visiter", location: "Houlbec-Cocherel", description: "Site historique sur les rives de l’Eure.", query: "Moulin de Cocherel" },
    { name: "Tombe d’Aristide Briand", category: "visiter", location: "Cocherel", description: "Lieu de mémoire dans un environnement préservé.", query: "Tombe Aristide Briand Cocherel" },
    { name: "Descente de l’Eure en canoë", category: "activite", location: "Vallée de l’Eure", description: "Découvrir la vallée depuis la rivière, entre nature et villages.", query: "Canoë vallée de l'Eure Cocherel" },
    { name: "Domaine de la Haie des Granges", category: "table", location: "À proximité", description: "Une halte gourmande au cœur de la campagne euroise.", query: "Domaine de la Haie des Granges restaurant" },
  ],
  bueil: [
    { name: "Domaine de Primard", category: "table", location: "Guainville, à proximité", description: "Domaine d’exception, jardins et restaurants au bord de l’Eure.", query: "Domaine de Primard restaurant" },
    { name: "Château d’Anet", category: "visiter", location: "Anet, à proximité", description: "Chef-d’œuvre Renaissance associé à Diane de Poitiers.", query: "Château d'Anet" },
    { name: "Vallée de la Vesgre", category: "activite", location: "Bueil", description: "Balades rurales entre l’Eure, la Vesgre et le Drouais.", query: "Randonnée Bueil vallée de la Vesgre" },
  ],
  evreux: [
    { name: "Cathédrale Notre-Dame", category: "visiter", location: "Évreux", description: "Architecture gothique, vitraux remarquables et histoire millénaire.", query: "Cathédrale Notre-Dame Évreux" },
    { name: "Musée d’Art, Histoire et Archéologie", category: "visiter", location: "Évreux", description: "Collections installées dans l’ancien palais épiscopal.", query: "Musée Évreux ancien évêché" },
    { name: "Jardin botanique François-Mitterrand", category: "activite", location: "Évreux", description: "Une promenade verte au cœur de la ville.", query: "Jardin botanique Évreux" },
    { name: "La Vieille Gabelle", category: "table", location: "Évreux", description: "Maison historique et cuisine française dans le centre ancien.", query: "La Vieille Gabelle Évreux restaurant" },
  ],
  giverny: [
    { name: "Maison et jardins de Claude Monet", category: "visiter", location: "Giverny", description: "Le jardin d’eau, les nymphéas et la maison du peintre.", query: "Fondation Claude Monet Giverny" },
    { name: "Musée des Impressionnismes", category: "visiter", location: "Giverny", description: "Expositions, jardin contemporain et histoire de l’impressionnisme.", query: "Musée des Impressionnismes Giverny" },
    { name: "Le Jardin des Plumes", category: "table", location: "Giverny", description: "Table gastronomique de destination dans une villa élégante.", query: "Le Jardin des Plumes Giverny" },
    { name: "Ancien Hôtel Baudy", category: "table", location: "Giverny", description: "Adresse historique fréquentée autrefois par les peintres américains.", query: "Ancien Hôtel Baudy Giverny" },
    { name: "Sentier des coteaux de Giverny", category: "activite", location: "Giverny", description: "Randonnée panoramique au-dessus du village et de la vallée.", query: "Sentier des coteaux de Giverny randonnée" },
  ],
  gasny: [
    { name: "La Roche-Guyon", category: "visiter", location: "À proximité", description: "Village classé, château troglodytique et panorama sur la Seine.", query: "Château de La Roche-Guyon" },
    { name: "Domaine de Villarceaux", category: "visiter", location: "Chaussy, à proximité", description: "Jardins historiques, château et grand domaine paysager.", query: "Domaine de Villarceaux" },
    { name: "Château de la Râpée", category: "table", location: "Bazincourt-sur-Epte", description: "Table de château dans un parc dominant la vallée de l’Epte.", query: "Château de la Râpée restaurant" },
    { name: "Véloroute de la Seine", category: "activite", location: "Autour de Gasny", description: "Itinéraires cyclables vers Giverny et La Roche-Guyon.", query: "Véloroute Seine à Vélo Gasny Giverny" },
  ],
  breuilpont: [
    { name: "Domaine de Primard", category: "table", location: "Guainville, à proximité", description: "Restaurants, spa et jardins dans un domaine au bord de l’Eure.", query: "Domaine de Primard Guainville" },
    { name: "Château d’Anet", category: "visiter", location: "À proximité", description: "Joyau Renaissance et ancienne demeure de Diane de Poitiers.", query: "Château d'Anet" },
    { name: "Étangs et chemins de l’Eure", category: "activite", location: "Breuilpont", description: "Promenades paisibles entre plans d’eau, bois et patrimoine rural.", query: "Randonnée Breuilpont Eure" },
  ],
};

export const poiLabels: Record<PoiCategory, string> = {
  visiter: "À visiter",
  table: "Tables remarquées",
  activite: "Expériences & activités",
};
