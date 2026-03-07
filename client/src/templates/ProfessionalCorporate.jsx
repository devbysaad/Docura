export default function ProfessionalCorporate({ data }) {
    const { basics = {}, skills = [], experience = [], projects = [], education = [] } = data || {};

    return (
        <div className="bg-white text-gray-900 min-h-[297mm] w-full" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
            {/* Header */}
            <div className="bg-slate-800 text-white p-8 pb-6">
                <h1 className="text-2xl font-bold tracking-tight">{basics.fullName || "Your Name"}</h1>
                <p className="text-sm text-slate-300 mt-1">{basics.profession || "Professional Title"}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-slate-400">
                    {basics.email && <span>✉ {basics.email}</span>}
                    {basics.phone && <span>☎ {basics.phone}</span>}
                    {basics.location && <span>📍 {basics.location}</span>}
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div className="w-1/3 bg-slate-50 p-6 border-r border-slate-200">
                    {/* Summary */}
                    {basics.summary && (
                        <div className="mb-6">
                            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">Profile</h2>
                            <p className="text-xs text-slate-600 leading-relaxed">{basics.summary}</p>
                        </div>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">Skills</h2>
                            <ul className="space-y-1">
                                {skills.filter(Boolean).map((s, i) => (
                                    <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                                        {typeof s === "string" ? s : s.name || s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Education */}
                    {education.length > 0 && (
                        <div>
                            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">Education</h2>
                            {education.map((ed, i) => (
                                <div key={i} className="mb-3 last:mb-0">
                                    <h3 className="text-xs font-semibold text-slate-800">{ed.school}</h3>
                                    <p className="text-xs text-slate-500">{ed.degree} {ed.field && `in ${ed.field}`}</p>
                                    <p className="text-xs text-slate-400">{ed.startDate} – {ed.endDate}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main */}
                <div className="flex-1 p-6">
                    {/* Experience */}
                    {experience.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b-2 border-slate-800 pb-1 mb-3">Work Experience</h2>
                            {experience.map((exp, i) => (
                                <div key={i} className="mb-4 last:mb-0">
                                    <h3 className="text-sm font-semibold text-slate-900">{exp.role || exp.position}</h3>
                                    <div className="flex justify-between text-xs text-slate-500 mt-0.5">
                                        <span>{exp.company}</span>
                                        <span>{exp.startDate} – {exp.endDate || "Present"}</span>
                                    </div>
                                    {exp.description && <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{exp.description}</p>}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Projects */}
                    {projects.length > 0 && (
                        <div>
                            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b-2 border-slate-800 pb-1 mb-3">Projects</h2>
                            {projects.map((p, i) => (
                                <div key={i} className="mb-3 last:mb-0">
                                    <h3 className="text-sm font-semibold text-slate-900">{p.name}</h3>
                                    {p.summary && <p className="text-xs text-slate-600 mt-1">{p.summary}</p>}
                                    <div className="flex gap-3 text-xs text-slate-500 mt-0.5">
                                        {p.githubUrl && <span>{p.githubUrl}</span>}
                                        {p.liveUrl && <span>{p.liveUrl}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
