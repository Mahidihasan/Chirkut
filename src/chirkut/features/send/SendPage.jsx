import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { C, LETTER_TEMPLATES, LETTER_FONTS } from "../../constants";
import { db } from "../../firebase";
import { getLetterTexture } from "../../letterTheme";
const NO_MARGIN_TEMPLATES = new Set(["coffee", "canvas", "retro", "midnight"]);

function formatSignatureLine(signature) {
  const cleaned = (signature || "anonymous").toString().trim().replace(/^[-~\s]+/, "");
  return `- ${cleaned || "anonymous"}`;
}

const SWATCH_BG = {
  classic: "#FFFDF8",
  coffee: "linear-gradient(160deg,#EDE0C4,#E0CFA8)",
  canvas: "linear-gradient(170deg,#E4D9C8,#D8CEBC)",
  retro: "linear-gradient(180deg,#F5F0E0,#EDE7D0)",
  midnight: "linear-gradient(160deg,#1E2234,#161A28)",
};

function CoffeeOverlay({ compact }) {
  const s = compact ? 0.7 : 1;
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          pointerEvents: "none",
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' opacity=\'0.08\'/%3E%3C/svg%3E")',
          backgroundSize: "200px 200px",
          mixBlendMode: "multiply",
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(200,165,110,0.18) 0%, transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(180,140,90,0.12) 0%, transparent 50%)",
          mixBlendMode: "multiply",
        }}
      />

      <svg
        style={{ position: "absolute", top: `${-10 * s}px`, right: `${-12 * s}px`, pointerEvents: "none", overflow: "visible" }}
        width={`${120 * s}`}
        height={`${120 * s}`}
        viewBox="0 0 120 120"
      >
        <defs>
          <radialGradient id="coffeeRing" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="rgba(92,55,28,0)" />
            <stop offset="72%" stopColor="rgba(92,55,28,0.18)" />
            <stop offset="82%" stopColor="rgba(92,55,28,0.32)" />
            <stop offset="90%" stopColor="rgba(92,55,28,0.24)" />
            <stop offset="100%" stopColor="rgba(92,55,28,0.06)" />
          </radialGradient>

          <filter id="distort">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
        </defs>

        <ellipse
          cx="60"
          cy="60"
          rx="52"
          ry="46"
          fill="url(#coffeeRing)"
          opacity="1"
        />

        <ellipse
          cx="60"
          cy="60"
          rx="30"
          ry="26"
          fill="rgba(92,55,28,0.05)"
        />

        <ellipse
          cx="60"
          cy="60"
          rx="52"
          ry="46"
          fill="none"
          stroke="rgba(92,55,28,0.25)"
          strokeWidth="1.5"
          filter="url(#distort)"
          opacity="0.45"
        />
      </svg>

      <svg
        style={{ position: "absolute", top: `${compact ? 55 : 70}px`, left: `${compact ? -6 : 0}px`, pointerEvents: "none", overflow: "visible" }}
        width={`${72 * s}`}
        height={`${72 * s}`}
        viewBox="0 0 72 72"
      >
        <defs>
          <radialGradient id="s2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(116,72,30,0)" />
            <stop offset="60%" stopColor="rgba(116,72,30,0.05)" />
            <stop offset="80%" stopColor="rgba(116,72,30,0.24)" />
            <stop offset="90%" stopColor="rgba(116,72,30,0.18)" />
            <stop offset="100%" stopColor="rgba(116,72,30,0.04)" />
          </radialGradient>
        </defs>
        <ellipse cx="36" cy="38" rx="30" ry="26" fill="url(#s2)" opacity="0.85" transform="rotate(-12 36 38)" />
      </svg>

      <svg
        style={{ position: "absolute", bottom: `${compact ? 10 : 14}px`, right: `${compact ? 20 : 26}px`, pointerEvents: "none" }}
        width={`${38 * s}`}
        height={`${38 * s}`}
        viewBox="0 0 38 38"
      >
        <defs>
          <radialGradient id="s3" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="rgba(91,55,27,0.0)" />
            <stop offset="82%" stopColor="rgba(91,55,27,0.2)" />
            <stop offset="93%" stopColor="rgba(91,55,27,0.15)" />
            <stop offset="100%" stopColor="rgba(91,55,27,0.03)" />
          </radialGradient>
        </defs>
        <ellipse cx="19" cy="19" rx="16" ry="14" fill="url(#s3)" opacity="0.8" transform="rotate(20 19 19)" />
      </svg>

      {[
        { cx: 22, cy: 28, r: 2.3 },
        { cx: 40, cy: 20, r: 1.7 },
        { cx: 18, cy: 50, r: 1.5 },
        { cx: 60, cy: 38, r: 2.0 },
        { cx: 54, cy: 64, r: 1.3 },
        { cx: 30, cy: 72, r: 1.8 },
        { cx: 72, cy: 50, r: 1.4 },
      ].map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: d.cx,
            top: d.cy,
            width: d.r * 2,
            height: d.r * 2,
            borderRadius: "50%",
            background: "rgba(92,55,28,0.35)",
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
}

