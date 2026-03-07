export default function CreativeDesigner({ data }) {
    const { basics = {}, skills = [], experience = [], projects = [], education = [] } = data || {};

    return (
        <div className="bg-white text-gray-900 min-h-[297mm] w-full" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
            {/* Header with accent */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-500" />
                <div className="relative p-8 text-white">
                    <h1 className="text-3xl font-extrabold tracking-tight">{basics.fullName || "Your Name"}</h1>
                    <p className="text-lg font-medium text-white/80 mt-1">{basics.profession || "Creative Professional"}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-white/60">
                        {basics.email && <span>{basics.email}</span>}
                        {basics.phone && <span>{basics.phone}</span>}
                        {basics.location && <span>{basics.location}</span>}
                    </div>
                </div>
            </div>

            <div className="p-8 space-y-6">
                {/* Summary */}
                {basics.summary && (
                    <div className="bg-violet-50 rounded-xl p-4 border-l-4 border-violet-500">
                        <p className="text-xs text-gray-700 leading-relaxed italic">{basics.summary}</p>
                    </div>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <div>
                        <h2 className="text-sm font-bold text-violet-600 mb-3 flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-violet-500" /> EXPERTISE
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.filter(Boolean).map((s, i) => (
                                <span key={i} className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-full">
                                    {typeof s === "string" ? s : s.name || s}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <div>
                        <h2 className="text-sm font-bold text-violet-600 mb-3 flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-violet-500" /> EXPERIENCE
                        </h2>
                        {experience.map((exp, i) => (
                            <div key={i} className="mb-4 last:mb-0 relative pl-4">
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-400 to-pink-400 rounded" />
                                <h3 className="text-sm font-bold text-gray-900">{exp.role || exp.position}</h3>
                                <div className="flex justify-between text-xs mt-0.5">
                                    <span className="text-violet-500 font-medium">{exp.company}</span>
                                    <span className="text-gray-400">{exp.startDate} – {exp.endDate || "Present"}</span>
                                </div>
                                {exp.description && <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{exp.description}</p>}
                            </div>
                        ))}
                    </div>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <div>
                        <h2 className="text-sm font-bold text-violet-600 mb-3 flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-violet-500" /> PROJECTS
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {projects.map((p, i) => (
                                <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                    <h3 className="text-xs font-bold text-gray-900">{p.name}</h3>
                                    {p.summary && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{p.summary}</p>}
                                    <div className="flex gap-2 mt-1.5">
                                        {p.githubUrl && <span className="text-xs text-violet-500">{p.githubUrl}</span>}
                                        {p.liveUrl && <span className="text-xs text-pink-500">{p.liveUrl}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <div>
                        <h2 className="text-sm font-bold text-violet-600 mb-3 flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-violet-500" /> EDUCATION
                        </h2>
                        {education.map((ed, i) => (
                            <div key={i} className="mb-2 last:mb-0">
                                <h3 className="text-xs font-bold text-gray-900">{ed.school}</h3>
                                <p className="text-xs text-gray-500">{ed.degree} {ed.field && `in ${ed.field}`} • {ed.startDate} – {ed.endDate}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
