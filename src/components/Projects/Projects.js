import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import useProjects from "../../hooks/useProjects";

function Projects() {
  const { projects, loading, error } = useProjects();

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <div className="project-heading">
          <span>&gt; ls /repos --filter=featured</span>
          <strong className="cyber-glow-static d-block mt-1">PROJECTS</strong>
        </div>

        {loading && (
          <div style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)", padding: "40px 0", fontSize: "0.85rem" }}>
            <p>[SYS] Initializing GitHub API client...</p>
            <p>[NET] GET /users/garv767/repos HTTP/1.1</p>
            <p style={{ color: "var(--cyber-green)" }}>[200] Fetching repositories<span className="cursor-blink" /></p>
          </div>
        )}

        {error && (
          <p style={{ color: "var(--cyber-red)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
            [ERR 500] Repository fetch failed. Check console.
          </p>
        )}

        {!loading && !error && projects.length === 0 && (
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 40 }}>
            [INFO] No processes found. Tag a repo with 'portfolio' or enable via Admin Panel.
          </p>
        )}

        <Row style={{ justifyContent: "center", paddingBottom: 20 }}>
          {projects.map((project) => (
            <Col md={4} className="project-card" key={project.id}>
              <ProjectCard
                imgPath={project.imgPath}
                title={project.title}
                description={project.description}
                ghLink={project.ghLink}
                demoLink={project.demoLink}
                stars={project.stars}
                forks={project.forks}
                language={project.language}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
