import { useState } from "react";

export default function SkillsForm({ data, onChange }) {
    const [input, setInput] = useState("");
    const skills = data || [];

    const addSkill = () => {
        const trimmed = input.trim();
        if (trimmed && !skills.includes(trimmed)) {
            onChange([...skills, trimmed]);
            setInput("");
        }
    };

    const removeSkill = (index) => {
        onChange(skills.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill();
        }
    };

    return (
        <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white">Skills</h3>
            <p className="text-sm text-gray-500 -mt-3">Add your key skills.</p>

            <div className="flex gap-2">
                <input
                    id="skill-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. React, Node.js, Python"
                    className="flex-1 rounded-xl bg-white/5 border border-white/[0.08] text-gray-100 placeholder-gray-600 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-300"
                />
                <button
                    type="button"
                    onClick={addSkill}
                    className="px-5 py-2.5 rounded-xl bg-accent text-black text-sm font-semibold hover:bg-accent-hover transition-colors duration-200"
                >
                    Add
                </button>
            </div>

            {/* Skill chips */}
            <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                    <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium group"
                    >
                        {skill}
                        <button
                            type="button"
                            onClick={() => removeSkill(i)}
                            className="opacity-50 hover:opacity-100 transition-opacity"
                            aria-label={`Remove ${skill}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </span>
                ))}
            </div>

            {skills.length === 0 && (
                <p className="text-xs text-gray-600 italic">No skills added yet. Type and press Enter or click Add.</p>
            )}
        </div>
    );
}
