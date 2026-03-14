import { useEffect, useMemo, useState } from "react";
import { C, LETTER_TEMPLATES, LETTER_FONTS } from "../../constants";
import { CoffeeStain } from "../../components/Decor";
import { getLetterTexture } from "../../letterTheme";

function hashToUnit(seed) {
  let h = 2166136261;
  const s = String(seed || "");
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

export default function EnvelopeModal({ message, onClose, onShare, darkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  const rawTemplate = (
    message.template
    || message.templateId
    || message.paper
    || message.paperType
    || ""
  ).toString().trim().toLowerCase();

  const normalizedTemplate =
    rawTemplate.includes("coffee") ? "coffee"
      : rawTemplate.includes("canvas") ? "canvas"
      : rawTemplate.includes("retro") ? "retro"
      : rawTemplate.includes("midnight") ? "midnight"
      : rawTemplate.includes("classic") ? "classic"
      : rawTemplate;

  const tpl = LETTER_TEMPLATES.find((t) => t.id === normalizedTemplate) || LETTER_TEMPLATES[0];
  const fnt = LETTER_FONTS.find((f) => f.id === message.font)         || LETTER_FONTS[0];

  const coffeeStamp = useMemo(() => {
    const seedBase = `${message.id || ""}|${message.message_text || ""}|${message.created_at || ""}`;
    const u1 = hashToUnit(`${seedBase}-1`);
    const u2 = hashToUnit(`${seedBase}-2`);
    const u3 = hashToUnit(`${seedBase}-3`);
    const u4 = hashToUnit(`${seedBase}-4`);

    return {
      ringX: 82 + Math.round(u1 * 6),
      ringY: 15 + Math.round(u2 * 7),
      ringTilt: -8 + Math.round(u3 * 18),
      ringOpacity: 0.9 + u4 * 0.22,
      splatDx: -10 + Math.round(u2 * 14),
      splatDy: -8 + Math.round(u1 * 12),
      splatOpacity: 0.2 + u3 * 0.18,
    };
  }, [message.created_at, message.id, message.message_text]);

  useEffect(() => {
    const autoOpen = setTimeout(() => setIsOpen(true), 180);
    return () => clearTimeout(autoOpen);
  }, []);

  const toggleOpen = () => setIsOpen((v) => !v);

  /* animated font: words fade in staggered after envelope opens */
  const renderBody = () => {
    if (fnt.id === "animated" && isOpen) {
      return message.message_text.split(" ").map((word, i) => (
        <span
          key={i}
          style={{ display: "inline", animation: `wordFadeIn 0.18s ease-out ${0.55 + i * 0.07}s both` }}
        >
          {word}{" "}
        </span>
      ));
    }
    return message.message_text;
  };

  /* CSS custom properties applied on the env-scene so they cascade into .env-letter */
  const cssVars = {
    "--lt-bg":     tpl.letterBg,
    "--lt-border": tpl.letterBorder,
    "--lt-ink":    tpl.ink,
    "--lt-sign":   tpl.sign,
    "--lt-rule":   tpl.rule,
    "--lt-guide":  tpl.guide,
    "--lt-font":   fnt.family,
    "--lt-texture": getLetterTexture(tpl.id),
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, background: "rgba(30,18,8,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div style={{ width: "100%", maxWidth: 460, animation: "reveal .42s ease-out" }}>
        <div className="env-stage" style={{ position: "relative", background: darkMode ? "#2D2116" : "transparent", borderRadius: 12 }}>
          <CoffeeStain style={{ position: "absolute", top: -10, right: -8, width: 84, opacity: 0.1 }} />

          <div
            className={`env-scene ${isOpen ? "open" : ""} ${!message.is_read ? "unread" : ""}`}
            role="button"
            tabIndex={0}
            aria-label="Click to open envelope"
            onClick={toggleOpen}
            style={cssVars}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleOpen();
              }
            }}
          >
            <div className="env-letter">
              {tpl.id === "coffee" && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      opacity: coffeeStamp.ringOpacity,
                      background:
                        `radial-gradient(70px 58px at ${coffeeStamp.ringX}% ${coffeeStamp.ringY}%, rgba(86,49,24,0) 58%, rgba(86,49,24,0.22) 72%, rgba(86,49,24,0.1) 84%, rgba(86,49,24,0) 100%), radial-gradient(52px 42px at ${coffeeStamp.ringX}% ${coffeeStamp.ringY}%, rgba(86,49,24,0) 66%, rgba(86,49,24,0.15) 80%, rgba(86,49,24,0) 100%), radial-gradient(90px 70px at 16% 78%, rgba(108,66,35,0.14) 0%, rgba(108,66,35,0) 72%)`,
                      transform: `rotate(${coffeeStamp.ringTilt}deg)`,
                      mixBlendMode: "multiply",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 30 + coffeeStamp.splatDy,
                      right: 42 - coffeeStamp.splatDx,
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      background: `rgba(86,49,24,${0.2 + coffeeStamp.splatOpacity})`,
                      boxShadow:
                        "-18px 12px 0 rgba(86,49,24,0.23), -10px 28px 0 rgba(86,49,24,0.2), -34px 20px 0 rgba(86,49,24,0.16), -22px 36px 0 rgba(86,49,24,0.12)",
                      pointerEvents: "none",
                    }}
                  />
                </>
              )}
              <div className="letter-content">
                <p className="body">{renderBody()}</p>
                <p className="sign">{message.optional_signature || "~ anonymous"}</p>
              </div>
            </div>

            <div className="env-base">
              <div className="env-address" />
              <span className="env-joint env-joint-left" />
              <span className="env-joint env-joint-right" />
            </div>

            <div className="env-flap" />
            {!message.is_read && (
              <div className="env-wax">
                <svg className="env-wax-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 3.6l2.1 4.2 4.6.7-3.3 3.2.8 4.5L12 14l-4.2 2.2.8-4.5-3.3-3.2 4.6-.7L12 3.6z"
                    fill="rgba(126,16,11,0.52)"
                    stroke="rgba(255,215,198,0.28)"
                    strokeWidth="0.6"
                  />
                </svg>
              </div>
            )}
          </div>

          <p className="env-label">{isOpen ? "Click to close" : "Click to open"}</p>

          <div style={{ marginTop: 14, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="modal-share-btn" onClick={() => onShare?.(message)}>
              Share this letter
            </button>
            <button className="modal-close-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
