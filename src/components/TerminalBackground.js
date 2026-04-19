import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// Per-route log pools — ~10 lines each, randomly sampled & streamed FIFO
const LOG_POOLS = {
  "/": [
    "[SYS] Kernel boot sequence complete.",
    "[SYS] Welcome, operator. Authenticating session...",
    "[AUTH] Token verified. Access level: OPERATOR",
    "[NET] Interface eth0 UP — 1Gbps full-duplex",
    "[SYS] Loading portfolio modules... done.",
    "[DB] Supabase connection established. Ping: 12ms",
    "[OK] All systems nominal. Standing by.",
    "[SYS] Memory usage: 2.1GB / 16GB",
    "[NET] Firewall rules loaded. 1,337 rules active.",
    "[SYS] Monitoring active. No threats detected.",
  ],
  "/about": [
    "[SYS] Loading operator profile: garv767",
    "[DB] SELECT * FROM profiles WHERE id='garv767'",
    "[AUTH] Clearance: LEVEL-3 GRANTED",
    "[INFO] Parsing skill modules... 24 technologies indexed.",
    "[OK] Profile loaded. Rendering interface.",
    "[SYS] Location: Indore, India (IST UTC+5:30)",
    "[INFO] Institution: SRM IST, KTR — B.Tech CSE",
    "[NET] GitHub API connected. Last push: recent.",
    "[DB] Contribution graph fetched. 365 days indexed.",
    "[OK] About module ready.",
  ],
  "/project": [
    "[SYS] Initializing GitHub API client...",
    "[NET] GET /users/garv767/repos?per_page=100 HTTP/1.1",
    "[NET] Host: api.github.com",
    "[NET] Authorization: Bearer ****",
    "[200] OK — repositories indexed.",
    "[DB] Merging with portfolio_projects table...",
    "[INFO] Priority sort applied. Rendering cards.",
    "[OK] Repository scan complete.",
    "[SYS] Filtering by topic:portfolio and is_visible=true",
    "[INFO] Projects module ready.",
  ],
  "/missions": [
    "[SYS] Accessing classified intelligence database...",
    "[AUTH] CLEARANCE: TOP SECRET — VERIFIED",
    "[DB] DECRYPTING /var/classified/missions.db...",
    "[INFO] Record 001: Hack & Hit — FINALIST",
    "[INFO] Record 002: POKEVERSE Ideathon — LEADERSHIP",
    "[INFO] CTF participation logs loaded.",
    "[WARN] Some records remain CLASSIFIED.",
    "[SYS] Rendering mission log interface.",
    "[OK] Decryption complete. Handle with care.",
    "[AUTH] Session logged. Timestamp: " + new Date().toISOString(),
  ],
  "/resume": [
    "[SYS] Compiling resume artifact...",
    "[ATS] Loading job_description buffer...",
    "[ATS] Tokenizing keywords... done.",
    "[ML] Scoring projects by relevance...",
    "[DB] Fetching portfolio_projects from Supabase...",
    "[ATS] Matching top 3 projects to JD keywords.",
    "[OK] ATS optimization ready.",
    "[INFO] PDF renderer: @react-pdf/renderer v2",
    "[SYS] Resume template loaded from ats_config.",
    "[OK] ATS module standing by. Paste JD to begin.",
  ],
  "/login": [
    "[AUTH] Login interface initialized.",
    "[SYS] Supabase Auth endpoint: ready.",
    "[WARN] Unauthorized access attempts are logged.",
    "[NET] TLS 1.3 handshake complete.",
    "[SYS] Session cookie: HTTPONLY SECURE",
    "[AUTH] Awaiting credentials...",
  ],
  "/admin": [
    "[SYS] Admin panel loaded.",
    "[AUTH] ROLE: ADMINISTRATOR — access granted.",
    "[DB] portfolio_projects fetched. Drag to reorder.",
    "[DB] ats_config loaded. Templates ready.",
    "[DB] mission_logs loaded.",
    "[SYS] All admin modules operational.",
    "[WARN] Changes auto-save on confirmation.",
  ],
};

const DEFAULT_LOGS = LOG_POOLS["/"];
const MAX_LINES = 28;
const INTERVAL_MS = 900;

export default function TerminalBackground() {
  const location = useLocation();
  const [lines, setLines] = useState([]);
  const poolRef  = useRef([]);
  const timerRef = useRef(null);
  const indexRef = useRef(0);

  const getPool = (path) => {
    const key = Object.keys(LOG_POOLS).find((k) => k !== "/" && path.startsWith(k)) ||
                (path === "/" ? "/" : null);
    return LOG_POOLS[key] || DEFAULT_LOGS;
  };

  useEffect(() => {
    const pool = getPool(location.pathname);
    // Transition lines then new pool
    const transition = [
      `[SYS] Routing to ${location.pathname}...`,
      "[NET] Handshake complete.",
    ];
    poolRef.current = [...transition, ...pool];
    indexRef.current = 0;

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const pool = poolRef.current;
      if (pool.length === 0) return;
      const line = pool[indexRef.current % pool.length];
      indexRef.current++;
      setLines((prev) => {
        const next = [...prev, line];
        return next.length > MAX_LINES ? next.slice(next.length - MAX_LINES) : next;
      });
    }, INTERVAL_MS);

    return () => clearInterval(timerRef.current);
  }, [location.pathname]);

  const colourLine = (line) => {
    if (line.startsWith("[OK]"))    return "var(--cyber-green)";
    if (line.startsWith("[AUTH]"))  return "var(--cyber-blue)";
    if (line.startsWith("[ERR]") || line.startsWith("[WARN]")) return "var(--cyber-red)";
    if (line.startsWith("[ATS]") || line.startsWith("[ML]"))   return "var(--cyber-yellow)";
    if (line.startsWith("[DB]"))    return "#a78bfa";
    if (line.startsWith("[NET]"))   return "var(--cyber-blue)";
    if (line.startsWith("[200]"))   return "var(--cyber-green)";
    return "var(--text-muted)";
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0,
      pointerEvents: "none", overflow: "hidden",
      padding: "100px 40px 40px",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "0.7rem", lineHeight: 1.9,
      opacity: 0.07,
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
    }}>
      {lines.map((line, i) => (
        <div key={i} style={{
          color: colourLine(line),
          animation: "fadeInUp 0.3s ease both",
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
        }}>
          {line}
        </div>
      ))}
    </div>
  );
}
