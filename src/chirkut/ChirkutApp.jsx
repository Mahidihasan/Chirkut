import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { C } from "./constants";
import { auth, db, firebaseReady } from "./firebase";
import GlobalStyles from "./components/GlobalStyles";
import { FloatingParticles, PaperTexture } from "./components/Decor";
import Header from "./components/Header";
import LandingPage from "./features/landing/LandingPage";
import AuthPage from "./features/auth/AuthPage";
import SendPage from "./features/send/SendPage";
import InboxPage from "./features/inbox/InboxPage";
import ProfilePage from "./features/profile/ProfilePage";

const VALID_VIEWS = new Set(["home", "login", "signup", "send", "inbox", "profile"]);

function parseRouteState() {
  const params = new URLSearchParams(window.location.search);
  const to = (params.get("to") || "").trim().toLowerCase();
  const viewParam = (params.get("view") || "").trim().toLowerCase();

  if (to) {
    return { view: "send", recipient: to };
  }

  if (VALID_VIEWS.has(viewParam)) {
    return { view: viewParam, recipient: "" };
  }

  return { view: "home", recipient: "" };
}

function buildRouteUrl(view, recipient = "") {
  const params = new URLSearchParams();
  if (view !== "home") params.set("view", view);
  if (view === "send" && recipient) params.set("to", recipient);
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export default function ChirkutApp() {
  const [initialRoute] = useState(() => parseRouteState());
  const [view, setView] = useState(initialRoute.view);
  const [username, setUsername] = useState(null);
  const [messages, setMessages] = useState([]);
  const darkMode = false;
  const [sendRecipient, setSendRecipient] = useState(initialRoute.recipient);

  const normalizedUsername = username ? username.trim().toLowerCase() : null;
  const visibleMessages = normalizedUsername ? messages : [];

  const unreadCount = visibleMessages.filter((m) => !m.is_read).length;

  const navigate = (nextView, options = {}) => {
    const normalizedView = VALID_VIEWS.has(nextView) ? nextView : "home";
    const nextRecipient = normalizedView === "send"
      ? (options.recipient || "").trim().toLowerCase()
      : "";

    setSendRecipient(nextRecipient);
    setView(normalizedView);

    const state = { view: normalizedView, recipient: nextRecipient };
    const url = buildRouteUrl(normalizedView, nextRecipient);
    if (options.replace) {
      window.history.replaceState(state, "", url);
    } else {
      window.history.pushState(state, "", url);
    }
  };

  useEffect(() => {
    window.history.replaceState(
      { view: initialRoute.view, recipient: initialRoute.recipient },
      "",
      buildRouteUrl(initialRoute.view, initialRoute.recipient)
    );

    const onPopState = (event) => {
      const fallback = parseRouteState();
      const state = event.state && VALID_VIEWS.has(event.state.view)
        ? {
          view: event.state.view,
          recipient: (event.state.recipient || "").trim().toLowerCase(),
        }
        : fallback;

      setView(state.view);
      setSendRecipient(state.recipient || "");
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [initialRoute]);

  useEffect(() => {
    if (!firebaseReady || !auth) {
      return;
    }
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (!fbUser) {
        setUsername(null);
        return;
      }
      const lastLoginAt = Number(localStorage.getItem("chirkutLastLoginAt") || "0");
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      if (lastLoginAt && Date.now() - lastLoginAt > sevenDaysMs) {
        signOut(auth);
        localStorage.removeItem("chirkutLastLoginAt");
        setUsername(null);
        return;
      }
      if (!lastLoginAt) {
        localStorage.setItem("chirkutLastLoginAt", String(Date.now()));
      }
      const resolved = fbUser.displayName || fbUser.email?.split("@")[0] || "";
      setUsername(resolved ? resolved.trim().toLowerCase() : null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!firebaseReady || !db || !normalizedUsername) {
      return;
    }
    const q = query(collection(db, "messages"), orderBy("created_at", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const next = snap.docs.map((docSnap) => {
        const data = docSnap.data();
        const created = data.created_at?.toDate
          ? data.created_at.toDate().toISOString()
          : data.created_at || new Date().toISOString();
        return { id: docSnap.id, ...data, created_at: created };
      }).filter((m) => {
        const recipient = (
          m.toUsername
          || m.tousername
          || m.toUserName
          || m.tolsername
          || ""
        ).toString().trim().toLowerCase();
        return recipient === normalizedUsername;
      });
      setMessages(next);
    });
    return () => unsub();
  }, [normalizedUsername]);

  const handleLogout = async () => {
    if (!auth) {
      navigate("home", { replace: true });
      return;
    }
    await signOut(auth);
    localStorage.removeItem("chirkutLastLoginAt");
    navigate("home", { replace: true });
  };

  const appStyle = {
    minHeight: view === "home" ? "100dvh" : "100vh",
    height: view === "home" ? "100dvh" : "auto",
    background: darkMode ? "#1C1208" : C.bg,
    color: darkMode ? "#EDE0D4" : C.accent,
    transition: "background 0.3s, color 0.3s",
    position: "relative",
    overflowX: "hidden",
    overflowY: view === "home" ? "hidden" : "auto",
  };

  return (
    <div style={appStyle} className={view === "home" ? "home-lock" : ""}>
      <GlobalStyles />
      <PaperTexture />
      <FloatingParticles />

      <div style={{ position: "relative", zIndex: 2 }}>
        <Header
          setView={navigate}
          unreadCount={unreadCount}
          username={username}
          darkMode={darkMode}
          onLogout={handleLogout}
        />

        {!firebaseReady && (
          <div style={{ maxWidth: 980, margin: "10px auto 0", padding: "0 14px" }}>
            <div style={{
              borderRadius: 10,
              border: darkMode ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(107,79,59,0.25)",
              background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,251,243,0.9)",
              color: darkMode ? "#EDE0D4" : C.accent,
              padding: "10px 12px",
              fontSize: 13,
            }}>
              Firebase is not configured. Add values to <strong>.env</strong> using <strong>.env.example</strong>, then restart <strong>npm run dev</strong>.
            </div>
          </div>
        )}

        {view === "home" && (
          <LandingPage
            setView={navigate}
            darkMode={darkMode}
            unreadCount={unreadCount}
            isLoggedIn={Boolean(username)}
          />
        )}
        {view === "login" && <AuthPage setView={navigate} setUsername={setUsername} isLogin darkMode={darkMode} />}
        {view === "signup" && <AuthPage setView={navigate} setUsername={setUsername} isLogin={false} darkMode={darkMode} />}
        {view === "send" && <SendPage currentUsername={username} presetRecipient={sendRecipient} darkMode={darkMode} />}
        {view === "inbox" && username && <InboxPage username={username} messages={visibleMessages} darkMode={darkMode} />}
        {view === "profile" && username && (
          <ProfilePage
            username={username}
            setView={navigate}
            darkMode={darkMode}
            portalUrl={`${window.location.origin}?to=${encodeURIComponent(username)}`}
          />
        )}

        {(view === "inbox" || view === "profile") && !username && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontSize: 18, color: C.secondary, marginBottom: 18 }}>Please sign in to see your postbox</p>
            <button className="paper-btn" onClick={() => navigate("login")}>Sign in</button>
          </div>
        )}

        {view !== "home" && (
          <footer style={{ borderTop: `1px solid ${C.kraft}`, padding: "20px 16px", textAlign: "center", marginTop: 40 }}>
            <p style={{ fontSize: 13, color: C.muted }}>Chirkut • letters that warm the heart</p>
            <p style={{ fontSize: 12, marginTop: 8 }}>
              <a href="/privacy.html" target="_blank" rel="noreferrer" style={{ color: darkMode ? "#C4A882" : C.primary, textDecoration: "underline" }}>Privacy</a>
              {" · "}
              <a href="/terms.html" target="_blank" rel="noreferrer" style={{ color: darkMode ? "#C4A882" : C.primary, textDecoration: "underline" }}>Terms</a>
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
