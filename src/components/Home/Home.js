import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import Home2 from "./Home2";
import Type from "./Type";
import { AiFillGithub, AiFillInstagram } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

// Fake terminal stats panel
const TerminalStats = () => {
  const now = new Date();
  const stats = [
    { k: "OPERATOR",  v: "garv767" },
    { k: "STATUS",    v: "ONLINE", accent: true },
    { k: "LOCATION",  v: "Indore, IN" },
    { k: "INSTITUTE", v: "SRM IST, KTR" },
    { k: "UPTIME",    v: `${Math.floor(Math.random() * 200 + 100)}d ${Math.floor(Math.random() * 24)}h` },
    { k: "CPU",       v: `${Math.floor(Math.random() * 20 + 5)}%` },
    { k: "RAM",       v: "4.2GB / 16GB" },
    { k: "TIMESTAMP", v: now.toISOString().slice(0, 19).replace("T", " ") },
  ];
  return (
    <div style={{
      background: "rgba(0,0,0,0.7)",
      border: "1px solid rgba(0,255,65,0.2)",
      borderTop: "2px solid var(--cyber-green)",
      padding: "20px 24px",
      fontFamily: "var(--font-mono)",
      fontSize: "0.78rem",
      marginTop: "20px",
    }}>
      <p style={{ color: "var(--text-muted)", marginBottom: 12 }}>
        $ system-info --operator=garv767
      </p>
      {stats.map(({ k, v, accent }) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ color: "var(--text-muted)" }}>{k}</span>
          <span style={{ color: accent ? "var(--cyber-green)" : "var(--text-primary)", textShadow: accent ? "0 0 8px var(--cyber-green)" : "none" }}>
            {v}
          </span>
        </div>
      ))}
    </div>
  );
};

function Home() {
  return (
    <section>
      <Container fluid className="home-section" id="home">
        <Particle />
        <Container className="home-content">
          <Row>
            <Col md={7} className="home-header">
              <p className="heading">
                <span style={{ color: "var(--cyber-green)" }}>&gt;&nbsp;</span>
                <span style={{ color: "var(--text-muted)" }}>whoami</span>
              </p>

              <h1 className="heading-name">
                GARV RAHUT
              </h1>

              <div style={{ marginTop: 16, marginBottom: 8 }}>
                <span style={{
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                }}>
                  &gt; cat roles.txt
                </span>
              </div>
              <div style={{ paddingLeft: 20 }}>
                <Type />
              </div>

              <ul className="home-about-social-links" style={{ marginTop: 40, display: "flex", gap: 12, padding: 0 }}>
                {[
                  { href: "https://github.com/garv767",               icon: <AiFillGithub /> },
                  { href: "https://www.linkedin.com/in/garv767",      icon: <FaLinkedinIn /> },
                  { href: "https://www.instagram.com/garv_767",       icon: <AiFillInstagram /> },
                ].map(({ href, icon }) => (
                  <li key={href} className="social-icons">
                    <a href={href} target="_blank" rel="noreferrer" className="icon-colour home-social-icons">
                      {icon}
                    </a>
                  </li>
                ))}
              </ul>
            </Col>

            <Col md={5} style={{ paddingTop: 40 }}>
              <TerminalStats />
            </Col>
          </Row>
        </Container>
      </Container>
      <Home2 />
    </section>
  );
}

export default Home;
