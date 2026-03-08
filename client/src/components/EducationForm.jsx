import { Plus, Trash2, GraduationCap } from "lucide-react";
import { Button } from "./ui/Button";

export default function EducationForm({ data, onChange }) {
    const add = () => onChange([...data, { school: "", degree: "", field: "", startDate: "", endDate: "" }]);
    const remove = (i) => onChange(data.filter((_, idx) => idx !== i));
    const update = (i, field) => (e) => {
        const copy = [...data];
        copy[i] = { ...copy[i], [field]: e.target.value };
        onChange(copy);
    };

    const inputClass = "w-full rounded-xl bg-white/5 border border-white/10 text-gray-100 placeholder-gray-600 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-400/50 transition-all duration-300";

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-violet-400" /> Education
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">Add your educational background.</p>
                </div>
                <Button variant="outline" size="sm" onClick={add}>
                    <Plus className="w-3.5 h-3.5" /> Add
                </Button>
            </div>

            {data.length === 0 && (
                <div className="text-center py-8 text-gray-600 text-sm">
                    No education added yet. Click "Add" to get started.
                </div>
            )}

            {data.map((ed, i) => (
                <div key={i} className="relative p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                    <button
                        onClick={() => remove(i)}
                        className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <input value={ed.school || ""} onChange={update(i, "school")} placeholder="School / University" className={inputClass} />

                    <div className="grid grid-cols-2 gap-3">
                        <input value={ed.degree || ""} onChange={update(i, "degree")} placeholder="Degree (e.g. BSc)" className={inputClass} />
                        <input value={ed.field || ""} onChange={update(i, "field")} placeholder="Field of Study" className={inputClass} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <input type="month" value={ed.startDate || ""} onChange={update(i, "startDate")} className={inputClass} />
                        <input type="month" value={ed.endDate || ""} onChange={update(i, "endDate")} className={inputClass} />
                    </div>
                </div>
            ))}
        </div>
    );
}
