export default function BasicInfoForm({ data, onChange }) {
    const update = (field) => (e) => onChange({ ...data, [field]: e.target.value });

    return (
        <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
            <p className="text-sm text-gray-500 -mt-3">Tell us about yourself.</p>

            <div>
                <label htmlFor="fullName" className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                    Full Name <span className="text-pink-400">*</span>
                </label>
                <input
                    id="fullName"
                    type="text"
                    value={data.fullName || ""}
                    onChange={update("fullName")}
                    placeholder="John Doe"
                    className="w-full rounded-xl bg-gray-900/60 border border-white/10 text-gray-100 placeholder-gray-600 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                />
            </div>

            <div>
                <label htmlFor="profession" className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                    Profession / Role
                </label>
                <input
                    id="profession"
                    type="text"
                    value={data.profession || ""}
                    onChange={update("profession")}
                    placeholder="Full-Stack Developer"
                    className="w-full rounded-xl bg-gray-900/60 border border-white/10 text-gray-100 placeholder-gray-600 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                />
            </div>

            <div>
                <label htmlFor="summary" className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                    Work Summary / Bio
                </label>
                <textarea
                    id="summary"
                    rows={4}
                    value={data.summary || ""}
                    onChange={update("summary")}
                    placeholder="A brief overview of your professional background..."
                    className="w-full rounded-xl bg-gray-900/60 border border-white/10 text-gray-100 placeholder-gray-600 text-sm px-4 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                />
            </div>
        </div>
    );
}
