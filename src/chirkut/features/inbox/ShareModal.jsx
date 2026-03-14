import { useEffect, useRef, useState } from "react";
import { C, LETTER_FONTS, LETTER_TEMPLATES } from "../../constants";

function getLines(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
      return;
    }
    line = testLine;
  });
  if (line) lines.push(line);
  return lines;
}

function drawLines(ctx, lines, x, startY, lineHeight) {
  let y = startY;
  lines.forEach((line) => {
    ctx.fillText(line, x, y);
    y += lineHeight;
  });
  return y;
}

function seededRandomFactory(seed) {
  let h = 2166136261;
  const s = String(seed || "");
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let state = h >>> 0;
  return () => {
    state = Math.imul(1664525, state) + 1013904223;
    return ((state >>> 0) % 10000) / 10000;
  };
}

function drawCoffeeStains(ctx, cardX, cardY, cardW, cardH, seed) {
  const rand = seededRandomFactory(seed);
  const cx = cardX + cardW - 118 + Math.round((rand() - 0.5) * 18);
  const cy = cardY + 108 + Math.round((rand() - 0.5) * 14);
  const tilt = -0.22 + (rand() - 0.5) * 0.32;
  const mainA = 0.22 + rand() * 0.12;
  const innerA = 0.12 + rand() * 0.1;

  ctx.save();

  // Main ring stain (top-right)
  ctx.strokeStyle = `rgba(91,55,27,${mainA.toFixed(3)})`;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 62, 52, tilt, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = `rgba(91,55,27,${innerA.toFixed(3)})`;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 38, 30, tilt, 0, Math.PI * 2);
  ctx.stroke();

  // Secondary faded stain (left-bottom)
  ctx.strokeStyle = `rgba(105,66,34,${(0.1 + rand() * 0.08).toFixed(3)})`;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(cardX + 156 + Math.round((rand() - 0.5) * 24), cardY + cardH - 138 + Math.round((rand() - 0.5) * 20), 58, 48, 0.18 + (rand() - 0.5) * 0.2, 0, Math.PI * 2);
  ctx.stroke();

  // Tiny splatters
  const dots = Array.from({ length: 8 }, (_, i) => {
    const nearTopRight = i < 5;
    const baseX = nearTopRight ? cardX + cardW - 190 : cardX + 120;
    const baseY = nearTopRight ? cardY + 150 : cardY + cardH - 170;
    return [
      baseX + Math.round((rand() - 0.5) * 70),
      baseY + Math.round((rand() - 0.5) * 55),
      1.3 + rand() * 2.0,
      0.08 + rand() * 0.2,
    ];
  });
  dots.forEach(([x, y, r, a]) => {
    ctx.fillStyle = `rgba(91,55,27,${a})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

export default function ShareModal({ username, message, onClose, darkMode }) {
  const canvasRef = useRef(null);
  const [previewSrc, setPreviewSrc] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !message) return;
    const ctx = canvas.getContext("2d");

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
    const fnt = LETTER_FONTS.find((f) => f.id === message.font) || LETTER_FONTS[0];

    const cardFillByTemplate = {
      classic: "#FFFDF8",
      coffee: "#E8D5B0",
      canvas: "#DDD3C0",
      retro: "#F0EAD8",
      midnight: "#1E2234",
    };

    const canvasW = 1200;
    const outerPad = 0;
    const cardX = outerPad;
    const cardY = outerPad;
    const cardW = canvasW - outerPad * 2;
    const marginLeft = 120;
    const marginRight = 120;
    const topPad = 160;
    const bottomPad = 110;
    const signature = message.optional_signature || "~ anonymous";
    const messageText = message.message_text || "";
    const maxTextWidth = cardW - marginLeft - marginRight;

    let fontSize = 48;
    let lineHeight = 66;
    let sigSize = 34;
    let lines = [];
    let cardH = 760;

    const bodyFontFamily = fnt.id === "cozy" ? "Georgia" : "Kalam";

    while (fontSize >= 28) {
      ctx.font = `italic ${fontSize}px ${bodyFontFamily}`;
      lineHeight = Math.round(fontSize * 1.38);
      lines = getLines(ctx, messageText, maxTextWidth);
      sigSize = Math.max(28, Math.round(fontSize * 0.7));
      cardH = Math.max(560, topPad + lines.length * lineHeight + Math.round(sigSize * 1.9) + bottomPad);
      if (cardH <= 1340) break;
      fontSize -= 2;
    }

    canvas.width = canvasW;
    canvas.height = cardH + outerPad * 2;

    ctx.fillStyle = darkMode ? "#2A1E15" : "#F5E6D0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = cardFillByTemplate[tpl.id] || cardFillByTemplate.classic;
    ctx.fillRect(cardX, cardY, cardW, cardH);

    const borderColor = tpl.id === "midnight" ? "rgba(100,120,200,0.5)" : "rgba(139,100,60,0.42)";
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(cardX + 1, cardY + 1, cardW - 2, cardH - 2);

    if (tpl.guide && !tpl.guide.includes("0,0,0,0")) {
      ctx.strokeStyle = tpl.guide;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cardX + marginLeft, cardY + 30);
      ctx.lineTo(cardX + marginLeft, cardY + cardH - 30);
      ctx.stroke();
    }

    if (tpl.rule && !tpl.rule.includes("0,0,0,0")) {
      ctx.strokeStyle = tpl.rule;
      ctx.lineWidth = 2;
      for (let y = cardY + 76; y < cardY + cardH - 80; y += 56) {
        ctx.beginPath();
        ctx.moveTo(cardX + 16, y);
        ctx.lineTo(cardX + cardW - 18, y);
        ctx.stroke();
      }
    }

    if (tpl.id === "coffee") {
      drawCoffeeStains(
        ctx,
        cardX,
        cardY,
        cardW,
        cardH,
        `${message.id || ""}|${message.message_text || ""}|${message.created_at || ""}`
      );
    }

    ctx.textAlign = "left";
    ctx.fillStyle = tpl.ink;
    const textX = cardX + marginLeft + 12;
    const textY = cardY + topPad;
    ctx.font = `italic ${fontSize}px ${bodyFontFamily}`;
    const lastY = drawLines(ctx, lines, textX, textY, lineHeight);

    ctx.font = `italic ${sigSize}px ${bodyFontFamily}`;
    ctx.fillStyle = tpl.sign;
    ctx.textAlign = "right";
    ctx.fillText(signature, cardX + cardW - marginRight - 12, Math.min(lastY + Math.round(sigSize * 1.3), cardY + cardH - 110));

    setPreviewSrc(canvas.toDataURL("image/png"));
  }, [darkMode, message, username]);

  const canvasToFile = async () =>
    new Promise((resolve, reject) => {
      canvasRef.current.toBlob((blob) => {
        if (!blob) {
          reject(new Error("image_generation_failed"));
          return;
        }
        resolve(new File([blob], `chirkut-letter-${username}.png`, { type: "image/png" }));
      }, "image/png");
    });

  const canNativeShareFile = async () => {
    try {
      if (!navigator.share || !navigator.canShare) return false;
      const file = await canvasToFile();
      return navigator.canShare({ files: [file] });
    } catch {
      return false;
    }
  };

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `chirkut-letter-${username}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const nativeShare = async () => {
    try {
      if (!navigator.share || !navigator.canShare) {
        return false;
      }
      const file = await canvasToFile();
      if (!navigator.canShare({ files: [file] })) {
        return false;
      }
      await navigator.share({
        files: [file],
        title: "Anonymous letter",
        text: "Share as your story",
      });
      setStatus("Shared successfully.");
      return true;
    } catch {
      return false;
    }
  };

  const fallbackDownload = (platform) => {
    download();
    setStatus(`Downloaded full-size PNG. Upload it to ${platform} Story from your gallery/photos.`);
  };

  const shareToInstagramStory = async () => {
    window.open("https://www.instagram.com/create/story/", "_blank", "noopener,noreferrer");
    const shared = await nativeShare();
    if (!shared) fallbackDownload("Instagram");
  };

  const shareToFacebookStory = async () => {
    window.open("https://www.facebook.com/stories/create/", "_blank", "noopener,noreferrer");
    const shared = await nativeShare();
    if (!shared) fallbackDownload("Facebook");
  };

  const shareViaDevice = async () => {
    const shared = await nativeShare();
    if (!shared) {
      const canShare = await canNativeShareFile();
      if (!canShare) {
        fallbackDownload("your app");
      } else {
        setStatus("Share canceled.");
      }
    }
  };

  const panelBg = darkMode ? "rgba(34,24,18,0.94)" : "rgba(255,251,245,0.96)";
  const panelBorder = darkMode ? "rgba(208,170,133,0.22)" : "rgba(194,153,116,0.42)";
  const titleColor = darkMode ? "#F2E3D3" : "#35261B";
  const subColor = darkMode ? "#C8A889" : "#7B5F48";
  const previewBg = darkMode ? "rgba(23,16,12,0.86)" : "rgba(245,233,217,0.78)";
  const previewBorder = darkMode ? "rgba(200,160,120,0.22)" : "rgba(194,153,116,0.35)";

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(16,10,6,0.62)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: panelBg,
          border: `1px solid ${panelBorder}`,
          borderRadius: 20,
          padding: 20,
          maxWidth: 430,
          width: "100%",
          boxShadow: "0 22px 40px rgba(24,14,8,0.35)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <h3 style={{ fontFamily: "\"IBM Plex Sans\", system-ui, sans-serif", color: titleColor, fontSize: 24, letterSpacing: "-0.02em", margin: 0 }}>
              Share Letter
            </h3>
            <p style={{ color: subColor, fontSize: 13, marginTop: 4 }}>Clean card preview for stories and download</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              border: "none",
              background: darkMode ? "rgba(232,204,175,0.14)" : "rgba(121,87,57,0.1)",
              color: subColor,
              width: 28,
              height: 28,
              borderRadius: 9,
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <div
          style={{
            background: previewBg,
            borderRadius: 14,
            padding: 10,
            marginBottom: 16,
            textAlign: "center",
            border: `1px solid ${previewBorder}`,
          }}
        >
          {previewSrc ? (
            <img src={previewSrc} alt="Letter card preview" style={{ width: "100%", borderRadius: 10, maxHeight: 300, objectFit: "cover" }} />
          ) : (
            <p style={{ color: C.muted }}>Generating...</p>
          )}
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <button className="paper-btn" onClick={shareToInstagramStory} style={{ width: "100%", borderRadius: 11 }}>Instagram Story</button>
          <button className="paper-btn" onClick={shareToFacebookStory} style={{ width: "100%", borderRadius: 11, background: darkMode ? "#7E5D45" : "#816049" }}>Facebook Story</button>
          <button className="ghost-btn" onClick={shareViaDevice} style={{ width: "100%", borderRadius: 11 }}>Share via device</button>
          <button className="ghost-btn" onClick={download} style={{ width: "100%", borderRadius: 11 }}>Download letter image</button>
        </div>
        {status && <p style={{ color: C.muted, fontSize: 12, marginTop: 12, textAlign: "center" }}>{status}</p>}
      </div>
    </div>
  );
}
