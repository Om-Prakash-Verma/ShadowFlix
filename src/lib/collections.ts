export interface FeaturedCollectionSeed {
  id: number;
  title: string;
  count?: number;
}

export const FEATURED_COLLECTION_IDS: FeaturedCollectionSeed[] = [
  { id: 10, title: "Star Wars Collection" },
  { id: 86311, title: "The Avengers Collection" },
  { id: 295, title: "Pirates of the Caribbean Collection" },
  { id: 1241, title: "Harry Potter Collection" },
  { id: 119, title: "The Lord of the Rings Collection" },
  { id: 645, title: "James Bond Collection" },
  { id: 87359, title: "Mission: Impossible Collection" },
  { id: 2344, title: "The Matrix Collection" },
  { id: 9485, title: "The Fast and the Furious Collection" },
  { id: 2602, title: "Scream Collection" },
];