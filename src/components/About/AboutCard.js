import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  const json = {
    operator: "Garv Rahut",
    base: "Indore, India",
    institution: "SRM IST, KTR",
    degree: "B.Tech CSE",
    year_range: "2022 – 2026",
    interests: ["Gaming 🎮", "Tech Blogs ✍️", "Travel 🌍"],
    quote: "Strive to build things that make a difference!",
  };

  return (
    <Card className="quote-card-view">
      <Card.Body style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", padding: "16px 20px" }}>
        <div className="blockquote mb-0">
          {/* JSON terminal dump */}
          <pre style={{
            background: "transparent",
            color: "var(--text-primary)",
            fontSize: "0.82rem",
            margin: 0,
            lineHeight: 1.9,
          }}>
            {`{`}
            {Object.entries(json).map(([k, v]) => (
              <div key={k}>
                {"  "}
                <span style={{ color: "var(--cyber-blue)" }}>"{k}"</span>
                {": "}
                {Array.isArray(v)
                  ? <span style={{ color: "var(--text-muted)" }}>
                      {"["}
                      {v.map((item, i) => (
                        <span key={i}>
                          <span style={{ color: "var(--cyber-green)" }}>"{item}"</span>
                          {i < v.length - 1 ? ", " : ""}
                        </span>
                      ))}
                      {"]"}
                    </span>
                  : <span style={{ color: "var(--cyber-green)" }}>"{v}"</span>
                }
                {","}
              </div>
            ))}
            {`}`}
          </pre>

          <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
            {json.interests.map((item) => (
              <li key={item} className="about-activity">
                <ImPointRight style={{ color: "var(--cyber-green)", marginRight: 8 }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
