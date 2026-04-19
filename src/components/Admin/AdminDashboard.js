import React, { useState, useEffect } from "react";
import { Container, Collapse } from "react-bootstrap"; // eslint-disable-line
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { supabase } from "../../utils/supabaseClient";
import axios from "axios";
import Particle from "../Particle";
import { CgWebsite } from "react-icons/cg";
import {
  AiOutlineEye, AiOutlineEyeInvisible, AiOutlineSave,
  AiOutlineCheck, AiOutlineDown, AiOutlineRight,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const GITHUB_USERNAME = "garv767";
const ADMIN_TABS = { PROJECTS: "PROJECTS", ATS: "ATS CONFIG", MISSIONS: "MISSIONS" };

// ── 3x2 drag handle ──
const DragHandleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style={{ opacity: 0.5 }}>
    <circle cx="5" cy="4" r="1.5" /><circle cx="11" cy="4" r="1.5" />
    <circle cx="5" cy="8" r="1.5" /><circle cx="11" cy="8" r="1.5" />
    <circle cx="5" cy="12" r="1.5" /><circle cx="11" cy="12" r="1.5" />
  </svg>
);

// ─────────────────────────────────────────────
// PROJECTS TAB — all original logic preserved
// ─────────────────────────────────────────────
function ProjectsTab() {
  const [repos, setRepos]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [expandedRepos, setExpandedRepos] = useState({});
  const [dirtyState, setDirtyState]     = useState({});
  const [saveStatus, setSaveStatus]     = useState({});

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const ghRes = await axios.get(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`
      );
      const ghRepos = ghRes.data;
      const { data: dbData, error } = await supabase
        .from("portfolio_projects").select("*").order("priority", { ascending: true });
      if (error) throw error;

      const configMap = new Map();
      dbData.forEach((d) => configMap.set(d.repo_name, d));

      const merged = ghRepos.map((repo) => {
        const config = configMap.get(repo.name);
        const gh_homepage = repo.homepage || "";
        const demo_url = config?.demo_url || gh_homepage;
        return {
          repo_name: repo.name,
          display_title: config?.display_title || repo.name,
          custom_description: config?.custom_description || repo.description || "",
          custom_image_url: config?.custom_image_url || "",
          demo_url, demo_url_override: config?.demo_url || "", gh_homepage,
          is_visible: config?.is_visible ?? false,
          priority: config?.priority ?? 999,
          is_fork: repo.fork,
          language: repo.language,
        };
      }).sort((a, b) => {
        if (a.is_visible !== b.is_visible) return a.is_visible ? -1 : 1;
        return a.priority - b.priority;
      });

      setRepos(merged); setDirtyState({}); setSaveStatus({});
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const toggleExpand    = (n) => setExpandedRepos((p) => ({ ...p, [n]: !p[n] }));
  const handleFieldChange = (repoName, field, value) => {
    setRepos((p) => p.map((r) => r.repo_name === repoName ? { ...r, [field]: value } : r));
    setDirtyState((p) => ({ ...p, [repoName]: { ...(p[repoName] || {}), [field]: value } }));
    setSaveStatus((p) => ({ ...p, [repoName]: "idle" }));
  };
  const handleResetDemoUrl = (repoName) => {
    setRepos((p) => p.map((r) => r.repo_name === repoName ? { ...r, demo_url: r.gh_homepage, demo_url_override: "" } : r));
    setDirtyState((p) => ({ ...p, [repoName]: { ...(p[repoName] || {}), demo_url_override: "__cleared__" } }));
    setSaveStatus((p) => ({ ...p, [repoName]: "idle" }));
  };
  const handleToggleVisibility = (repoName, cur) => {
    const v = !cur;
    setRepos((p) => p.map((r) => r.repo_name === repoName ? { ...r, is_visible: v } : r));
    setDirtyState((p) => ({ ...p, [repoName]: { ...(p[repoName] || {}), is_visible: v } }));
    setSaveStatus((p) => ({ ...p, [repoName]: "idle" }));
  };
  const handleSave = async (repoName) => {
    setSaveStatus((p) => ({ ...p, [repoName]: "saving" }));
    const repo = repos.find((r) => r.repo_name === repoName);
    const demoToSave = repo.demo_url_override === "" || repo.demo_url === repo.gh_homepage
      ? null : repo.demo_url_override || repo.demo_url;
    const { error } = await supabase.from("portfolio_projects").upsert(
      { repo_name: repoName, display_title: repo.display_title, custom_description: repo.custom_description,
        custom_image_url: repo.custom_image_url, demo_url: demoToSave, is_visible: repo.is_visible, priority: repo.priority },
      { onConflict: "repo_name" }
    );
    if (error) { console.error(error); setSaveStatus((p) => ({ ...p, [repoName]: "idle" })); }
    else {
      setSaveStatus((p) => ({ ...p, [repoName]: "saved" }));
      setDirtyState((p) => { const n = { ...p }; delete n[repoName]; return n; });
      setTimeout(() => setSaveStatus((p) => ({ ...p, [repoName]: "idle" })), 2000);
    }
  };
  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(repos);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    const updated = items.map((item, i) => ({ ...item, priority: i }));
    setRepos(updated);
    await supabase.from("portfolio_projects").upsert(
      updated.map((i) => ({ repo_name: i.repo_name, priority: i.priority })),
      { onConflict: "repo_name" }
    );
  };

  const cy = (v) => ({ border: "none", borderRadius: 0, fontFamily: "var(--font-mono)", fontSize: "0.75rem", ...(v || {}) });

  if (loading) return (
    <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
      [DB] Fetching repos<span className="cursor-blink" />
    </p>
  );

  return (
    <>
      <p style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", marginBottom: 16 }}>
        {repos.length} repositories. Drag to reorder. Yellow = unsaved.
      </p>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="repos">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {repos.map((repo, index) => {
                const isExpanded = !!expandedRepos[repo.repo_name];
                const isDirty    = !!dirtyState[repo.repo_name];
                const status     = saveStatus[repo.repo_name] || "idle";
                return (
                  <Draggable key={repo.repo_name} draggableId={repo.repo_name} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          background: "var(--bg-card)",
                          borderLeft: `2px solid ${snapshot.isDragging ? "var(--cyber-green)" : isDirty ? "var(--cyber-yellow)" : "var(--border-green)"}`,
                          border: "1px solid var(--border-green)",
                          borderRadius: 0, marginBottom: 6,
                          opacity: repo.is_visible ? 1 : 0.5,
                          transition: "border-color 0.2s",
                        }}
                      >
                        {/* Header */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px" }}>
                          <span {...provided.dragHandleProps} style={{ cursor: "grab", color: "var(--text-muted)", flexShrink: 0 }}>
                            <DragHandleIcon />
                          </span>
                          <span onClick={() => toggleExpand(repo.repo_name)} style={{ color: "var(--text-dim)", flexShrink: 0, cursor: "pointer" }}>
                            {isExpanded ? <AiOutlineDown size={12} /> : <AiOutlineRight size={12} />}
                          </span>
                          <div onClick={() => toggleExpand(repo.repo_name)} style={{ flex: 1, minWidth: 0, cursor: "pointer" }}>
                            <span style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 600 }}>
                              {repo.display_title}
                            </span>
                            <span style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.72rem", marginLeft: 8 }}>
                              {repo.repo_name}
                            </span>
                            {repo.language && (
                              <span className="neon-badge-blue" style={{ marginLeft: 8, fontSize: "0.65rem", padding: "2px 6px" }}>
                                {repo.language}
                              </span>
                            )}
                            {isDirty && (
                              <span className="neon-badge" style={{ marginLeft: 6, fontSize: "0.65rem", padding: "2px 6px", borderLeftColor: "var(--cyber-yellow)", color: "var(--cyber-yellow)" }}>
                                UNSAVED
                              </span>
                            )}
                          </div>
                          {repo.demo_url && (
                            <a href={repo.demo_url} target="_blank" rel="noreferrer"
                              style={{ color: "var(--cyber-blue)", fontSize: "0.8rem", flexShrink: 0 }}>
                              <CgWebsite />
                            </a>
                          )}
                          <button
                            onClick={() => handleToggleVisibility(repo.repo_name, repo.is_visible)}
                            style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0,
                              color: repo.is_visible ? "var(--cyber-green)" : "var(--text-dim)", fontSize: "1rem" }}>
                            {repo.is_visible ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                          </button>
                          <button
                            onClick={() => handleSave(repo.repo_name)}
                            disabled={!isDirty || status === "saving"}
                            style={{
                              ...cy(), padding: "4px 10px",
                              border: "1px solid",
                              borderColor: status === "saved" ? "var(--cyber-green)" : isDirty ? "var(--cyber-yellow)" : "var(--border-green)",
                              color: status === "saved" ? "var(--cyber-green)" : isDirty ? "var(--cyber-yellow)" : "var(--text-dim)",
                              background: "transparent", cursor: isDirty ? "pointer" : "default",
                              flexShrink: 0,
                            }}
                          >
                            {status === "saving" ? "..." : status === "saved" ? <><AiOutlineCheck /> OK</> : <><AiOutlineSave /> SAVE</>}
                          </button>
                        </div>

                        {/* Accordion body */}
                        <Collapse in={isExpanded}>
                          <div>
                            <div style={{ padding: "12px 16px 16px", borderTop: "1px solid var(--border-green)", display: "grid", gap: 12 }}>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                  <label className="terminal-label">DISPLAY TITLE</label>
                                  <input className="terminal-input" value={repo.display_title}
                                    onChange={(e) => handleFieldChange(repo.repo_name, "display_title", e.target.value)} />
                                </div>
                                <div>
                                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <label className="terminal-label">DEMO URL</label>
                                    <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                                      {repo.demo_url_override ? <span style={{ color: "var(--cyber-green)" }}>OVERRIDE</span>
                                        : repo.gh_homepage ? <span style={{ color: "var(--cyber-blue)" }}>GH AUTO</span>
                                        : "NONE"}
                                      {repo.demo_url_override && (
                                        <button onClick={() => handleResetDemoUrl(repo.repo_name)}
                                          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.65rem", padding: "0 0 0 6px", fontFamily: "var(--font-mono)" }}>
                                          [reset]
                                        </button>
                                      )}
                                    </span>
                                  </div>
                                  <input className="terminal-input" value={repo.demo_url}
                                    placeholder={repo.gh_homepage || "https://..."}
                                    onChange={(e) => {
                                      handleFieldChange(repo.repo_name, "demo_url", e.target.value);
                                      handleFieldChange(repo.repo_name, "demo_url_override", e.target.value);
                                    }} />
                                </div>
                              </div>
                              <div>
                                <label className="terminal-label">DESCRIPTION</label>
                                <textarea className="terminal-input" rows={3} value={repo.custom_description}
                                  placeholder="Override GitHub description..."
                                  onChange={(e) => handleFieldChange(repo.repo_name, "custom_description", e.target.value)}
                                  style={{ resize: "vertical" }} />
                              </div>
                              <div>
                                <label className="terminal-label">CUSTOM IMAGE URL</label>
                                <input className="terminal-input" value={repo.custom_image_url}
                                  placeholder="https://... (blank = GitHub OG preview)"
                                  onChange={(e) => handleFieldChange(repo.repo_name, "custom_image_url", e.target.value)} />
                              </div>
                            </div>
                          </div>
                        </Collapse>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}

// ─────────────────────────────────────────────
// ATS CONFIG TAB
// ─────────────────────────────────────────────
function AtsConfigTab() {
  const [configs, setConfigs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    supabase.from("ats_config").select("config_key, config_value, description")
      .then(({ data }) => {
        if (data) {
          const m = {};
          data.forEach(({ config_key, config_value, description }) => {
            m[config_key] = { value: JSON.stringify(config_value, null, 2), description };
          });
          setConfigs(m);
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async (key) => {
    try {
      const parsed = JSON.parse(configs[key].value);
      await supabase.from("ats_config")
        .update({ config_value: parsed })
        .eq("config_key", key);
      setSaveMsg(`[OK] ${key} saved.`);
      setTimeout(() => setSaveMsg(""), 2500);
    } catch {
      setSaveMsg(`[ERR] Invalid JSON for ${key}`);
    }
  };

  if (loading) return <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Loading<span className="cursor-blink" /></p>;

  return (
    <div>
      {saveMsg && <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: saveMsg.startsWith("[OK]") ? "var(--cyber-green)" : "var(--cyber-red)", marginBottom: 16 }}>{saveMsg}</p>}
      {Object.entries(configs).map(([key, { value, description }]) => (
        <div key={key} style={{ marginBottom: 24, background: "var(--bg-card)", border: "1px solid var(--border-green)", borderLeft: "2px solid var(--cyber-blue)", padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span className="neon-badge-blue">{key}</span>
            <button className="cyber-btn cyber-btn-blue" style={{ fontSize: "0.72rem", padding: "4px 12px" }} onClick={() => handleSave(key)}>
              SAVE ↵
            </button>
          </div>
          <p style={{ color: "var(--text-dim)", fontSize: "0.72rem", fontFamily: "var(--font-mono)", marginBottom: 8 }}>{description}</p>
          <textarea
            value={value}
            onChange={(e) => setConfigs((p) => ({ ...p, [key]: { ...p[key], value: e.target.value } }))}
            rows={Math.min(12, value.split("\n").length + 1)}
            style={{
              width: "100%", fontFamily: "var(--font-mono)", fontSize: "0.75rem",
              background: "var(--bg-void)", color: "var(--text-primary)",
              border: "1px solid var(--border-green)", padding: 10, resize: "vertical", borderRadius: 0,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// MISSIONS TAB
// ─────────────────────────────────────────────
function MissionsTab() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saveMsg, setSaveMsg]   = useState("");
  const [editId, setEditId]     = useState(null);
  const blankMission = { title: "", category: "hackathon", badge: "", date: "", organization: "", description: "", highlights: [], is_visible: true, priority: 999 };
  const [form, setForm] = useState(blankMission);

  const load = async () => {
    const { data } = await supabase.from("mission_logs").select("*").order("priority");
    if (data) setMissions(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleEdit = (m) => { setEditId(m.id); setForm({ ...m, highlights: m.highlights?.join("\n") || "" }); };
  const handleNew  = () => { setEditId("new"); setForm({ ...blankMission, highlights: "" }); };
  const handleDelete = async (id) => {
    await supabase.from("mission_logs").delete().eq("id", id);
    load();
  };
  const handleSave = async () => {
    const payload = { ...form, highlights: form.highlights.split("\n").filter(Boolean) };
    delete payload.id;
    if (editId === "new") {
      await supabase.from("mission_logs").insert(payload);
    } else {
      await supabase.from("mission_logs").update(payload).eq("id", editId);
    }
    setSaveMsg("[OK] Saved."); setTimeout(() => setSaveMsg(""), 2000);
    setEditId(null); load();
  };

  if (loading) return <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Loading<span className="cursor-blink" /></p>;

  return (
    <div>
      {saveMsg && <p style={{ color: "var(--cyber-green)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", marginBottom: 12 }}>{saveMsg}</p>}
      <button className="cyber-btn" onClick={handleNew} style={{ marginBottom: 20, fontSize: "0.78rem" }}>+ ADD RECORD ↵</button>

      {editId && (
        <div style={{ background: "var(--bg-card-high)", border: "1px solid var(--cyber-green)", padding: 20, marginBottom: 24, borderRadius: 0 }}>
          <p style={{ color: "var(--cyber-green)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", marginBottom: 16 }}>
            {editId === "new" ? "[NEW RECORD]" : "[EDIT RECORD]"}
          </p>
          {[
            { label: "TITLE", key: "title" }, { label: "BADGE", key: "badge" },
            { label: "DATE (YYYY-MM-DD)", key: "date" }, { label: "ORGANIZATION", key: "organization" },
          ].map(({ label, key }) => (
            <div key={key} style={{ marginBottom: 12 }}>
              <label className="terminal-label">{label}</label>
              <input className="terminal-input" value={form[key] || ""} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} />
            </div>
          ))}
          <div style={{ marginBottom: 12 }}>
            <label className="terminal-label">CATEGORY</label>
            <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              style={{ background: "var(--bg-void)", color: "var(--text-primary)", border: "1px solid var(--border-green)", padding: "6px", fontFamily: "var(--font-mono)", fontSize: "0.8rem", width: "100%", borderRadius: 0 }}>
              <option value="hackathon">hackathon</option>
              <option value="ctf">ctf</option>
              <option value="leadership">leadership</option>
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="terminal-label">DESCRIPTION</label>
            <textarea className="terminal-input" rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} style={{ resize: "vertical" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="terminal-label">HIGHLIGHTS (one per line)</label>
            <textarea className="terminal-input" rows={4} value={form.highlights} onChange={(e) => setForm((p) => ({ ...p, highlights: e.target.value }))} style={{ resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="cyber-btn" onClick={handleSave}>SAVE ↵</button>
            <button className="cyber-btn" onClick={() => setEditId(null)} style={{ borderColor: "var(--text-dim)", color: "var(--text-muted)" }}>CANCEL</button>
          </div>
        </div>
      )}

      {missions.map((m) => (
        <div key={m.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border-green)", borderLeft: "2px solid var(--cyber-green)", padding: "12px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>{m.title}</span>
            <span className="neon-badge" style={{ marginLeft: 10, fontSize: "0.65rem", padding: "2px 6px" }}>{m.category}</span>
            {!m.is_visible && <span className="neon-badge-red" style={{ marginLeft: 6, fontSize: "0.65rem" }}>HIDDEN</span>}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => handleEdit(m)} style={{ background: "none", border: "1px solid var(--border-green)", color: "var(--text-muted)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "0.72rem", padding: "3px 10px", borderRadius: 0 }}>EDIT</button>
            <button onClick={() => handleDelete(m.id)} style={{ background: "none", border: "1px solid rgba(255,45,85,0.3)", color: "var(--cyber-red)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "0.72rem", padding: "3px 10px", borderRadius: 0 }}>DEL</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN ADMIN DASHBOARD
// ─────────────────────────────────────────────
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(ADMIN_TABS.PROJECTS);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <Container fluid className="about-section" style={{ paddingTop: 100, paddingBottom: 60 }}>
      <Particle />
      <Container>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", margin: 0 }}>
              &gt; sudo admin --panel --mode=interactive
            </p>
            <h1 style={{ color: "var(--cyber-green)", fontFamily: "var(--font-mono)", fontSize: "1.8rem", margin: "4px 0 0", textShadow: "0 0 8px var(--cyber-green)" }}>
              [ADMIN PANEL]
            </h1>
          </div>
          <button
            id="logout-button"
            onClick={handleLogout}
            style={{ background: "none", border: "1px solid rgba(255,45,85,0.4)", color: "var(--cyber-red)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "0.8rem", padding: "8px 16px", borderRadius: 0 }}
          >
            &gt; sudo logout
          </button>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 0, marginBottom: 28, borderBottom: "1px solid var(--border-green)" }}>
          {Object.values(ADMIN_TABS).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontFamily: "var(--font-mono)", fontSize: "0.75rem",
                border: "1px solid var(--border-green)",
                borderBottom: activeTab === tab ? "2px solid var(--cyber-green)" : "1px solid var(--border-green)",
                background: activeTab === tab ? "rgba(0,255,65,0.06)" : "transparent",
                color: activeTab === tab ? "var(--cyber-green)" : "var(--text-muted)",
                padding: "8px 18px", cursor: "pointer",
                letterSpacing: "0.08em", textTransform: "uppercase",
              }}
            >
              [{tab}]
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === ADMIN_TABS.PROJECTS  && <ProjectsTab />}
        {activeTab === ADMIN_TABS.ATS       && <AtsConfigTab />}
        {activeTab === ADMIN_TABS.MISSIONS  && <MissionsTab />}
      </Container>
    </Container>
  );
}

export default AdminDashboard;
