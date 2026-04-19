import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Link, useLocation } from "react-router-dom";
import { CgGitFork } from "react-icons/cg";
import { AiFillStar } from "react-icons/ai";

function NavBar() {
  const [expand, setExpand]   = useState(false);
  const [sticky, setSticky]   = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY >= 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const links = [
    { to: "/",        label: "HOME"     },
    { to: "/about",   label: "ABOUT"    },
    { to: "/project", label: "PROJECTS" },
    { to: "/missions",label: "MISSIONS" },
    { to: "/resume",  label: "RESUME"   },
  ];

  return (
    <Navbar
      expanded={expand}
      fixed="top"
      expand="md"
      className={sticky ? "sticky" : "navbar"}
    >
      <Container>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          <span style={{ color: "var(--cyber-green)", fontWeight: 700 }}>
            &gt;_<span className="cursor-blink">garv767</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => setExpand(expand ? false : "expanded")}
        >
          <span /><span /><span />
        </Navbar.Toggle>

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto" style={{ gap: "4px" }}>
            {links.map(({ to, label }) => (
              <Nav.Item key={to}>
                <Nav.Link
                  as={Link}
                  to={to}
                  onClick={() => setExpand(false)}
                  className={isActive(to) ? "active" : ""}
                >
                  {label}
                </Nav.Link>
              </Nav.Item>
            ))}

            {/* GitHub star */}
            <Nav.Item className="fork-btn ms-2">
              <Button
                href="https://github.com/garv767/portfolio"
                target="_blank"
                rel="noreferrer"
                className="fork-btn-inner"
              >
                <CgGitFork style={{ fontSize: "1.1em" }} />{" "}
                <AiFillStar style={{ fontSize: "1em" }} />
              </Button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
