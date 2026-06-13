// Public-facing pricing for v1. The internal SaaS checkout (lib/types TIERS)
// is gated behind login; this is the source of truth for the landing page
// and the booking flow.

export interface PublicTier {
  id: string;
  name: string;
  price: number;
  tagline: string;
  includes: string[];
  featured?: boolean;
}

export const TIERS: PublicTier[] = [
  {
    id: "classic",
    name: "Classic",
    price: 1700,
    tagline: "the card, and their song",
    includes: [
      "Hardcover card, hand-finished",
      "An original song written from your memories",
      "Your song delivered as an MP3",
    ],
  },
  {
    id: "signature",
    name: "Signature",
    price: 2100,
    tagline: "the one most people choose",
    featured: true,
    includes: [
      "Everything in Classic",
      "Their personal page + QR, hosted for a year",
      "2 keepsake RFID cards",
      "One song revision",
    ],
  },
  {
    id: "heirloom",
    name: "Heirloom",
    price: 2500,
    tagline: "wrapped to be remembered",
    includes: [
      "Everything in Signature",
      "Premium gift box & packaging",
      "A second song revision",
    ],
  },
];

// The card alone, no song — kept off the main ladder so it never anchors
// the brand low.
export const CARD_ONLY = {
  id: "note",
  name: "Just the card",
  price: 500,
  note: "the hand-finished card, without a song",
};

export function tierById(id: string): PublicTier | undefined {
  return TIERS.find((t) => t.id === id);
}
