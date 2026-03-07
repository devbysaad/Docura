export default function DeveloperPortfolio({ data }) {
    const { basics = {}, skills = [], experience = [], projects = [], education = [] } = data || {};

    return (
        <div className="bg-gray-900 text-gray-100 min-h-[297mm] w-full" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
            {/* Header */}
            <div className="p-8 pb-4 border-b border-gray-700">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span className="text-green-400">●</span> ~/resume/{(basics.fullName || "developer").toLowerCase().replace(/\s+/g, "-")}
                </div>
                <h1 className="text-2xl font-bold text-white">{basics.fullName || "Your Name"}</h1>
                <p className="text-emerald-400 text-sm mt-1">{basics.profession || "Software Developer"}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-400 font-mono">
                    {basics.email && <span className="text-blue-400">{basics.email}</span>}
                    {basics.phone && <span>{basics.phone}</span>}
                    {basics.location && <span>{basics.location}</span>}
                </div>
            </div>

            <div className="p-8 space-y-6">
                {/* Summary */}
                {basics.summary && (
                    <div>
                        <div className="text-xs text-gray-500 mb-1">{"// about"}</div>
                        <p className="text-xs text-gray-300 leading-relaxed">{basics.summary}</p>
                    </div>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <div>
                        <div className="text-xs text-gray-500 mb-2">{"// tech-stack"}</div>
                        <div className="flex flex-wrap gap-1.5">
                            {skills.filter(Boolean).map((s, i) => (
                                <span key={i} className="px-2 py-0.5 text-xs bg-gray-800 text-emerald-300 rounded border border-gray-700 font-mono">
                                    {typeof s === "string" ? s : s.name || s}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <div>
                        <div className="text-xs text-gray-500 mb-3">{"// experience"}</div>
                        {experience.map((exp, i) => (
                            <div key={i} className="mb-4 last:mb-0 pl-3 border-l-2 border-emerald-600">
                                <h3 className="text-sm font-semibold text-white">
                                    {exp.role || exp.position} <span className="text-gray-500 font-normal">@ {exp.company}</span>
                                </h3>
                                <span className="text-xs text-gray-500 font-mono">{exp.startDate} → {exp.endDate || "Present"}</span>
                                {exp.description && <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{exp.description}</p>}
                            </div>
                        ))}
                    </div>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <div>
                        <div className="text-xs text-gray-500 mb-3">{"// projects"}</div>
                        <div className="grid grid-cols-1 gap-3">
                            {projects.map((p, i) => (
                                <div key={i} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                                    <h3 className="text-sm font-semibold text-white">{p.name}</h3>
                                    <div className="flex gap-3 mt-1">
                                        {p.githubUrl && <span className="text-xs text-blue-400 font-mono">{p.githubUrl}</span>}
                                        {p.liveUrl && <span className="text-xs text-emerald-400 font-mono">{p.liveUrl}</span>}
                                    </div>
                                    {p.summary && <p className="text-xs text-gray-400 mt-1.5">{p.summary}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <div>
                        <div className="text-xs text-gray-500 mb-2">{"// education"}</div>
                        {education.map((ed, i) => (
                            <div key={i} className="mb-2 last:mb-0">
                                <h3 className="text-xs font-semibold text-white">{ed.school}</h3>
                                <p className="text-xs text-gray-500">{ed.degree} {ed.field && `in ${ed.field}`} • {ed.startDate} – {ed.endDate}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
