import React from "react";
import GitHubCalendar from "react-github-calendar";
import { Row } from "react-bootstrap";

function Github() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: 40, paddingTop: 20 }}>
      <p style={{
        color: "var(--text-muted)", fontFamily: "var(--font-mono)",
        fontSize: "0.8rem", textAlign: "center", width: "100%", marginBottom: 16,
      }}>
        &gt; git log --contributions --author=garv767
      </p>
      <div style={{
        background: "rgba(0,0,0,0.5)",
        border: "1px solid var(--border-green)",
        padding: "24px 20px",
        display: "inline-block",
      }}>
        <GitHubCalendar
          username="garv767"
          blockSize={14}
          blockMargin={4}
          fontSize={12}
          theme={{ dark: ["#0e0e0e", "#064010", "#0a7020", "#00b33c", "#00ff41"] }}
          colorScheme="dark"
        />
      </div>
    </Row>
  );
}

export default Github;
