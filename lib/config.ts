// v1 is manual-fulfilment: the public site captures a lead and hands off to
// WhatsApp. The full SaaS studio (conversation, card builder, checkout,
// tracking) stays in the repo but sits behind this flag until we build real
// login in v2 — flip STUDIO_ENABLED to true then and it all comes back.
export const STUDIO_ENABLED = false;

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919712243992";

// Paste a Google Calendar Appointment / Calendly / Cal.com public link here
// (no API key needed). When empty, the booking option is hidden and WhatsApp
// is the only path.
export const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || "";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
