import { C } from "../../constants";
import { CoffeeStain, LandingScene } from "../../components/Decor";

export default function LandingPage({ setView, darkMode, unreadCount = 0, isLoggedIn = false }) {
  const openStoredMessages = () => setView("inbox");

  return (
    <div
      style={{
        height: "calc(100dvh - 54px)",
        minHeight: "calc(100dvh - 54px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px 14px",
        position: "relative",
        background: darkMode ? "#1C1208" : C.bg,
        overflow: "hidden",
      }}
    >
      <CoffeeStain
        style={{
          position: "absolute",
          top: 20,
          right: "-1%",
          width: 130,
          height: 130,
          animation: "stain 1.3s ease-out forwards",
        }}
      />

      <div style={{ maxWidth: 560, width: "100%", textAlign: "center", animation: "fadeIn .5s ease-out", zIndex: 2 }}>
        <div style={{ marginBottom: 6 }}>
          <span
            style={{
              fontSize: 12,
              color: C.secondary,
              letterSpacing: "1.8px",
              textTransform: "uppercase",
            }}
          >
            A quiet place for honest letters
          </span>
        </div>

        <div style={{ position: "relative", margin: "6px auto 8px", maxWidth: "min(82vw,300px)" }}>
          <LandingScene />
          {isLoggedIn && (
            <div
              style={{
                position: "absolute",
                left: "37.5%",
                top: "62.5%",
                width: "15.5%",
                height: "11.5%",
                pointerEvents: "none",
                transform: "translateY(-50%)",
                overflow: "visible",
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.25))",
              }}
            >
              <img
                src="/cat-playing-animation.gif"
                alt="Cat playing animation"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  imageRendering: "crisp-edges",
                  WebkitImageRendering: "-webkit-optimize-contrast",
                  backfaceVisibility: "hidden",
                  mixBlendMode: "normal",
                  filter: "contrast(1.08) saturate(1.06)",
                }}
              />
            </div>
          )}
          <button
            onClick={openStoredMessages}
            aria-label="Open stored messages"
            title="Open stored messages"
            style={{
              position: "absolute",
              left: "73%",
              top: "56%",
              width: "14%",
              height: "26%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          />
          {(unreadCount > 0 || !isLoggedIn) && (
            <span
              style={{
                position: "absolute",
                left: "84%",
                top: "57%",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#C62828",
                border: "1.5px solid #FBE9E7",
                animation: "notifyPulse 1.2s ease-in-out infinite",
                boxShadow: "0 0 0 2px rgba(198,40,40,0.18)",
                pointerEvents: "none",
              }}
            />
          )}
        </div>

        <p
          style={{
            fontSize: "clamp(13px,3.3vw,15px)",
            color: darkMode ? "#C4A882" : C.secondary,
            lineHeight: 1.45,
            marginBottom: 10,
            maxWidth: 430,
            marginInline: "auto",
          }}
        >
          Send a thoughtful anonymous note. Letters arrive sealed and open like small gifts.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center", width: "100%" }}>
          <button className="paper-btn" onClick={() => setView("inbox")} style={{ width: "100%", maxWidth: 240 }}>
            Open your postbox
          </button>
          <button className="ghost-btn" onClick={() => setView("send")} style={{ width: "100%", maxWidth: 240 }}>
            Send an anonymous letter
          </button>
        </div>
      </div>
    </div>
  );
}
