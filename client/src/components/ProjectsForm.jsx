export default function ProjectsForm({ data, onChange }) {
    const projects = data || [];

    const addProject = () => {
        onChange([
            ...projects,
            { name: "", image: "", githubUrl: "", liveUrl: "", summary: "" },
        ]);
    };

    const removeProject = (index) => {
        onChange(projects.filter((_, i) => i !== index));
    };

    const updateField = (index, field) => (e) => {
        const updated = projects.map((proj, i) =>
            i === index ? { ...proj, [field]: e.target.value } : proj
        );
        onChange(updated);
    };

    const handleImageUpload = (index) => (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const updated = projects.map((proj, i) =>
                i === index ? { ...proj, image: reader.result } : proj
            );
            onChange(updated);
        };
        reader.readAsDataURL(file);
    };

    const inputClass =
        "w-full rounded-xl bg-gray-900/60 border border-white/10 text-gray-100 placeholder-gray-600 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300";

    return (
        <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white">Projects</h3>
            <p className="text-sm text-gray-500 -mt-3">Showcase your best work.</p>

            {projects.map((proj, i) => (
                <div
                    key={i}
                    className="relative p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-3"
                >
                    <button
                        type="button"
                        onClick={() => removeProject(i)}
                        className="absolute top-3 right-3 text-gray-600 hover:text-red-400 transition-colors"
                        aria-label="Remove project"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Project Name</label>
                        <input type="text" value={proj.name} onChange={updateField(i, "name")} placeholder="My Awesome Project" className={inputClass} />
                    </div>

                    {/* Image upload */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Project Image</label>
                        <div className="flex items-center gap-3">
                            {proj.image && (
                                <img src={proj.image} alt="preview" className="w-16 h-16 rounded-lg object-cover border border-white/10" />
                            )}
                            <label className="cursor-pointer px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs hover:border-purple-500/40 hover:text-purple-400 transition-all">
                                {proj.image ? "Change image" : "Upload image"}
                                <input type="file" accept="image/*" onChange={handleImageUpload(i)} className="hidden" />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">GitHub URL <span className="text-gray-600">(optional)</span></label>
                            <input type="url" value={proj.githubUrl} onChange={updateField(i, "githubUrl")} placeholder="https://github.com/..." className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Live URL <span className="text-gray-600">(optional)</span></label>
                            <input type="url" value={proj.liveUrl} onChange={updateField(i, "liveUrl")} placeholder="https://myproject.com" className={inputClass} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Summary / Description</label>
                        <textarea rows={3} value={proj.summary} onChange={updateField(i, "summary")} placeholder="What does this project do?" className={`${inputClass} resize-none`} />
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addProject}
                className="w-full py-2.5 rounded-xl border border-dashed border-white/10 text-gray-500 text-sm hover:border-purple-500/40 hover:text-purple-400 transition-all duration-300"
            >
                + Add Project
            </button>
        </div>
    );
}
