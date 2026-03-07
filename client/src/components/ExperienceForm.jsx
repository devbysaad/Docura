export default function ExperienceForm({ data, onChange }) {
    const experiences = data || [];

    const addExperience = () => {
        onChange([
            ...experiences,
            { company: "", role: "", startDate: "", endDate: "", description: "" },
        ]);
    };

    const removeExperience = (index) => {
        onChange(experiences.filter((_, i) => i !== index));
    };

    const updateField = (index, field) => (e) => {
        const updated = experiences.map((exp, i) =>
            i === index ? { ...exp, [field]: e.target.value } : exp
        );
        onChange(updated);
    };

    const inputClass =
        "w-full rounded-xl bg-gray-900/60 border border-white/10 text-gray-100 placeholder-gray-600 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300";

    return (
        <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white">Work Experience</h3>
            <p className="text-sm text-gray-500 -mt-3">Add your professional experience.</p>

            {experiences.map((exp, i) => (
                <div
                    key={i}
                    className="relative p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-3"
                >
                    {/* Remove button */}
                    <button
                        type="button"
                        onClick={() => removeExperience(i)}
                        className="absolute top-3 right-3 text-gray-600 hover:text-red-400 transition-colors"
                        aria-label="Remove experience"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Company</label>
                            <input type="text" value={exp.company} onChange={updateField(i, "company")} placeholder="Company name" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Role / Position</label>
                            <input type="text" value={exp.role} onChange={updateField(i, "role")} placeholder="Software Engineer" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Start Date</label>
                            <input type="text" value={exp.startDate} onChange={updateField(i, "startDate")} placeholder="Jan 2022" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">End Date</label>
                            <input type="text" value={exp.endDate} onChange={updateField(i, "endDate")} placeholder="Present" className={inputClass} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Description</label>
                        <textarea rows={3} value={exp.description} onChange={updateField(i, "description")} placeholder="What did you accomplish?" className={`${inputClass} resize-none`} />
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addExperience}
                className="w-full py-2.5 rounded-xl border border-dashed border-white/10 text-gray-500 text-sm hover:border-purple-500/40 hover:text-purple-400 transition-all duration-300"
            >
                + Add Experience
            </button>
        </div>
    );
}
