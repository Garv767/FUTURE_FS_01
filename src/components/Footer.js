import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AiFillGithub, AiFillInstagram } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import emailjs from "@emailjs/browser";

const STATUS = { IDLE: "idle", SENDING: "sending", OK: "ok", ERR: "err" };

function Footer() {
  const year = new Date().getFullYear();
  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [txStatus, setTx]   = useState(STATUS.IDLE);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTx(STATUS.SENDING);
    setProgress(0);

    // Animate progress bar
    let p = 0;
    const tick = setInterval(() => {
      p += Math.random() * 18 + 5;
      if (p >= 99) { p = 99; clearInterval(tick); }
      setProgress(Math.floor(p));
    }, 180);

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID   || "",
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID  || "",
        {
          from_name:    form.name,
          from_email:   form.email,
          subject:      form.subject,
          message:      form.message,
          reply_to:     form.email,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY   || ""
      );
      clearInterval(tick);
      setProgress(100);
      setTx(STATUS.OK);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      clearInterval(tick);
      setTx(STATUS.ERR);
    }
  };

  const progressBar = (p) => {
    const filled = Math.floor(p / 10);
    return "█".repeat(filled) + "░".repeat(10 - filled);
  };

  return (
    <footer className="footer">
      {/* ── Contact Terminal Panel ── */}
      <div className="footer-contact-panel">
        <Container>
          <p className="footer-contact-header cursor-blink">
            &gt; ssh contact@garv767.dev --protocol=AES-256
          </p>

          {txStatus === STATUS.OK && (
            <p style={{ color: "var(--cyber-green)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", marginBottom: 16 }}>
              [OK] TRANSMISSION SUCCESSFUL. Message delivered securely. ✓
            </p>
          )}
          {txStatus === STATUS.ERR && (
            <p style={{ color: "var(--cyber-red)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", marginBottom: 16 }}>
              [ERR] TRANSMISSION FAILED. Check connection and retry.
            </p>
          )}
          {txStatus === STATUS.SENDING && (
            <p style={{ color: "var(--cyber-yellow)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", marginBottom: 16 }}>
              [ ENCRYPTING PAYLOAD... {progressBar(progress)} {progress}% ]
            </p>
          )}

          {txStatus !== STATUS.OK && (
            <form onSubmit={handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <label className="terminal-label">FROM: NAME</label>
                  <input
                    className="terminal-input"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="your_name"
                    required
                    disabled={txStatus === STATUS.SENDING}
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <label className="terminal-label">FROM: EMAIL</label>
                  <input
                    className="terminal-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="operator@domain.com"
                    required
                    disabled={txStatus === STATUS.SENDING}
                  />
                </Col>
                <Col md={12} className="mb-3">
                  <label className="terminal-label">SUBJECT:</label>
                  <input
                    className="terminal-input"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Re: collaboration"
                    required
                    disabled={txStatus === STATUS.SENDING}
                  />
                </Col>
                <Col md={12} className="mb-3">
                  <label className="terminal-label">MESSAGE:</label>
                  <textarea
                    className="terminal-input"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                    rows={4}
                    required
                    disabled={txStatus === STATUS.SENDING}
                    style={{ resize: "vertical" }}
                  />
                </Col>
                <Col md={12}>
                  <button
                    type="submit"
                    className="cyber-btn"
                    disabled={txStatus === STATUS.SENDING}
                  >
                    {txStatus === STATUS.SENDING ? "TRANSMITTING..." : "TRANSMIT ↵"}
                  </button>
                </Col>
              </Row>
            </form>
          )}
        </Container>
      </div>

      {/* ── Footer Meta ── */}
      <div className="footer-meta">
        <Container>
          <Row>
            <Col md={4} className="footer-copywright">
              <h3>// Designed &amp; Deployed by Garv Rahut</h3>
            </Col>
            <Col md={4} className="footer-copywright">
              <h3>© {year} garv767 — All systems operational.</h3>
            </Col>
            <Col md={4} className="footer-body">
              <ul className="footer-icons" style={{ listStyle: "none", display: "flex", justifyContent: "center", gap: 16, padding: 0, margin: 0 }}>
                {[
                  { href: "https://github.com/garv767",                icon: <AiFillGithub /> },
                  { href: "https://www.linkedin.com/in/garv767/",      icon: <FaLinkedinIn /> },
                  { href: "https://www.instagram.com/garv_767",        icon: <AiFillInstagram /> },
                ].map(({ href, icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="home-social-icons"
                      style={{ width: 36, height: 36, fontSize: "1rem" }}
                    >
                      {icon}
                    </a>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
