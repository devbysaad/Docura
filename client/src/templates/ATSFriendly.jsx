export default function ATSFriendly({ data = {} }) {
    const { basics = {}, skills = [], experience = [], projects = [], education = [] } = data;

    return (
        <div style={{
            fontFamily: "'Arial', 'Helvetica', sans-serif",
            color: "#000",
            backgroundColor: "#fff",
            maxWidth: "800px",
            margin: "0 auto",
            padding: "40px",
            lineHeight: 1.5,
        }}>
            {/* Header — simple, no graphics, no columns */}
            <div style={{ textAlign: "center", marginBottom: "24px", borderBottom: "2px solid #000", paddingBottom: "16px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 4px 0", color: "#000" }}>
                    {basics.fullName || "Your Name"}
                </h1>
                <p style={{ fontSize: "14px", color: "#333", margin: "0 0 8px 0" }}>
                    {basics.profession || "Professional Title"}
                </p>
                <p style={{ fontSize: "12px", color: "#555", margin: 0 }}>
                    {[basics.email, basics.phone, basics.location, basics.portfolioUrl]
                        .filter(Boolean)
                        .join("  |  ")}
                </p>
            </div>

            {/* Summary */}
            {basics.summary && (
                <div style={{ marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "14px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 8px 0", borderBottom: "1px solid #000", paddingBottom: "4px" }}>
                        Professional Summary
                    </h2>
                    <p style={{ fontSize: "13px", color: "#222", lineHeight: 1.6, margin: 0 }}>{basics.summary}</p>
                </div>
            )}

            {/* Skills — plain list, no badges */}
            {skills.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "14px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 8px 0", borderBottom: "1px solid #000", paddingBottom: "4px" }}>
                        Skills
                    </h2>
                    <p style={{ fontSize: "13px", color: "#222", lineHeight: 1.6, margin: 0 }}>
                        {skills.join("  •  ")}
                    </p>
                </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "14px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 12px 0", borderBottom: "1px solid #000", paddingBottom: "4px" }}>
                        Work Experience
                    </h2>
                    {experience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: "16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <strong style={{ fontSize: "14px", color: "#000" }}>{exp.role}</strong>
                                <span style={{ fontSize: "12px", color: "#555" }}>
                                    {exp.startDate} — {exp.endDate || "Present"}
                                </span>
                            </div>
                            <p style={{ fontSize: "13px", color: "#333", margin: "2px 0 6px 0" }}>{exp.company}</p>
                            {exp.description && (
                                <p style={{ fontSize: "13px", color: "#222", lineHeight: 1.6, margin: 0 }}>
                                    {exp.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "14px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 12px 0", borderBottom: "1px solid #000", paddingBottom: "4px" }}>
                        Projects
                    </h2>
                    {projects.map((proj, i) => (
                        <div key={i} style={{ marginBottom: "12px" }}>
                            <strong style={{ fontSize: "13px", color: "#000" }}>{proj.name}</strong>
                            {proj.summary && (
                                <p style={{ fontSize: "13px", color: "#222", lineHeight: 1.6, margin: "4px 0 0 0" }}>
                                    {proj.summary}
                                </p>
                            )}
                            {(proj.githubUrl || proj.liveUrl) && (
                                <p style={{ fontSize: "12px", color: "#555", margin: "2px 0 0 0" }}>
                                    {[proj.githubUrl, proj.liveUrl].filter(Boolean).join("  |  ")}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            {education.length > 0 && (
                <div>
                    <h2 style={{ fontSize: "14px", fontWeight: "700", textTransform: "uppercase", margin: "0 0 12px 0", borderBottom: "1px solid #000", paddingBottom: "4px" }}>
                        Education
                    </h2>
                    {education.map((ed, i) => (
                        <div key={i} style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <strong style={{ fontSize: "13px", color: "#000" }}>
                                    {[ed.degree, ed.field].filter(Boolean).join(" in ")}
                                </strong>
                                <p style={{ fontSize: "12px", color: "#555", margin: "2px 0 0 0" }}>{ed.school}</p>
                            </div>
                            <span style={{ fontSize: "12px", color: "#555" }}>
                                {[ed.startDate, ed.endDate].filter(Boolean).join(" — ")}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
