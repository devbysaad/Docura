export default function ResumePreview({ data }) {
    const { basics = {}, skills = [], experience = [], projects = [] } = data;
    const hasContent =
        basics.fullName || basics.profession || basics.summary || skills.length || experience.length || projects.length;

    return (
        <div className="sticky top-8">
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/5">
                {/* Glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-600/10 via-pink-500/10 to-blue-500/10 rounded-2xl blur-xl opacity-60 -z-10" />

                {/* Header bar */}
                <div className="bg-gradient-to-r from-purple-600/20 via-pink-500/10 to-blue-500/20 px-6 py-3 border-b border-white/5">
                    <span className="text-xs font-medium text-gray-400 tracking-wider uppercase">Live Preview</span>
                </div>

                {/* Resume card */}
                <div className="p-6 min-h-[400px]">
                    {!hasContent ? (
                        <div className="flex flex-col items-center justify-center h-60 text-center">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-600">Start filling in the form to see your resume preview here.</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Name & Role */}
                            <div>
                                {basics.fullName && (
                                    <h2 className="text-xl font-bold text-white leading-tight">{basics.fullName}</h2>
                                )}
                                {basics.profession && (
                                    <p className="text-sm font-medium bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mt-0.5">
                                        {basics.profession}
                                    </p>
                                )}
                                {basics.summary && (
                                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">{basics.summary}</p>
                                )}
                            </div>

                            {/* Skills */}
                            {skills.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Skills</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {skills.map((s, i) => (
                                            <span key={i} className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-medium">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Experience */}
                            {experience.filter((e) => e.company || e.role).length > 0 && (
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Experience</h4>
                                    <div className="space-y-3">
                                        {experience
                                            .filter((e) => e.company || e.role)
                                            .map((exp, i) => (
                                                <div key={i} className="border-l-2 border-purple-500/30 pl-3">
                                                    <p className="text-sm font-semibold text-white leading-tight">
                                                        {[exp.role, exp.company].filter(Boolean).join(" — ")}
                                                    </p>
                                                    {(exp.startDate || exp.endDate) && (
                                                        <p className="text-[10px] text-gray-500 mt-0.5">
                                                            {[exp.startDate, exp.endDate].filter(Boolean).join(" – ")}
                                                        </p>
                                                    )}
                                                    {exp.description && (
                                                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{exp.description}</p>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Projects */}
                            {projects.filter((p) => p.name).length > 0 && (
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Projects</h4>
                                    <div className="space-y-3">
                                        {projects
                                            .filter((p) => p.name)
                                            .map((proj, i) => (
                                                <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                                    <div className="flex items-start gap-3">
                                                        {proj.image && (
                                                            <img src={proj.image} alt={proj.name} className="w-10 h-10 rounded-lg object-cover border border-white/10 flex-shrink-0" />
                                                        )}
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-white">{proj.name}</p>
                                                            <div className="flex gap-2 mt-0.5">
                                                                {proj.githubUrl && (
                                                                    <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-purple-400 hover:underline">
                                                                        GitHub
                                                                    </a>
                                                                )}
                                                                {proj.liveUrl && (
                                                                    <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:underline">
                                                                        Live Demo
                                                                    </a>
                                                                )}
                                                            </div>
                                                            {proj.summary && (
                                                                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{proj.summary}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
