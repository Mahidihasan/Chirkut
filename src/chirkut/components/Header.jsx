import { C } from "../constants";
import { Badge } from "./EnvelopeBits";

export default function Header({
  setView,
  unreadCount,
  username,
  darkMode,
  onLogout,
}) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: darkMode ? "rgba(20,12,8,0.92)" : "rgba(247,243,238,0.9)",
        backdropFilter: "blur(6px)",
        borderBottom: darkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(96,74,56,0.12)",
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 54,
          padding: "0 14px",
        }}
      >
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 30,
            color: darkMode ? "#F6EBDD" : "#4A3526",
            fontWeight: 600,
            letterSpacing: "0.4px",
            lineHeight: 1,
            textShadow: "none",
          }}
        >
          Chirkut
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {username ? (
            <>
              <button
                onClick={() => setView("inbox")}
                style={{
                  background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(90,70,52,0.06)",
                  border: `1px solid ${darkMode ? "rgba(255,255,255,0.2)" : "rgba(90,70,52,0.22)"}`,
                  borderRadius: 999,
                  padding: "7px 14px",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  color: darkMode ? "#F2E7DA" : C.primary,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Inbox {unreadCount > 0 && <Badge count={unreadCount} />}
              </button>
              <button
                onClick={onLogout}
                style={{
                  background: "transparent",
                  border: `1px solid ${darkMode ? "rgba(255,255,255,0.18)" : "rgba(90,70,52,0.2)"}`,
                  borderRadius: 999,
                  padding: "7px 12px",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  color: darkMode ? "#EDE0D4" : C.primary,
                }}
              >
                Logout
              </button>
              <button
                onClick={() => setView("profile")}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "none",
                  background: darkMode ? "#C39A77" : C.primary,
                  color: C.paper,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                {username[0].toUpperCase()}
              </button>
            </>
          ) : (
            <>
              <button
                className="paper-btn"
                onClick={() => setView("login")}
                style={{ padding: "8px 16px", fontSize: 14 }}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
