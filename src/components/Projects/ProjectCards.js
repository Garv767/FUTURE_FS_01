import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { AiFillGithub } from "react-icons/ai";
import { CgWebsite } from "react-icons/cg";

function ProjectCards({ title, description, ghLink, demoLink, imgPath, stars, forks, language }) {
  return (
    <Card className="project-card-view h-100">
      {/* Status bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "6px 12px",
        background: "rgba(0,255,65,0.04)",
        borderBottom: "1px solid var(--border-green)",
        fontFamily: "var(--font-mono)", fontSize: "0.68rem",
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "var(--cyber-green)",
            boxShadow: "0 0 6px var(--cyber-green)",
            display: "inline-block",
          }} />
          <span style={{ color: "var(--cyber-green)" }}>[PROC ACTIVE]</span>
        </span>
        {language && (
          <span className="neon-badge-blue">{language}</span>
        )}
      </div>

      {/* Thumbnail */}
      <Card.Img
        variant="top"
        src={imgPath}
        alt={title}
        className="card-img-top"
        style={{ height: 160, objectFit: "cover" }}
      />

      <Card.Body style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 8 }}>
        <Card.Title style={{
          fontFamily: "var(--font-mono)", fontSize: "0.95rem",
          color: "var(--cyber-green)", fontWeight: 700,
          marginBottom: 4,
        }}>
          {title}
        </Card.Title>

        <Card.Text style={{
          fontFamily: "var(--font-mono)", fontSize: "0.78rem",
          color: "var(--text-primary)", lineHeight: 1.7,
          flex: 1,
        }}>
          {description}
        </Card.Text>

        {/* Stats */}
        <div style={{
          display: "flex", gap: 16,
          fontFamily: "var(--font-mono)", fontSize: "0.72rem",
          color: "var(--text-muted)", margin: "4px 0",
        }}>
          <span>★ {stars ?? 0}</span>
          <span>⑂ {forks ?? 0}</span>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button
            href={ghLink}
            target="_blank"
            rel="noreferrer"
            className="cyber-btn"
            style={{ fontSize: "0.72rem", padding: "5px 12px" }}
          >
            <AiFillGithub style={{ marginRight: 4 }} />
            git clone
          </Button>
          {demoLink && (
            <Button
              href={demoLink}
              target="_blank"
              rel="noreferrer"
              className="cyber-btn cyber-btn-blue"
              style={{ fontSize: "0.72rem", padding: "5px 12px" }}
            >
              <CgWebsite style={{ marginRight: 4 }} />
              ./demo.sh
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProjectCards;
