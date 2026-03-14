import { C } from "../constants";

export function Badge({ count }) {
  if (count <= 0) return null;
  return (
    <span
      style={{
        background: C.seal,
        color: "#fff",
        borderRadius: "50%",
        width: 20,
        height: 20,
        fontSize: 11,
        fontWeight: 700,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "bounce 2s ease-in-out infinite",
      }}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

export function WaxSeal({ size = 36 }) {
  return (
    <svg viewBox="0 0 40 40" style={{ width: size, height: size }}>
      <circle cx="20" cy="20" r="18" fill={C.seal} opacity="0.9" />
      <circle cx="20" cy="20" r="14" fill="none" stroke="#FFD700" strokeWidth="0.8" opacity="0.5" />
      <text x="20" y="25" textAnchor="middle" fill="#FFD700" fontSize="14" fontFamily="serif">
        C
      </text>
    </svg>
  );
}

export function EnvelopeSVG({ isOpen = false, isUnread = false, small = false }) {
  const radius = small ? 10 : 12;
  const border = small ? 1.1 : 1.25;
  const sealSize = small ? 22 : 26;
  const paperTexture =
    "repeating-linear-gradient(35deg, rgba(90,70,50,0.03) 0 1px, rgba(0,0,0,0) 1px 4px), repeating-linear-gradient(0deg, rgba(120,96,70,0.02) 0 1px, rgba(0,0,0,0) 1px 3px), radial-gradient(circle at 20% 18%, rgba(120,90,60,0.05) 0 2px, rgba(0,0,0,0) 3px), radial-gradient(circle at 72% 68%, rgba(120,90,60,0.04) 0 1px, rgba(0,0,0,0) 3px)";
  const paperLighting =
    "radial-gradient(circle at 50% 12%, rgba(255,248,234,0.26) 0, rgba(255,248,234,0) 60%), radial-gradient(circle at 50% 86%, rgba(93,63,37,0.1) 0, rgba(93,63,37,0) 58%)";

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "160 / 105",
        position: "relative",
        filter: "drop-shadow(0 10px 16px rgba(70,46,28,0.22))",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          border: `${border}px solid #a9835f`,
          background: `linear-gradient(176deg, #dcc09a 0%, #cda47a 52%, #bf946a 100%), ${paperTexture}`,
          boxShadow: "inset 0 1px 0 rgba(255,251,240,0.48), inset 0 -8px 12px rgba(103,71,41,0.14)",
          overflow: "hidden",
          transform: "rotate(-0.22deg)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: paperLighting,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 5,
            right: 5,
            top: 5,
            bottom: 5,
            borderRadius: Math.max(2, radius - 2),
            border: "1px dashed rgba(139,99,65,0.34)",
            opacity: 0.65,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: "19%",
            width: "62%",
            top: isOpen ? "8%" : "15%",
            height: "54%",
            borderRadius: 4,
            background: "linear-gradient(180deg,#fffcf6 0%,#f1e5d3 100%)",
            border: "1px solid rgba(198,159,122,0.66)",
            boxShadow: "0 5px 10px rgba(73,46,25,0.17)",
            opacity: isOpen ? 1 : 0,
            zIndex: 3,
            transition: "top 0.3s ease, opacity 0.22s ease",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "58%",
            background: `linear-gradient(180deg, #d4b188 0%, #c9a176 100%), ${paperTexture}`,
            zIndex: 4,
            boxShadow: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "57%",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            background: `linear-gradient(180deg,#c49360 0%,#b68455 100%), ${paperTexture}`,
            borderBottom: "none",
            boxShadow: "inset 0 -9px 10px rgba(85,56,30,0.1), inset 0 1px 0 rgba(255,239,217,0.18)",
            zIndex: 6,
            transformOrigin: "50% 0%",
            transform: isOpen ? "translateY(-38%) scaleY(0.09)" : "translateY(0) scaleY(1)",
            opacity: isOpen ? 0.22 : 1,
            transition: "transform 0.3s ease, opacity 0.3s ease",
          }}
        />

        {!isOpen && (
          <svg
            viewBox="0 0 160 105"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, zIndex: 7, pointerEvents: "none", opacity: 0.58 }}
          >
            <line x1="0" y1="105" x2="80" y2="46" stroke="rgba(123,84,52,0.26)" strokeWidth="1" strokeLinecap="round" />
            <line x1="160" y1="105" x2="80" y2="46" stroke="rgba(123,84,52,0.26)" strokeWidth="1" strokeLinecap="round" />
            <line x1="0" y1="105" x2="80" y2="46" stroke="rgba(255,245,230,0.22)" strokeWidth="0.5" strokeLinecap="round" transform="translate(0,-0.4)" />
            <line x1="160" y1="105" x2="80" y2="46" stroke="rgba(255,245,230,0.22)" strokeWidth="0.5" strokeLinecap="round" transform="translate(0,-0.4)" />
          </svg>
        )}

        {!isOpen && isUnread && (
          <>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "44%",
                transform: "translate(-50%, -50%) translateY(2px)",
                width: sealSize * 1.18,
                height: sealSize * 0.48,
                borderRadius: "50%",
                background: "radial-gradient(ellipse at center, rgba(68,30,18,0.44) 0%, rgba(68,30,18,0) 74%)",
                zIndex: 7,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "44%",
                transform: "translate(-50%, -50%) rotate(-6deg)",
                width: sealSize * 1.06,
                height: sealSize,
                borderRadius: "55% 47% 54% 46% / 46% 55% 45% 54%",
                background:
                  "radial-gradient(circle at 34% 24%, rgba(255,205,170,0.58) 0%, rgba(255,205,170,0.2) 24%, rgba(0,0,0,0) 27%), radial-gradient(circle at 56% 58%, #a92419 0%, #8d1f14 52%, #6f160f 100%)",
                zIndex: 8,
                boxShadow: "0 2px 5px rgba(64,27,16,0.35), inset 0 -3px 4px rgba(49,15,9,0.28), inset 0 1px 2px rgba(255,191,155,0.24)",
                pointerEvents: "none",
                display: "grid",
                placeItems: "center",
              }}
            >
              <span
                style={{
                  width: "72%",
                  height: "72%",
                  borderRadius: "50%",
                  border: "1px solid rgba(118,18,12,0.34)",
                  display: "grid",
                  placeItems: "center",
                  boxShadow: "inset 0 1px 1px rgba(255,208,181,0.2)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width={small ? 8 : 9}
                  height={small ? 8 : 9}
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 3.6l2.1 4.2 4.6.7-3.3 3.2.8 4.5L12 14l-4.2 2.2.8-4.5-3.3-3.2 4.6-.7L12 3.6z"
                    fill="rgba(126,16,11,0.52)"
                    stroke="rgba(255,215,198,0.28)"
                    strokeWidth="0.6"
                  />
                </svg>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
