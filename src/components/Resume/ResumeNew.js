import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import { Document, Page, pdfjs } from "react-pdf";
import { AiOutlineDownload } from "react-icons/ai";
import pdf from "../../Assets/GARV_RAHUT_resume.pdf";
import { supabase } from "../../utils/supabaseClient";
import useProjects from "../../hooks/useProjects";
import { extractKeywords, scoreProjects, buildResume, resumeToText } from "../../utils/atsEngine";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const TABS = { VIEW: "VIEW", ATS: "ATS" };

function ResumeNew() {
  const [width, setWidth]           = useState(1200);
  const [tab, setTab]               = useState(TABS.VIEW);
  const [jd, setJd]                 = useState("");
  const [atsOutput, setAtsOutput]   = useState("");
  const [analyzing, setAnalyzing]   = useState(false);
  const [atsConfig, setAtsConfig]   = useState({});
  const { projects }                = useProjects();

  useEffect(() => { setWidth(window.innerWidth); }, []);

  useEffect(() => {
    const loadConfig = async () => {
      const { data } = await supabase.from("ats_config").select("config_key, config_value");
      if (data) {
        const map = {};
        data.forEach(({ config_key, config_value }) => { map[config_key] = config_value; });
        setAtsConfig(map);
      }
    };
    loadConfig();
  }, []);

  const handleAnalyze = () => {
    if (!jd.trim()) return;
    setAnalyzing(true);
    setAtsOutput("");

    setTimeout(() => {
      const keywords    = extractKeywords(jd);
      const weights     = atsConfig.skill_weights || {};
      const scored      = scoreProjects(keywords, projects, weights);
      const top3        = scored.slice(0, 3);
      const resume      = buildResume(top3, atsConfig);
      const text        = resumeToText(resume);
      setAtsOutput(text);
      setAnalyzing(false);
    }, 900);
  };

  const handleCopy = () => {
    if (atsOutput) navigator.clipboard.writeText(atsOutput);
  };

  const TabBtn = ({ id }) => (
    <button
      onClick={() => setTab(id)}
      style={{
        fontFamily: "var(--font-mono)", fontSize: "0.8rem",
        border: "1px solid var(--border-green)",
        borderBottom: tab === id ? "2px solid var(--cyber-green)" : "1px solid var(--border-green)",
        background: tab === id ? "rgba(0,255,65,0.06)" : "transparent",
        color: tab === id ? "var(--cyber-green)" : "var(--text-muted)",
        padding: "8px 20px", cursor: "pointer",
        letterSpacing: "0.08em", textTransform: "uppercase",
        transition: "all 0.2s",
      }}
    >
      [{id}]
    </button>
  );

  return (
    <div>
      <Container fluid className="resume-section">
        <Particle />
        <Container>
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", marginBottom: 8 }}>
            &gt; resume.sh --mode=interactive
          </p>
          <h1 style={{ marginBottom: 24 }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>// </span>
            <strong className="cyber-glow-static" style={{ fontSize: "2rem" }}>RESUME</strong>
          </h1>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 0, marginBottom: 32, borderBottom: "1px solid var(--border-green)" }}>
            <TabBtn id={TABS.VIEW} />
            <TabBtn id={TABS.ATS} />
          </div>

          {/* VIEW tab */}
          {tab === TABS.VIEW && (
            <>
              <Row style={{ justifyContent: "center", marginBottom: 20 }}>
                <a href={pdf} target="_blank" rel="noreferrer" className="cyber-btn" style={{ width: "auto" }}>
                  <AiOutlineDownload style={{ marginRight: 6 }} />
                  DOWNLOAD CV
                </a>
              </Row>
              <Row className="resume d-flex justify-content-center">
                <Document file={pdf} className="d-flex justify-content-center">
                  <Page pageNumber={1} scale={width > 786 ? 1.5 : 0.55} />
                </Document>
              </Row>
              <Row style={{ justifyContent: "center", marginTop: 20 }}>
                <a href={pdf} target="_blank" rel="noreferrer" className="cyber-btn" style={{ width: "auto" }}>
                  <AiOutlineDownload style={{ marginRight: 6 }} />
                  DOWNLOAD CV
                </a>
              </Row>
            </>
          )}

          {/* ATS tab */}
          {tab === TABS.ATS && (
            <Row>
              <Col md={5} style={{ marginBottom: 24 }}>
                <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", marginBottom: 8 }}>
                  &gt; paste job description below
                </p>
                <textarea
                  className="terminal-input"
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="// Paste the full job description here..."
                  rows={16}
                  style={{ resize: "vertical", width: "100%", border: "1px solid var(--border-green)" }}
                />
                <button
                  className="cyber-btn"
                  onClick={handleAnalyze}
                  disabled={analyzing || !jd.trim()}
                  style={{ marginTop: 12 }}
                >
                  {analyzing ? "ANALYZING..." : "ANALYZE ↵"}
                </button>
                {analyzing && (
                  <div style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    <p>[ATS] Tokenizing keywords...</p>
                    <p>[ML] Scoring {projects.length} projects...</p>
                    <p style={{ color: "var(--cyber-green)" }}>[OK] Building resume<span className="cursor-blink" /></p>
                  </div>
                )}
              </Col>
              <Col md={7}>
                {atsOutput ? (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <p style={{ color: "var(--cyber-green)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", margin: 0 }}>
                        [OK] ATS-OPTIMIZED RESUME — Copy or download as plain text
                      </p>
                      <button className="cyber-btn" onClick={handleCopy} style={{ fontSize: "0.72rem", padding: "4px 12px" }}>
                        COPY ↵
                      </button>
                    </div>
                    <pre style={{
                      background: "var(--bg-card)", border: "1px solid var(--border-green)",
                      padding: 20, fontFamily: "var(--font-mono)", fontSize: "0.72rem",
                      color: "var(--text-primary)", whiteSpace: "pre-wrap",
                      wordBreak: "break-word", maxHeight: 600, overflowY: "auto",
                      lineHeight: 1.7,
                    }}>
                      {atsOutput}
                    </pre>
                    <a
                      href={`data:text/plain;charset=utf-8,${encodeURIComponent(atsOutput)}`}
                      download="ATS_Resume_Garv_Rahut.txt"
                      className="cyber-btn"
                      style={{ display: "inline-block", marginTop: 12, fontSize: "0.78rem" }}
                    >
                      DOWNLOAD TXT ↵
                    </a>
                  </>
                ) : (
                  <div style={{
                    border: "1px solid var(--border-green)", padding: 40,
                    fontFamily: "var(--font-mono)", fontSize: "0.8rem",
                    color: "var(--text-dim)", textAlign: "center",
                  }}>
                    <p>[ATS OPTIMIZER]</p>
                    <p>Paste a job description and click ANALYZE</p>
                    <p>to generate a tailored ATS resume.</p>
                  </div>
                )}
              </Col>
            </Row>
          )}
        </Container>
      </Container>
    </div>
  );
}

export default ResumeNew;
