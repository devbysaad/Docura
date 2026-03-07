export default function ModernMinimal({ data }) {
    const { basics = {}, skills = [], experience = [], projects = [], education = [] } = data || {};

    return (
        <div className="bg-white text-gray-900 p-8 font-sans min-h-[297mm] w-full" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    {basics.fullName || "Your Name"}
                </h1>
                <p className="text-sm text-indigo-600 font-medium mt-0.5">
                    {basics.profession || "Professional Title"}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                    {basics.email && <span>{basics.email}</span>}
                    {basics.phone && <span>{basics.phone}</span>}
                    {basics.location && <span>{basics.location}</span>}
                </div>
            </div>

            {/* Summary */}
            {basics.summary && (
                <div className="mb-5">
                    <p className="text-xs text-gray-600 leading-relaxed">{basics.summary}</p>
                </div>
            )}

            <hr className="border-gray-200 mb-5" />

            {/* Skills */}
            {skills.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Skills</h2>
                    <div className="flex flex-wrap gap-1.5">
                        {skills.filter(Boolean).map((s, i) => (
                            <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                                {typeof s === "string" ? s : s.name || s}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Experience</h2>
                    {experience.map((exp, i) => (
                        <div key={i} className="mb-3 last:mb-0">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    {exp.role || exp.position} {exp.company && <span className="font-normal text-gray-500">— {exp.company}</span>}
                                </h3>
                                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                    {exp.startDate} – {exp.endDate || "Present"}
                                </span>
                            </div>
                            {exp.description && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{exp.description}</p>}
                        </div>
                    ))}
                </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Projects</h2>
                    {projects.map((p, i) => (
                        <div key={i} className="mb-3 last:mb-0">
                            <h3 className="text-sm font-semibold text-gray-900">{p.name}</h3>
                            <div className="flex gap-3 text-xs text-indigo-500 mt-0.5">
                                {p.githubUrl && <span>{p.githubUrl}</span>}
                                {p.liveUrl && <span>{p.liveUrl}</span>}
                            </div>
                            {p.summary && <p className="text-xs text-gray-600 mt-1">{p.summary}</p>}
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            {education.length > 0 && (
                <div>
                    <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Education</h2>
                    {education.map((ed, i) => (
                        <div key={i} className="mb-2 last:mb-0">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-sm font-semibold text-gray-900">{ed.school}</h3>
                                <span className="text-xs text-gray-400">{ed.startDate} – {ed.endDate}</span>
                            </div>
                            <p className="text-xs text-gray-500">{ed.degree} {ed.field && `in ${ed.field}`}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
