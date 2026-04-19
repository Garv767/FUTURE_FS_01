import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import Github from "./Github";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import Toolstack from "./Toolstack";

function About() {
  return (
    <>
      <Particle />
      <Container fluid className="about-section">
        <Container>
          {/* Header */}
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", marginBottom: 8, paddingTop: 10 }}>
            &gt; cat /profiles/garv767.json
          </p>

          <Row style={{ justifyContent: "center", padding: "10px 0 30px" }}>
            <Col md={7} style={{ paddingTop: 10, paddingBottom: 30 }}>
              <h1 style={{ fontSize: "1.8rem", color: "var(--text-primary)", marginBottom: 20 }}>
                Know Who <span className="cyber-glow-static">I'M</span>
              </h1>
              <Aboutcard />
            </Col>
            <Col md={5} style={{ paddingTop: 60 }} className="about-img">
              {/* Decorative terminal art instead of image */}
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "0.7rem",
                color: "var(--text-dim)", lineHeight: 1.6,
                border: "1px solid var(--border-green)", padding: 20,
              }}>
                <p style={{ color: "var(--cyber-green)", marginBottom: 8 }}>$ id garv767</p>
                <p>uid=1337(garv767) gid=1337(dev)</p>
                <p>groups=dev,sec,ctf,open-source</p>
                <br />
                <p style={{ color: "var(--cyber-green)", marginBottom: 8 }}>$ uname -a</p>
                <p>SRM IST KTR B.Tech-CSE 2022-2026</p>
                <br />
                <p style={{ color: "var(--cyber-green)", marginBottom: 8 }}>$ whoami --verbose</p>
                <p>Full Stack Developer</p>
                <p>Security Researcher</p>
                <p>CTF Competitor</p>
              </div>
            </Col>
          </Row>

          <h2 style={{ fontSize: "1.4rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: 4 }}>
            &gt; ls --skills
          </h2>
          <h3 style={{ fontSize: "1rem", color: "var(--cyber-green)", marginBottom: 20 }}>
            LANGUAGES
          </h3>
          <Techstack />

          <h3 style={{ fontSize: "1rem", color: "var(--cyber-green)", marginTop: 30, marginBottom: 16 }}>
            TOOLS &amp; PLATFORMS
          </h3>
          <Toolstack />

          <Github />
        </Container>
      </Container>
    </>
  );
}

export default About;
