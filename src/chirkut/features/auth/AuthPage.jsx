import { useState } from "react";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, doc, getDocs, limit, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { C } from "../../constants";
import { auth, db, ensureAuthPersistence } from "../../firebase";
import { CoffeeStain } from "../../components/Decor";

export default function AuthPage({ setView, setUsername, isLogin, darkMode }) {
  const [form, setForm] = useState({ email: "", username: "", password: "", confirmPassword: "" });
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);

  const normalizeUsername = (value) => value.trim().toLowerCase();
  const sanitizeUsername = (value) => normalizeUsername(value).replace(/[^a-z0-9._-]/g, "");

  const suggestUsernames = async (base) => {
    const stemBase = sanitizeUsername(base).slice(0, 16) || "user";
    const candidates = new Set();
    for (let i = 0; i < 8 && candidates.size < 6; i += 1) {
      const n1 = Math.floor(100 + Math.random() * 900);
      const n2 = Math.floor(10 + Math.random() * 90);
      const n3 = Math.floor(1000 + Math.random() * 9000);
      [String(n1), `_${n2}`, String(n3)].forEach((suffix) => {
        const next = `${stemBase}${suffix}`.slice(0, 20);
        if (next.length >= 3) candidates.add(next);
      });
    }

    const list = Array.from(candidates);
    if (!list.length) return [];
    try {
      const snap = await getDocs(query(collection(db, "users"), where("username", "in", list), limit(10)));
      const taken = new Set(snap.docs.map((d) => d.data().username));
      return list.filter((name) => !taken.has(name)).slice(0, 3);
    } catch {
      return [];
    }
  };

  const handle = async () => {
    const email = form.email.trim().toLowerCase();
    const username = normalizeUsername(form.username);
    if (!email || !form.password) return setErr("Please fill in all fields");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Enter a valid email address");
    if (!isLogin && !username) return setErr("Please choose a username");
    if (!isLogin && !form.confirmPassword) return setErr("Please confirm your password");
    if (!isLogin && username.includes(" ")) return setErr("Username cannot contain spaces");
    if (!isLogin && !/^[a-z0-9._-]{3,20}$/.test(username)) {
      return setErr("Use 3-20 chars: letters, numbers, dot, dash, underscore");
    }
    if (!isLogin && form.password !== form.confirmPassword) {
      return setErr("Passwords do not match");
    }

    setErr("");
    setInfo("");
    setLoading(true);
    try {
      await ensureAuthPersistence();
      let resolvedUsername = username;
      if (isLogin) {
        const credential = await signInWithEmailAndPassword(auth, email, form.password);
        if (!credential.user.displayName) {
          resolvedUsername = email.split("@")[0];
          await updateProfile(credential.user, { displayName: resolvedUsername });
        } else {
          resolvedUsername = credential.user.displayName;
        }
      } else {
        const existing = await getDocs(
          query(collection(db, "users"), where("username", "==", username), limit(1))
        );
        const takenByOther = existing.docs.length > 0;
        if (takenByOther) {
          const suggestions = await suggestUsernames(username);
          setUsernameSuggestions(suggestions);
          setErr("That username is already taken");
          return;
        }

        const credential = await createUserWithEmailAndPassword(auth, email, form.password);
        await updateProfile(credential.user, { displayName: username });
        await setDoc(doc(db, "users", credential.user.uid), {
          username,
          created_at: serverTimestamp(),
        });
        resolvedUsername = username;
      }
      localStorage.setItem("chirkutLastLoginAt", String(Date.now()));
      setUsername(resolvedUsername);
      setView("home");
    } catch (error) {
      const code = error?.code || "";
      if (code.includes("auth/invalid-credential") || code.includes("auth/wrong-password")) {
        setErr("Incorrect email or password");
      } else if (code.includes("auth/user-not-found")) {
        setErr("No account found for that email");
      } else if (code.includes("auth/email-already-in-use")) {
        setErr("That email is already registered");
      } else if (code.includes("auth/operation-not-allowed")) {
        setErr("Email/password sign-in is disabled in Firebase Auth");
      } else if (code.includes("auth/weak-password")) {
        setErr("Password must be at least 6 characters");
      } else if (code.includes("permission-denied")) {
        setErr("Firestore permission denied. Check your Firestore rules");
      } else {
        setErr("Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const email = form.email.trim().toLowerCase();
    if (!email) {
      setErr("Enter your email to reset your password");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErr("Enter a valid email address");
      return;
    }
    if (!auth) {
      setErr("Auth is not configured");
      return;
    }
    setErr("");
    setInfo("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setInfo("Password reset link sent. Check your inbox.");
    } catch (error) {
      const code = error?.code || "";
      if (code.includes("auth/user-not-found")) {
        setErr("No account found for that email");
      } else if (code.includes("auth/too-many-requests")) {
        setErr("Too many attempts. Try again later.");
      } else {
        setErr("Could not send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 14px",
        background: darkMode ? "#1C1208" : C.bg,
      }}
    >
      <div
        style={{
          background: darkMode ? "#2C1F15" : C.paper,
          border: `1.5px solid ${C.kraft}`,
          borderRadius: 12,
          padding: "26px 22px 22px",
          width: "100%",
          maxWidth: 430,
          position: "relative",
          animation: "reveal .45s ease-out",
          overflow: "hidden",
          boxShadow: darkMode ? "0 16px 34px rgba(0,0,0,0.35)" : "0 12px 30px rgba(107,79,59,0.14)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: darkMode
              ? "radial-gradient(circle at 8% 8%, rgba(228,190,146,0.12) 0%, rgba(0,0,0,0) 36%)"
              : "radial-gradient(circle at 12% 6%, rgba(214,185,144,0.2) 0%, rgba(0,0,0,0) 40%)",
          }}
        />
        <CoffeeStain style={{ position: "absolute", top: -18, right: -18, width: 74, animation: "stain 1s ease-out forwards" }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", marginBottom: 18 }}>
          <span
            style={{
              display: "inline-block",
              marginBottom: 8,
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: darkMode ? "#E7C79D" : "#7C5A3D",
              border: `1px solid ${darkMode ? "rgba(231,199,157,0.35)" : "rgba(124,90,61,0.22)"}`,
              background: darkMode ? "rgba(231,199,157,0.08)" : "rgba(124,90,61,0.08)",
            }}
          >
            {isLogin ? "Postbox Access" : "Create Postbox"}
          </span>
          <h2 style={{ fontFamily: "'Fraunces', serif", color: darkMode ? "#EDE0D4" : C.accent, fontSize: "clamp(28px, 6vw, 34px)", marginBottom: 4 }}>
            {isLogin ? "Welcome back" : "Create your postbox"}
          </h2>
          <p style={{ color: darkMode ? "#BFA58D" : C.secondary, fontSize: 14 }}>
            {isLogin ? "Open your inbox" : "Start receiving anonymous letters"}
          </p>
        </div>

        {!isLogin && (
          <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {["Anonymous letters", "Warm paper theme", "Private inbox"].map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  borderRadius: 999,
                  padding: "5px 10px",
                  color: darkMode ? "#E6D4C0" : "#6D5140",
                  border: `1px solid ${darkMode ? "rgba(255,255,255,0.14)" : "rgba(109,81,64,0.2)"}`,
                  background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,251,244,0.7)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            className="input-field"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => {
              setForm((f) => ({ ...f, email: e.target.value }));
              setErr("");
              setInfo("");
            }}
            style={{ background: darkMode ? "#1C1208" : C.paper, color: darkMode ? "#EDE0D4" : C.accent }}
          />

          {!isLogin && (
            <input
              className="input-field"
              placeholder="Username"
              value={form.username}
              onChange={(e) => {
                setForm((f) => ({ ...f, username: e.target.value }));
                setUsernameSuggestions([]);
                setErr("");
                setInfo("");
              }}
              style={{ background: darkMode ? "#1C1208" : C.paper, color: darkMode ? "#EDE0D4" : C.accent }}
            />
          )}

          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            style={{ background: darkMode ? "#1C1208" : C.paper, color: darkMode ? "#EDE0D4" : C.accent }}
          />

          {!isLogin && (
            <input
              className="input-field"
              type="password"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={(e) => {
                setForm((f) => ({ ...f, confirmPassword: e.target.value }));
                setErr("");
                setInfo("");
              }}
              style={{ background: darkMode ? "#1C1208" : C.paper, color: darkMode ? "#EDE0D4" : C.accent }}
            />
          )}

          {!isLogin && usernameSuggestions.length > 0 && (
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {usernameSuggestions.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, username: name }));
                    setUsernameSuggestions([]);
                    setErr("");
                    setInfo("");
                  }}
                  style={{
                    borderRadius: 999,
                    padding: "6px 10px",
                    border: `1px solid ${darkMode ? "rgba(255,255,255,0.16)" : "rgba(107,79,59,0.2)"}`,
                    background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(255,251,244,0.7)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    color: darkMode ? "#EDE0D4" : C.primary,
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          {err && <p style={{ color: C.seal, fontSize: 14, textAlign: "center" }}>{err}</p>}
          {info && <p style={{ color: darkMode ? "#E7C79D" : C.primary, fontSize: 14, textAlign: "center" }}>{info}</p>}

          <button className="paper-btn" onClick={handle} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? (isLogin ? "Signing in..." : "Creating postbox...") : isLogin ? "Open my postbox" : "Create postbox"}
          </button>

          {isLogin && (
            <button
              type="button"
              onClick={handleResetPassword}
              style={{ background: "none", border: "none", color: C.primary, cursor: "pointer", textDecoration: "underline" }}
            >
              Forgot password?
            </button>
          )}

          <p style={{ textAlign: "center", fontSize: 14, color: C.muted }}>
            {isLogin ? "New here? " : "Already have one? "}
            <button onClick={() => setView(isLogin ? "signup" : "login")} style={{ background: "none", border: "none", color: C.primary, cursor: "pointer", textDecoration: "underline" }}>
              {isLogin ? "Create a postbox" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
