import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { C } from "../../constants";
import { db } from "../../firebase";
import { EnvelopeSVG } from "../../components/EnvelopeBits";
import EnvelopeModal from "./EnvelopeModal";
import ShareModal from "./ShareModal";

const pill = (active, dark) => ({
  padding: "7px 18px",
  borderRadius: 99,
  fontSize: 13,
  fontWeight: 600,
  fontFamily: "\"IBM Plex Sans\", system-ui, sans-serif",
  cursor: "pointer",
  border: "none",
  transition: "all .18s ease",
  background: active
    ? dark ? "#6B4F3B" : C.primary
    : dark ? "rgba(255,255,255,0.06)" : "rgba(107,79,59,0.08)",
  color: active
    ? "#FFF8F0"
    : dark ? "#C4A882" : C.secondary,
  letterSpacing: "0.01em",
});

export default function InboxPage({ username, messages, darkMode }) {
  const [openMsg, setOpenMsg] = useState(null);
  const [shareMsg, setShareMsg] = useState(null);
  const [filter, setFilter] = useState("all");

  const handleOpen = (msg) => {
    setOpenMsg(msg);
    if (!msg.is_read) {
      updateDoc(doc(db, "messages", msg.id), { is_read: true });
    }
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;
  const filtered = filter === "unread" ? messages.filter((m) => !m.is_read) : messages;

  const bg = darkMode ? "#1C1208" : C.bg;
  const headingColor = darkMode ? "#EDE0D4" : C.accent;
  const subColor = darkMode ? "#8A7060" : C.muted;
  const metaColor = darkMode ? "#8A7060" : C.muted;
  const sigColor = darkMode ? "#C4A882" : C.secondary;

  return (
    <div style={{ minHeight: "80vh", padding: "40px 20px 60px", background: bg }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            color: headingColor,
            fontSize: "clamp(26px, 5vw, 36px)",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            marginBottom: 6,
          }}>
            Your Postbox
          </h2>
          <p style={{ color: subColor, fontSize: 14, fontFamily: "\"IBM Plex Sans\", system-ui, sans-serif" }}>
            {unreadCount > 0 ? `${unreadCount} new letter${unreadCount > 1 ? "s" : ""} waiting` : "All caught up"}
          </p>
        </div>

        {/* ── Filter pills ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {["all", "unread"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={pill(filter === f, darkMode)}
            >
              {f === "all" ? "All" : `Unread${unreadCount > 0 ? ` · ${unreadCount}` : ""}`}
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <p style={{ textAlign: "center", color: subColor, padding: "60px 0", fontFamily: "\"IBM Plex Sans\", system-ui, sans-serif", fontSize: 14 }}>
            No letters here yet.
          </p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "28px 24px",
          }}>
            {filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleOpen(msg)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  transition: "transform .2s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                {/* status dot */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {!msg.is_read && (
                    <span style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: C.seal, flexShrink: 0,
                      boxShadow: `0 0 0 2px ${darkMode ? "#1C1208" : C.bg}`,
                    }} />
                  )}
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: msg.is_read ? metaColor : C.seal,
                    fontFamily: "\"IBM Plex Sans\", system-ui, sans-serif",
                  }}>
                    {msg.is_read ? "Read" : "New"}
                  </span>
                </div>

                {/* envelope */}
                <div style={{ width: "100%" }}>
                  <EnvelopeSVG isOpen={false} isUnread={!msg.is_read} small />
                </div>

                {/* meta */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  fontFamily: "\"IBM Plex Sans\", system-ui, sans-serif",
                }}>
                  <span style={{ fontSize: 12, color: metaColor }}>
                    {new Date(msg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <span style={{ fontSize: 12, fontStyle: "italic", color: sigColor, maxWidth: "60%", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {msg.optional_signature || "~ anonymous"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {openMsg && <EnvelopeModal message={openMsg} onClose={() => setOpenMsg(null)} onShare={setShareMsg} darkMode={darkMode} />}
      {shareMsg && <ShareModal username={username} message={shareMsg} onClose={() => setShareMsg(null)} darkMode={darkMode} />}
    </div>
  );
}