function CanvasOverlay() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          pointerEvents: "none",
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(118,92,66,0.09) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(118,92,66,0.07) 0 1px, transparent 1px 3px), repeating-linear-gradient(45deg, rgba(118,92,66,0.03) 0 1px, transparent 1px 6px), repeating-linear-gradient(-45deg, rgba(118,92,66,0.03) 0 1px, transparent 1px 6px)",
          mixBlendMode: "multiply",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          pointerEvents: "none",
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'turbulence\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23n)\' opacity=\'0.06\'/%3E%3C/svg%3E")',
          backgroundSize: "100px 100px",
          mixBlendMode: "multiply",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 22% 18%, rgba(255,255,255,0.22) 0%, transparent 42%), radial-gradient(ellipse at 78% 74%, rgba(255,255,255,0.12) 0%, transparent 38%)",
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(80,60,40,0.14) 100%)",
          mixBlendMode: "multiply",
        }}
      />
    </>
  );
}

function RetroOverlay({ compact }) {
  const s = compact ? 0.72 : 1;

  return (
    <>
      {/* requested retro dot texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          pointerEvents: "none",
          background: "#f5ede4",
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "4px 4px",
          mixBlendMode: "multiply",
          opacity: 0.42,
        }}
      />

      {/* fine paper fibers */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          pointerEvents: "none",
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'220\' height=\'220\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.45\' numOctaves=\'5\' seed=\'3\' stitchTiles=\'stitch\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'220\' height=\'220\' filter=\'url(%23n)\' opacity=\'0.07\'/%3E%3C/svg%3E")',
          backgroundSize: "220px 220px",
          mixBlendMode: "multiply",
          opacity: 0.9,
        }}
      />

      {/* subtle paper warmth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, rgba(255,245,210,0.18) 0%, rgba(255,245,210,0) 40%), linear-gradient(0deg, rgba(90,60,25,0.08) 0%, rgba(90,60,25,0) 35%)",
          mixBlendMode: "overlay",
        }}
      />

      {/* aged edges vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0) 60%, rgba(70,45,20,0.12) 100%)",
          mixBlendMode: "multiply",
          opacity: 0.7,
        }}
      />

      {/* subtle fold / paper line */}
      <div
        style={{
          position: "absolute",
          left: `${22 * s}px`,
          right: `${20 * s}px`,
          top: `${compact ? 36 : 48}px`,
          height: `${compact ? 1 : 1.2}px`,
          background:
            "linear-gradient(90deg, rgba(79,55,26,0), rgba(79,55,26,0.2), rgba(79,55,26,0))",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />

      {/* random ink dots */}
      {[
        { x: 12, y: 10, w: 3, h: 2, o: 0.4 },
        { x: 30, y: 8, w: 2, h: 2, o: 0.35 },
        { x: 82, y: 12, w: 3, h: 2, o: 0.42 },
        { x: 6, y: 46, w: 2, h: 4, o: 0.38 },
        { x: 93, y: 62, w: 2, h: 4, o: 0.36 },
        { x: 28, y: 95, w: 4, h: 2, o: 0.4 },
        { x: 68, y: 97, w: 3, h: 2, o: 0.35 },
      ].map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: `${c.w * s}px`,
            height: `${c.h * s}px`,
            borderRadius: "1px",
            background: `rgba(30,18,6,${c.o})`,
            transform: `rotate(${(i % 3 - 1) * 12}deg)`,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
}

function MidnightOverlay() {
  return (
    <>
      <div style={{ position: "absolute", top: 6, right: 10, width: 3, height: 3, borderRadius: "50%", background: "rgba(150,170,240,0.4)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 16, right: 24, width: 2, height: 2, borderRadius: "50%", background: "rgba(150,170,240,0.25)", pointerEvents: "none" }} />
    </>
  );
}

function PaperOverlay({ templateId, compact }) {
  if (templateId === "coffee") return <CoffeeOverlay compact={compact} />;
  if (templateId === "canvas") return <CanvasOverlay />;
  if (templateId === "retro") return <RetroOverlay compact={compact} />;
  if (templateId === "midnight") return <MidnightOverlay />;
  return null;
}

function SwatchPreview({ t }) {
  return (
    <div
      style={{
        width: 40,
        height: 28,
        borderRadius: 6,
        background: SWATCH_BG[t.id],
        border: `1px solid ${t.id === "midnight" ? "rgba(100,120,200,0.34)" : "rgba(0,0,0,0.08)"}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {t.id === "classic" && (
        <>
          <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(180deg,transparent,transparent 5px,${t.rule} 5px,${t.rule} 6px)`, opacity: 0.7 }} />
          <div style={{ position: "absolute", left: 6, top: 0, bottom: 0, width: 1, background: t.guide, opacity: 0.5 }} />
        </>
      )}
      {t.id === "coffee" && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 30%, rgba(200,165,110,0.2) 0%, transparent 80%)", mixBlendMode: "multiply" }} />
          <div style={{ position: "absolute", top: -5, right: -4, width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(91,55,27,0.28)" }} />
          <div style={{ position: "absolute", top: 7, right: 8, width: 8, height: 8, borderRadius: "50%", border: "1.5px solid rgba(91,55,27,0.2)" }} />
        </>
      )}
      {t.id === "canvas" && (
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,rgba(118,92,66,0.1) 0 1px,transparent 1px 3px),repeating-linear-gradient(90deg,rgba(118,92,66,0.08) 0 1px,transparent 1px 3px)", opacity: 0.7 }} />
      )}
      {t.id === "retro" && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, transparent 56%, rgba(64,45,20,0.22) 100%)" }} />
          <div style={{ position: "absolute", top: 3, right: 4, width: 10, height: 2, background: "rgba(40,22,4,0.22)", borderRadius: 2 }} />
        </>
      )}
      {t.id === "midnight" && <div style={{ position: "absolute", top: 4, right: 5, width: 3, height: 3, borderRadius: "50%", background: "rgba(150,170,240,0.5)" }} />}
    </div>
  );
}

