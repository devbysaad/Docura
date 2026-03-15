export default function ExecutiveProfessional({ data = {} }) {
    const { basics = {}, skills = [], experience = [], projects = [], education = [] } = data;

    return (
        <div style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            color: "#1a1a1a",
            backgroundColor: "#fff",
            maxWidth: "800px",
            margin: "0 auto",
            padding: "48px",
            lineHeight: 1.5,
        }}>
            {/* Header */}
            <div style={{ borderBottom: "3px solid #1a1a2e", paddingBottom: "24px", marginBottom: "32px" }}>
                <h1 style={{ fontSize: "32px", fontWeight: "700", margin: "0 0 4px 0", color: "#1a1a2e", letterSpacing: "1px", textTransform: "uppercase" }}>
                    {basics.fullName || "Your Name"}
                </h1>
                <p style={{ fontSize: "16px", color: "#4a4a6a", margin: "0 0 12px 0", fontStyle: "italic" }}>
                    {basics.profession || "Professional Title"}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "13px", color: "#666" }}>
                    {basics.email && <span>{basics.email}</span>}
                    {basics.phone && <span>•  {basics.phone}</span>}
                    {basics.location && <span>•  {basics.location}</span>}
                    {basics.portfolioUrl && <span>•  {basics.portfolioUrl}</span>}
                </div>
            </div>

            {/* Summary */}
            {basics.summary && (
                <div style={{ marginBottom: "28px" }}>
                    <h2 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: "#1a1a2e", borderBottom: "1px solid #ddd", paddingBottom: "6px", marginBottom: "12px" }}>
                        Executive Summary
                    </h2>
                    <p style={{ fontSize: "14px", color: "#333", lineHeight: 1.7 }}>{basics.summary}</p>
                </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <div style={{ marginBottom: "28px" }}>
                    <h2 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: "#1a1a2e", borderBottom: "1px solid #ddd", paddingBottom: "6px", marginBottom: "16px" }}>
                        Professional Experience
                    </h2>
                    {experience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: "20px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <h3 style={{ fontSize: "15px", fontWeight: "700", margin: 0, color: "#1a1a2e" }}>
                                    {exp.role}
                                </h3>
                                <span style={{ fontSize: "12px", color: "#888" }}>
                                    {exp.startDate} — {exp.endDate || "Present"}
                                </span>
                            </div>
                            <p style={{ fontSize: "13px", color: "#4a4a6a", margin: "2px 0 8px 0", fontStyle: "italic" }}>
                                {exp.company}
                            </p>
                            {exp.description && (
                                <p style={{ fontSize: "13px", color: "#444", lineHeight: 1.6, margin: 0 }}>
                                    {exp.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <div style={{ marginBottom: "28px" }}>
                    <h2 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: "#1a1a2e", borderBottom: "1px solid #ddd", paddingBottom: "6px", marginBottom: "12px" }}>
                        Core Competencies
                    </h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {skills.map((skill, i) => (
                            <span key={i} style={{
                                padding: "4px 14px",
                                border: "1px solid #ccc",
                                borderRadius: "2px",
                                fontSize: "12px",
                                color: "#333",
                            }}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
                <div style={{ marginBottom: "28px" }}>
                    <h2 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: "#1a1a2e", borderBottom: "1px solid #ddd", paddingBottom: "6px", marginBottom: "16px" }}>
                        Key Projects
                    </h2>
                    {projects.map((proj, i) => (
                        <div key={i} style={{ marginBottom: "16px" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: "700", margin: "0 0 4px 0", color: "#1a1a2e" }}>
                                {proj.name}
                            </h3>
                            {proj.summary && (
                                <p style={{ fontSize: "13px", color: "#444", lineHeight: 1.6, margin: 0 }}>
                                    {proj.summary}
                                </p>
                            )}
                            <div style={{ fontSize: "12px", color: "#4a4a6a", marginTop: "4px" }}>
                                {proj.githubUrl && <span style={{ marginRight: "16px" }}>GitHub: {proj.githubUrl}</span>}
                                {proj.liveUrl && <span>Live: {proj.liveUrl}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            {education.length > 0 && (
                <div>
                    <h2 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: "#1a1a2e", borderBottom: "1px solid #ddd", paddingBottom: "6px", marginBottom: "16px" }}>
                        Education
                    </h2>
                    {education.map((ed, i) => (
                        <div key={i} style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                            <div>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", margin: 0, color: "#1a1a2e" }}>
                                    {[ed.degree, ed.field].filter(Boolean).join(" in ")}
                                </h3>
                                <p style={{ fontSize: "13px", color: "#666", margin: "2px 0 0 0" }}>{ed.school}</p>
                            </div>
                            <span style={{ fontSize: "12px", color: "#888" }}>
                                {[ed.startDate, ed.endDate].filter(Boolean).join(" — ")}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
