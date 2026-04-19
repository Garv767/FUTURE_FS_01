import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Particle from "../Particle";
import { supabase } from "../../utils/supabaseClient";

const CATEGORY_COLOR = {
  hackathon: "var(--cyber-green)",
  ctf:       "var(--cyber-blue)",
  leadership:"var(--cyber-yellow)",
};

const CATEGORY_LABEL = {
  hackathon:  "HACKATHON",
  ctf:        "CTF",
  leadership: "LEADERSHIP",
};

function MissionCard({ mission }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mission-card" style={{ borderLeftColor: CATEGORY_COLOR[mission.category] }}>
      {/* Header */}
      <div
        className="mission-card-header"
        onClick={() => setOpen((o) => !o)}
        style={{ cursor: "pointer" }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
            <span className="neon-badge" style={{
              borderLeftColor: CATEGORY_COLOR[mission.category],
              color: CATEGORY_COLOR[mission.category],
            }}>
              {CATEGORY_LABEL[mission.category]}
            </span>
            {mission.badge && (
              <span className="neon-badge" style={{
                background: "rgba(0,255,65,0.06)",
                color: "var(--cyber-green)",
                borderLeftColor: "var(--cyber-green)",
              }}>
                [{mission.badge}]
              </span>
            )}
            <span style={{ color: "var(--text-dim)", fontSize: "0.72rem", fontFamily: "var(--font-mono)" }}>
              {mission.date}
            </span>
          </div>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "1rem",
            color: "var(--text-primary)", fontWeight: 600,
          }}>
            {mission.title}
          </span>
          {mission.organization && (
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "0.75rem",
              color: "var(--text-muted)", marginLeft: 12,
            }}>
              @ {mission.organization}
            </span>
          )}
        </div>
        <span style={{
          color: "var(--cyber-green)", fontFamily: "var(--font-mono)",
          fontSize: "0.8rem", flexShrink: 0,
        }}>
          {open ? "[-]" : "[+]"}
        </span>
      </div>

      {/* Body — redacted until opened */}
      {open && (
        <div className="mission-card-body" style={{ animation: "fadeInUp 0.25s ease" }}>
          <p style={{ color: "var(--text-primary)", marginBottom: 12 }}>{mission.description}</p>
          {mission.highlights && mission.highlights.length > 0 && (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {mission.highlights.map((h, i) => (
                <li key={i} style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.82rem",
                  color: "var(--text-muted)", padding: "3px 0",
                }}>
                  <span style={{ color: CATEGORY_COLOR[mission.category], marginRight: 8 }}>&gt;</span>
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function MissionLog() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("mission_logs")
        .select("*")
        .eq("is_visible", true)
        .order("priority", { ascending: true });
      if (!error && data) setMissions(data);
      setLoading(false);
    };
    load();
  }, []);

  const categories = ["hackathon", "ctf", "leadership"];

  return (
    <Container fluid className="mission-section">
      <Particle />
      <Container>
        <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", marginBottom: 4 }}>
          &gt; sudo cat /var/classified/missions.db --decrypt
        </p>
        <h1 style={{ marginBottom: 8 }}>
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>// </span>
          <strong className="cyber-glow-static" style={{ fontSize: "2rem" }}>MISSION LOG</strong>
        </h1>
        <p style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", marginBottom: 36 }}>
          [CLEARANCE: TOP SECRET] — Classified achievements database. Click to decrypt.
        </p>

        {loading && (
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            [DB] DECRYPTING mission_logs.db<span className="cursor-blink" />
          </p>
        )}

        {categories.map((cat) => {
          const list = missions.filter((m) => m.category === cat);
          if (!list.length) return null;
          return (
            <div key={cat} style={{ marginBottom: 40 }}>
              <h3 style={{
                fontFamily: "var(--font-mono)", fontSize: "0.75rem",
                color: CATEGORY_COLOR[cat], textTransform: "uppercase",
                letterSpacing: "0.12em", marginBottom: 16,
                borderBottom: `1px solid ${CATEGORY_COLOR[cat]}22`,
                paddingBottom: 6,
              }}>
                &gt; {CATEGORY_LABEL[cat]} RECORDS ({list.length})
              </h3>
              {list.map((m) => <MissionCard key={m.id} mission={m} />)}
            </div>
          );
        })}
      </Container>
    </Container>
  );
}

export default MissionLog;
