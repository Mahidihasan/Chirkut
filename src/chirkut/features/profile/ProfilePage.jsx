import { useState } from "react";
import { C } from "../../constants";

export default function ProfilePage({ username, setView, darkMode, portalUrl }) {
  const [copied, setCopied] = useState(false);

  const copyPortalUrl = async () => {
    try {
      await navigator.clipboard?.writeText(portalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px", background: darkMode ? "#1C1208" : C.bg }}>
      <div style={{ background: darkMode ? "#2C1F15" : C.paper, border: `1.5px solid ${C.kraft}`, borderRadius: 12, padding: "28px 22px", maxWidth: 400, width: "100%", textAlign: "center" }}>
        <div style={{ width: 70, height: 70, borderRadius: "50%", background: C.primary, color: C.paper, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          {username[0].toUpperCase()}
        </div>
        <h2 style={{ fontFamily: "'Fraunces', serif", color: darkMode ? "#EDE0D4" : C.accent, fontSize: 30, marginBottom: 4 }}>@{username}</h2>
        <p style={{ color: C.secondary, fontSize: 14, marginBottom: 18 }}>My cozy corner on Chirkut</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button className="paper-btn" onClick={copyPortalUrl}>{copied ? "Portal link copied" : "Copy my public portal"}</button>
          <button className="ghost-btn" onClick={() => setView("inbox")}>Go to inbox</button>
        </div>
      </div>
    </div>
  );
}
