import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { supabase } from "../../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import Particle from "../Particle";

function Login() {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="about-section" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Particle />
      <Container>
        <Row className="justify-content-center">
          <Col md={5} lg={4}>
            <div style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-green)",
              borderTop: "2px solid var(--cyber-green)",
              padding: "36px 32px",
            }}>
              <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", marginBottom: 8 }}>
                &gt; sudo authenticate --operator=admin
              </p>
              <h1 style={{
                fontFamily: "var(--font-mono)", fontSize: "1.4rem",
                color: "var(--cyber-green)", marginBottom: 28,
                textShadow: "0 0 8px var(--cyber-green)",
              }}>
                [SECURE ACCESS]
              </h1>

              {error && (
                <div style={{
                  background: "rgba(255,45,85,0.08)", borderLeft: "2px solid var(--cyber-red)",
                  padding: "8px 12px", fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem", color: "var(--cyber-red)", marginBottom: 20,
                }}>
                  [AUTH FAILED] {error}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: 20 }}>
                  <label className="terminal-label">OPERATOR ID (EMAIL):</label>
                  <input
                    className="terminal-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@domain.com"
                    required
                    disabled={loading}
                  />
                </div>
                <div style={{ marginBottom: 28 }}>
                  <label className="terminal-label">PASSPHRASE:</label>
                  <input
                    className="terminal-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  className="cyber-btn"
                  disabled={loading}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {loading ? "AUTHENTICATING..." : "AUTHENTICATE ↵"}
                </button>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Login;
