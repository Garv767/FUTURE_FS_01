import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ImPointRight } from "react-icons/im";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row style={{ justifyContent: "center", padding: "10px" }}>
          <Col md={8}>
            <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", marginBottom: 12 }}>
              $ cat about.txt
            </p>
            <div className="quote-card-view">
              <p style={{ marginBottom: 12, color: "var(--text-primary)", lineHeight: 1.9 }}>
                Hi! I'm{" "}
                <span className="cyber-glow-static">Garv Rahut</span> from{" "}
                <span style={{ color: "var(--cyber-blue)" }}>Indore, India</span>.
                I'm pursuing{" "}
                <span style={{ color: "var(--cyber-blue)" }}>B.Tech in CSE</span> at{" "}
                <span className="cyber-glow-static">SRM IST, KTR</span>.
                I build full-stack systems with a focus on security, performance, and open-source tooling.
              </p>
              <ul className="about-activity">
                {["Gaming & Competitive FPS 🎮", "Writing Tech Blogs ✍️", "Exploring New Places 🌍"].map((item) => (
                  <li key={item}>
                    <ImPointRight style={{ color: "var(--cyber-green)", marginRight: 8 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 16 }}>
                <span style={{ color: "var(--cyber-green)" }}>" </span>
                Strive to build things that make a difference!
                <span style={{ color: "var(--cyber-green)" }}> "</span>
                <span style={{ color: "var(--text-dim)", marginLeft: 12 }}>— garv767</span>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Home2;
