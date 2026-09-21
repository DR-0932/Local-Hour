"use client";

import * as React from "react";
import { CARD_TEXT_DEFAULTS } from "./orbit-cards";

/**
 * OrbitCardFace
 *
 * Drop-in replacement for the old <CardFace>. Same props, so OrbitProjects
 * calls it exactly as before. Renders:
 *
 *   photo  →  dark overlay (for legibility)  →  text layer
 *
 * All type sizes use `cqw` (container-query width units), and the face is the
 * container — so the text scales with the card through the orbit and the
 * flatten-to-grid phase, and stays identical at any renderQuality.
 *
 * Content comes from ./orbit-cards.js. This file is layout only.
 */

const JUSTIFY = { top: "flex-start", center: "center", bottom: "flex-end" };
const ALIGN = { left: "flex-start", center: "center", right: "flex-end" };

function overlayBackground(from, strength) {
  const s = Math.min(Math.max(strength, 0), 1);
  if (from === "full") return `rgba(0,0,0,${s})`;
  const direction = from === "top" ? "to bottom" : "to top";
  return `linear-gradient(${direction}, rgba(0,0,0,${s}) 0%, rgba(0,0,0,${s * 0.4}) 55%, rgba(0,0,0,${s * 0.12}) 100%)`;
}

export default function CardFace({
  item,
  index,
  radius,
  imageFit,
  background,
  labelColor,
  shadowStrength = 1,
  quality = 1,
}) {
  const t = { ...CARD_TEXT_DEFAULTS, ...item };
  const hasText = Boolean(t.title || t.body || t.eyebrow || t.meta || t.footerLeft || t.footerRight);
  const hasTopRow = Boolean(t.eyebrow || t.meta);
  const hasFooter = Boolean(t.footerLeft || t.footerRight);

  const small = {
    fontFamily: t.smallFont,
    fontSize: `${t.smallSize}cqw`,
    lineHeight: 1.3,
    letterSpacing: "0.01em",
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden [backface-visibility:hidden]"
      style={{
        containerType: "inline-size",
        borderRadius: radius,
        background,
        boxShadow: `0 ${18 * shadowStrength * quality}px ${50 * shadowStrength * quality}px rgba(0,0,0,${0.12 * shadowStrength})`,
      }}
    >
      {item.image ? (
        <img
          src={item.image}
          alt={hasText ? "" : item.label || `Project ${index + 1}`}
          draggable={false}
          loading="eager"
          className="block h-full w-full select-none [backface-visibility:hidden]"
          style={{ objectFit: imageFit, background, pointerEvents: "none" }}
        />
      ) : (
        !hasText && (
          <div
            className="absolute inset-0 flex items-center justify-center p-6 text-center"
            style={{ color: labelColor }}
          >
            {item.label || `Project ${index + 1}`}
          </div>
        )
      )}

      {hasText && (
        <>
          {/* legibility overlay */}
          {item.image && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: overlayBackground(t.overlayFrom, t.overlay) }}
            />
          )}

          {/* text layer */}
          <div
            className="pointer-events-none absolute inset-0 flex select-none flex-col justify-between"
            style={{ padding: `${t.padding}cqw`, color: t.textColor, textAlign: t.align }}
          >
            {/* top row */}
            <div
              className="flex items-start justify-between"
              style={{ ...small, gap: "3cqw", minHeight: hasTopRow ? undefined : 0 }}
            >
              <span style={{ color: t.accent }}>{t.eyebrow}</span>
              <span style={{ opacity: 0.85 }}>{t.meta}</span>
            </div>

            {/* title + body */}
            <div
              className="flex min-h-0 flex-1 flex-col"
              style={{
                justifyContent: JUSTIFY[t.titlePosition] || "flex-end",
                alignItems: ALIGN[t.align] || "flex-start",
              }}
            >
              {t.title && (
                <h3
                  className="m-0"
                  style={{
                    fontFamily: t.titleFont,
                    fontSize: `${t.titleSize}cqw`,
                    fontWeight: t.titleWeight,
                    lineHeight: t.titleLeading,
                    letterSpacing: t.titleTracking,
                    color: t.titleColor || t.textColor,
                    whiteSpace: "pre-line",
                  }}
                >
                  {t.title}
                </h3>
              )}
              {t.body && (
                <p
                  className="m-0"
                  style={{
                    fontFamily: t.bodyFont,
                    fontSize: `${t.bodySize}cqw`,
                    lineHeight: 1.4,
                    maxWidth: `${t.bodyWidth}%`,
                    marginTop: t.title ? "2.2cqw" : 0,
                    opacity: 0.92,
                  }}
                >
                  {t.body}
                </p>
              )}
            </div>

            {/* footer row */}
            {hasFooter && (
              <div className="flex items-end justify-between" style={{ ...small, gap: "3cqw" }}>
                <span style={{ color: t.accent }}>{t.footerLeft}</span>
                <span style={{ color: t.accent }}>{t.footerRight}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
 