export default function SendPage({ currentUsername, presetRecipient, darkMode }) {
  const [msg, setMsg] = useState("");
  const [sig, setSig] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [templateId, setTpl] = useState("classic");
  const [fontId, setFont] = useState("handwriting");
  const [selectedRecipient, setSelectedRecipient] = useState((presetRecipient || "").toLowerCase());

  const tpl = LETTER_TEMPLATES.find((t) => t.id === templateId) || LETTER_TEMPLATES[0];
  const fnt = LETTER_FONTS.find((f) => f.id === fontId) || LETTER_FONTS[0];
  const showMarginLines = !NO_MARGIN_TEMPLATES.has(tpl.id);
  const letterTexture = getLetterTexture(tpl.id);

  useEffect(() => {
    if (!presetRecipient) return;
    const next = presetRecipient.trim().toLowerCase();
    setSelectedRecipient(next);
  }, [presetRecipient]);

  const send = async () => {
    const target = (selectedRecipient || "").trim().toLowerCase();
    if (!target) return setErr("Recipient not specified");
    if (currentUsername && target === currentUsername) return setErr("You can't send a letter to yourself");
    if (!msg.trim()) return setErr("Write something first");
    if (msg.length > 500) return setErr("Keep it under 500 characters");
    setErr("");
    setLoading(true);
    try {
      await addDoc(collection(db, "messages"), {
        toUsername: target,
        message_text: msg.trim(),
        optional_signature: sig.trim() ? sig.trim() : null,
        created_at: serverTimestamp(),
        is_read: false,
        template: tpl.id,
        font: fontId,
      });
      setSelectedRecipient(target);
      setSent(true);
    } catch (error) {
      const code = error?.code || "";
      if (code.includes("permission-denied")) {
        setErr("Send blocked by Firestore rules. Allow create on messages.");
      } else if (code.includes("unauthenticated")) {
        setErr("Please sign in to send letters.");
      } else {
        setErr("Could not send letter. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Sent confirmation ── */
  if (sent) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 20px 60px", background: darkMode ? "#1C1208" : C.bg }}>
        <div
          style={{
            width: "min(360px, 90vw)",
            background: tpl.letterBg,
            border: `1.5px solid ${tpl.letterBorder}`,
            borderRadius: 12,
            padding: "32px 28px 26px",
            position: "relative",
            boxShadow: tpl.id === "midnight" ? "0 12px 36px rgba(0,0,0,0.5)" : "0 8px 28px rgba(107,79,59,0.14)",
            animation: "reveal .42s ease-out",
            overflow: "hidden",
          }}
        >
          {showMarginLines && <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: `repeating-linear-gradient(180deg,transparent,transparent 24px,${tpl.rule} 24px,${tpl.rule} 25px)`, pointerEvents: "none" }} />}
          {showMarginLines && <div style={{ position: "absolute", left: 38, top: 0, bottom: 0, width: 1, background: tpl.guide, pointerEvents: "none" }} />}
          <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: letterTexture, pointerEvents: "none" }} />
          <p style={{ fontFamily: fnt.family, fontSize: 17, lineHeight: "24px", color: tpl.ink, whiteSpace: "pre-wrap", wordBreak: "break-word", position: "relative", zIndex: 1 }}>
            {msg}
          </p>
          {sig && (
            <p style={{ marginTop: 16, fontFamily: fnt.family, fontStyle: "italic", fontSize: 12, color: tpl.sign, textAlign: "right", position: "relative", zIndex: 1 }}>
              {formatSignatureLine(sig)}
            </p>
          )}
        </div>

        <h2 style={{ fontFamily: "'Fraunces', serif", color: darkMode ? "#EDE0D4" : C.accent, fontSize: 26, fontWeight: 600, marginTop: 28, marginBottom: 6 }}>
          Letter sealed
        </h2>
        <p style={{ color: darkMode ? "#776258" : C.muted, fontSize: 14, marginBottom: 24, fontFamily: '"IBM Plex Sans", system-ui, sans-serif' }}>
          Heading to {selectedRecipient || "their"} postbox.
        </p>
        <button className="paper-btn" onClick={() => { setSent(false); setMsg(""); setSig(""); }}>
          Write another
        </button>
      </div>
    );
  }

  /* ── Compose ── */
  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
    color: darkMode ? "#776258" : C.muted,
    marginBottom: 8,
    display: "block",
  };

  return (
    <div style={{ minHeight: "80vh", padding: "clamp(18px,4vw,28px) clamp(12px,4vw,18px) clamp(32px,7vw,48px)", background: darkMode ? "#1C1208" : C.bg }}>
      <div style={{ maxWidth: 560, margin: "0 auto", width: "100%", padding: "0 clamp(6px,3vw,12px)", animation: "fadeIn .5s ease-out" }}>

        {/* Header */}
        <div
          style={{
            marginBottom: 18,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                color: darkMode ? "#EDE0D4" : C.accent,
                fontSize: "clamp(24px,6vw,34px)",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                marginBottom: 4,
              }}
            >
              Write to <em>{selectedRecipient || "someone special"}</em>
            </h2>

            <p
              style={{
                color: darkMode ? "#776258" : C.muted,
                fontSize: "clamp(13px,3.4vw,15px)",
                fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
              }}
            >
              Completely anonymous
            </p>
          </div>

          {!selectedRecipient && (
            <p style={{ textAlign: "center", color: darkMode ? "#8D7769" : C.muted, fontSize: 13, fontFamily: '"IBM Plex Sans", system-ui, sans-serif' }}>
              Choose a recipient first.
            </p>
          )}
        </div>



        {/* ── Letter card ── */}
        <div style={{
          background: tpl.letterBg,
          border: `1.5px solid ${tpl.letterBorder}`,
          borderRadius: 12,
          padding: "clamp(14px,4vw,20px)",
          position: "relative",
          overflow: "hidden",
          boxShadow: tpl.id === "midnight" ? "0 8px 32px rgba(0,0,0,0.45)" : "0 4px 20px rgba(107,79,59,0.1)",
          transition: "background .3s ease, border-color .3s ease, box-shadow .3s ease",
        }}>
          {showMarginLines && <div style={{ position: "absolute", inset: 0, borderRadius: 12, pointerEvents: "none", background: `repeating-linear-gradient(180deg,transparent,transparent 24px,${tpl.rule} 24px,${tpl.rule} 25px)` }} />}
          {showMarginLines && <div style={{ position: "absolute", left: 38, top: 0, bottom: 0, width: 1, background: tpl.guide, pointerEvents: "none" }} />}
          <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: letterTexture, pointerEvents: "none" }} />

          <textarea
            rows={7}
            placeholder="Dear friend..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            maxLength={500}
            style={{
              width: "100%", background: "transparent", border: "none", outline: "none",
              resize: "none", fontFamily: fnt.family, fontSize: 17, lineHeight: "24px",
              color: tpl.ink, position: "relative", zIndex: 1,
              caretColor: tpl.id === "midnight" ? "#8096C4" : C.primary,
              transition: "color .3s, font-family .2s",
            }}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6, position: "relative", zIndex: 1 }}>
            <span style={{ fontSize: 11, fontFamily: '"IBM Plex Sans", system-ui, sans-serif', color: tpl.id === "midnight" ? "rgba(140,160,210,0.45)" : "rgba(107,79,59,0.3)" }}>
              {msg.length}/500
            </span>
          </div>

          <input
            placeholder="Optional signature  (e.g. - a friend)"
            value={sig}
            onChange={(e) => setSig(e.target.value)}
            maxLength={60}
            style={{
              width: "100%", background: "transparent", border: "none",
              borderTop: `1px solid ${tpl.id === "midnight" ? "rgba(100,120,200,0.2)" : "rgba(107,79,59,0.12)"}`,
              outline: "none", fontFamily: fnt.family, fontStyle: "italic",
              fontSize: 14, lineHeight: "28px", color: tpl.sign,
              paddingTop: 10, position: "relative", zIndex: 1, transition: "color .3s",
            }}
          />
        </div>

                {/* ── Template picker ── */}
        <div style={{ marginBottom: 16 }}>
          <span style={labelStyle}>Paper</span>
          <div
            className="scroll-row"
            style={{
              display: "flex",
              gap: 5,
              overflowX: "auto",
              paddingBottom: 2,
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
            }}
          >
            {LETTER_TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTpl(t.id)}
                title={t.desc}
                style={{
                  flexShrink: 0,
                  scrollSnapAlign: "start",
                  width: "clamp(50px, 16vw, 58px)",
                  padding: "8px 0",
                  borderRadius: 12,
                  border: templateId === t.id
                    ? `1px solid ${darkMode ? "#E7D9C9" : C.primary}`
                    : `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(107,79,59,0.16)"}`,
                  background: templateId === t.id
                    ? (darkMode ? "rgba(255,255,255,0.06)" : "rgba(90,70,52,0.05)")
                    : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  transition: "border-color .18s, background .18s",
                }}
              >
                <SwatchPreview t={t} />
                <span style={{ fontSize: 10, fontFamily: '"IBM Plex Sans", system-ui, sans-serif', fontWeight: 600, color: templateId === t.id ? (darkMode ? "#EDE0D4" : C.primary) : (darkMode ? "#8A7060" : C.muted) }}>
                  {t.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Font picker ── */}
        <div style={{ marginBottom: 18 }}>
          <span style={labelStyle}>Font</span>
          <div
            className="scroll-row"
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "nowrap",
              overflowX: "auto",
              paddingBottom: 2,
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
            }}
          >
            {LETTER_FONTS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFont(f.id)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: `1px solid ${fontId === f.id ? (darkMode ? "#E7D9C9" : C.primary) : (darkMode ? "rgba(255,255,255,0.08)" : "rgba(107,79,59,0.16)")}`,
                  cursor: "pointer",
                  fontFamily: f.family,
                  fontSize: 14,
                  background: fontId === f.id
                    ? (darkMode ? "rgba(255,255,255,0.08)" : "rgba(90,70,52,0.06)")
                    : "transparent",
                  color: fontId === f.id ? (darkMode ? "#F2E7DA" : C.primary) : (darkMode ? "#C4A882" : C.secondary),
                  transition: "border-color .18s, color .18s, background .18s",
                }}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {err && (
          <p style={{ color: C.seal, fontSize: 13, marginTop: 8, textAlign: "center", fontFamily: '"IBM Plex Sans", system-ui, sans-serif' }}>{err}</p>
        )}

        <button
          className="paper-btn" onClick={send} disabled={loading}
          style={{ width: "100%", marginTop: 16, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Delivering..." : "Seal & Send"}
        </button>
      </div>
    </div>
  );
}
