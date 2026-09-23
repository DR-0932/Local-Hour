/**
 * orbit-cards.js
 *
 * Everything you see on the 6 orbit cards lives here — images, copy, colours,
 * where the text sits. Edit this file only; OrbitProjects doesn't need to change.
 *
 * ─── Fields on each card ───────────────────────────────────────────────────
 *  image          photo used as the card background
 *  label          used for the link's aria-label (screen readers)
 *  link           optional URL — makes the whole card clickable
 *
 *  eyebrow        small line, top-left            (e.g. "Our mission")
 *  meta           small line, top-right           (optional)
 *  title          big headline. Use \n for a line break
 *  body           supporting paragraph under the title
 *  footerLeft     small line, bottom-left
 *  footerRight    small line, bottom-right        (good for a "Join now" hint)
 *
 *  Any default below can be overridden per card. The useful ones:
 *  titlePosition  "top" | "center" | "bottom"     where the title + body sit
 *  align          "left" | "center" | "right"     text alignment
 *  accent         colour for eyebrow / footer text
 *  titleColor     colour of the headline (falls back to textColor)
 *  textColor      colour of body text
 *  overlay        0 – 1, how dark the photo is behind the text
 *  overlayFrom    "bottom" | "top" | "full"       where the darkening happens
 *
 * ─── Sizes ─────────────────────────────────────────────────────────────────
 *  titleSize / bodySize / smallSize / padding are in "cqw" — a percentage of
 *  the CARD's own width. So text scales with the card as it moves along the
 *  orbit and flattens into the grid. 9 ≈ 9% of the card width.
 *  Long headline? Drop titleSize. Short one? Raise it.
 */

/* Colours lifted from the boxes on the site, so the cards feel like the same family. */
export type OrbitOverlayFrom = "top" | "bottom" | "full";
export type OrbitAlign = "left" | "center" | "right";
export type OrbitJustify = "top" | "center" | "bottom";

export type OrbitCardTextConfig = {
  title?: string;
  body?: string;
  eyebrow?: string;
  meta?: string;
  footerLeft?: string;
  footerRight?: string;
  overlay: number;
  overlayFrom: OrbitOverlayFrom;
  padding: number;
  textColor: string;
  align: OrbitAlign;
  accent: string;
  titlePosition: OrbitJustify;
  titleFont: string;
  titleSize: number;
  titleWeight: number;
  titleLeading: number;
  titleTracking: string;
  titleColor?: string;
  bodyFont: string;
  bodySize: number;
  bodyWidth: number;
  smallFont: string;
  smallSize: number;
};


export const PALETTE = {
  mint: "#b5eecf",
  lilac: "#dcc6f2",
  orange: "#ffc48a",
  cream: "#fcf8ec",
};

/* Defaults applied to every card. Override any of these inside a card. */
export const CARD_TEXT_DEFAULTS = {
  // colour
  textColor: "#ffffff",
  titleColor: null, // null → uses textColor
  accent: "#ffffff",

  // fonts — "inherit" picks up whatever font your site already uses
  titleFont: "inherit",
  bodyFont: "inherit",
  smallFont: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',

  // type scale (cqw = % of card width)
  titleSize: 9,
  titleWeight: 500,
  titleLeading: 0.95,
  titleTracking: "-0.05em",
  bodySize: 3.3,
  bodyWidth: 78, // % of the card's inner width
  smallSize: 2.8,

  // layout
  padding: 6, // cqw
  titlePosition: "bottom",
  align: "left",

  // photo overlay
  overlay: 0.5,
  overlayFrom: "bottom",
};

export const ORBIT_CARDS = [
  {
    image: "/club/image01.jpeg",
    label: "Our mission",
    smallSize:3,
    eyebrow: "Our mission",
    title: "Disconnect with screens and scrolls and connect more with people and surroundings.",
    titleSize: 6.5,
    titleWeight: 400,
    titleColor:PALETTE.mint,
    body: "We create welcoming spaces for people.",
    bodySize:3,
    padding:10,
    // footerLeft: "New people",
    footerRight: "Brighter Sundays",
    accent: PALETTE.mint,
    overlay: 0.6,
    overlayFrom: "full",

  },

  {
    image: "/club/image08.jpeg",
    label: "Who is it for",
    smallSize:3.8,
    eyebrow: "Who is it for?",
    title: "All Ages.",
    titleSize: 8,
    titleWeight: 600,
    titlePosition: "center",
    titleColor: "#f1c2ff",
    align: "left",
    body: "Open to all age groups and experience levels",
    bodySize:4,
    bodyWidth: 82,
    accent: "#f1c2ff",
    overlay: 0.6,
    overlayFrom: "full",
    footerRight: "Waiting for you",


  },

  {
    image: "/club/image05.jpeg",
    label: "General sessions",
    eyebrow: "General sessions",
    title: "Every\nSunday",
    titleSize: 15,
    titleWeight: 700,
    titleLeading: 0.88,
    titleColor: PALETTE.orange,
    titlePosition: "top",
    align: "right",
    body: "3:00 PM – 5:00 PM",
    bodySize: 4.6,
    footerLeft: "Unless an event states otherwise",
    accent: PALETTE.orange,
    overlay: 0.6,
    overlayFrom: "full",
  },

  {
    image: "/club/image11.jpeg",
    label: "Find us at Tealogy",
    eyebrow: "Find us",
    title: "Tealogy",
    titleSize: 15,
    body: "Makronia, Sagar",
    bodySize: 4.4,
    footerRight: "☕",
    accent: PALETTE.cream,
    overlay: 0.55,
    overlayFrom: "full",
  },

  {
    image: "/club/image03.jpeg",
    label: "Stay updated",
    // link: "https://chat.whatsapp.com/YOUR-INVITE-LINK",
    eyebrow: "Stay updated",
    title: "Never miss\nan update.",
    titleSize: 9.5,
    body: "",
    footerRight: "Join WhatsApp →",
    accent: PALETTE.lilac,
    overlay: 0.65,
  },

  {
    image: "/club/image06.jpeg",
    label: "Join the community",
    // link: "/join",
    eyebrow: "Join us",
    title: "Be part of\nour community ♡",
    titleSize: 10.5,
    titleWeight: 400,
    footerRight: "Join now →",
    accent: PALETTE.mint,
    overlay: 0.55,
  },
];