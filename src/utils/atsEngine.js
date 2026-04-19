// ATS Engine — client-side keyword matching + resume builder
// All processing is done in the browser, no server required.

const STOPWORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with",
  "is","are","was","were","be","been","have","has","had","do","does","did",
  "will","would","can","could","should","may","might","must","shall",
  "we","our","you","your","their","they","it","its","this","that","these","those",
  "as","by","from","into","through","during","before","after","above","below",
  "between","experience","work","working","using","ability","strong","good",
  "great","excellent","looking","seeking","required","preferred","plus",
  "responsible","responsibilities","qualifications","minimum","years","year",
]);

/**
 * Extract meaningful keyword tokens from a job description string.
 */
export function extractKeywords(jd) {
  const tokens = jd
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));

  // Deduplicate
  return [...new Set(tokens)];
}

/**
 * Load skill weights from ats_config (pre-fetched by caller).
 * Falls back to equal weight = 1.0 for unknown terms.
 */
export function scoreProjects(keywords, projects, skillWeights = {}) {
  return projects.map((project) => {
    const haystack = [
      project.title, project.description, project.language || "",
    ].join(" ").toLowerCase();

    let score = 0;
    const matchedKeywords = [];

    keywords.forEach((kw) => {
      if (haystack.includes(kw)) {
        const weight = skillWeights[kw] ?? 1.0;
        score += weight;
        matchedKeywords.push(kw);
      }
    });

    return { ...project, atsScore: score, matchedKeywords };
  })
  .filter((p) => p.atsScore > 0)
  .sort((a, b) => b.atsScore - a.atsScore);
}

/**
 * Build a structured resume object from config + top projects.
 */
export function buildResume(topProjects, config) {
  const personal   = config.resume_personal   || {};
  const education  = config.resume_education  || [];
  const skillsData = config.resume_skills     || {};
  const summaryTpl = config.resume_summary_template || "";

  const topSkills = [...new Set(
    topProjects.flatMap((p) => p.matchedKeywords)
  )].slice(0, 5).join(", ");

  const summary = summaryTpl
    .replace("{top_skills}", topSkills || "full-stack and security technologies")
    .replace("{focus_area}", "cybersecurity, performance engineering, and open-source")
    .replace("{achievement}", "deliver scalable systems under real-world constraints")
    .replace(/^"|"$/g, "");

  return { personal, education, skills: skillsData, summary, projects: topProjects };
}

/**
 * Format resume as plain-text ATS-friendly string.
 */
export function resumeToText(resume) {
  const { personal, education, skills, summary, projects } = resume;
  const line = (ch = "-", n = 60) => ch.repeat(n);

  const lines = [
    personal.name?.toUpperCase() || "YOUR NAME",
    [personal.email, personal.phone, personal.linkedin, personal.github]
      .filter(Boolean).join("  |  "),
    personal.location || "",
    "",
    line(),
    "PROFESSIONAL SUMMARY",
    line(),
    summary,
    "",
    line(),
    "EDUCATION",
    line(),
    ...(Array.isArray(education) ? education : [education]).map((e) =>
      `${e.degree}\n${e.institution} | ${e.year}${e.gpa ? " | GPA: " + e.gpa : ""}`
    ),
    "",
    line(),
    "TECHNICAL SKILLS",
    line(),
    ...Object.entries(skills).map(([cat, arr]) =>
      `${cat.toUpperCase()}: ${(Array.isArray(arr) ? arr : [arr]).join(", ")}`
    ),
    "",
    line(),
    "SELECTED PROJECTS",
    line(),
    ...projects.flatMap((p) => [
      `${p.title} | ${p.language || ""}`,
      p.description,
      `GitHub: ${p.ghLink}`,
      p.demoLink ? `Demo: ${p.demoLink}` : "",
      `Keywords matched: ${p.matchedKeywords.slice(0, 6).join(", ")}`,
      "",
    ]),
  ];

  return lines.join("\n");
}
