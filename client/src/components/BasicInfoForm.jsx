export default function BasicInfoForm({ data, onChange }) {
    const update = (field) => (e) => onChange({ ...data, [field]: e.target.value });

    const inputClass = "w-full rounded-xl bg-gray-900/60 border border-white/10 text-gray-100 placeholder-gray-600 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300";

    return (
        <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white">Personal Information</h3>
            <p className="text-sm text-gray-500 -mt-3">Tell us about yourself.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="fullName" className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                        Full Name <span className="text-pink-400">*</span>
                    </label>
                    <input id="fullName" type="text" value={data.fullName || ""} onChange={update("fullName")} placeholder="John Doe" className={inputClass} />
                </div>
                <div>
                    <label htmlFor="profession" className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                        Job Title
                    </label>
                    <input id="profession" type="text" value={data.profession || ""} onChange={update("profession")} placeholder="Full-Stack Developer" className={inputClass} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                        Email
                    </label>
                    <input id="email" type="email" value={data.email || ""} onChange={update("email")} placeholder="john@example.com" className={inputClass} />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                        Phone
                    </label>
                    <input id="phone" type="tel" value={data.phone || ""} onChange={update("phone")} placeholder="+1 (555) 000-0000" className={inputClass} />
                </div>
            </div>

            <div>
                <label htmlFor="location" className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                    Location
                </label>
                <input id="location" type="text" value={data.location || ""} onChange={update("location")} placeholder="San Francisco, CA" className={inputClass} />
            </div>

            <div>
                <label htmlFor="summary" className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                    Professional Summary
                </label>
                <textarea id="summary" rows={4} value={data.summary || ""} onChange={update("summary")} placeholder="A brief overview of your professional background..." className={`${inputClass} resize-none`} />
            </div>
        </div>
    );
}
