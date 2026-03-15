import { useState } from "react";
import useResumeStore from "../store/resumeStore";
import { Button } from "./ui/Button";
import { Plus, Trash2, GripVertical } from "lucide-react";

export default function CustomSectionForm() {
    const { resumeData, addCustomSection, removeCustomSection, updateCustomSection } = useResumeStore();
    const customSections = resumeData.customSections || [];
    const [newTitle, setNewTitle] = useState("");

    function handleAdd() {
        if (!newTitle.trim()) return;
        addCustomSection({ title: newTitle.trim(), items: [""] });
        setNewTitle("");
    }

    function handleItemChange(secIndex, itemIndex, value) {
        const section = { ...customSections[secIndex] };
        const items = [...section.items];
        items[itemIndex] = value;
        updateCustomSection(secIndex, { ...section, items });
    }

    function addItem(secIndex) {
        const section = { ...customSections[secIndex] };
        updateCustomSection(secIndex, { ...section, items: [...section.items, ""] });
    }

    function removeItem(secIndex, itemIndex) {
        const section = { ...customSections[secIndex] };
        const items = section.items.filter((_, i) => i !== itemIndex);
        updateCustomSection(secIndex, { ...section, items });
    }

    return (
        <div className="space-y-6 animate-in">
            <div>
                <h2 className="text-xl font-bold text-white mb-1">Custom Sections</h2>
                <p className="text-sm text-gray-500">Add custom sections like Certifications, Publications, Volunteer Work, etc.</p>
            </div>

            {/* Existing custom sections */}
            {customSections.map((section, secIndex) => (
                <div key={secIndex} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-gray-600" />
                            <h3 className="text-sm font-semibold text-white">{section.title}</h3>
                        </div>
                        <Button variant="danger" size="sm" onClick={() => removeCustomSection(secIndex)}>
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>

                    {section.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={item}
                                onChange={(e) => handleItemChange(secIndex, itemIndex, e.target.value)}
                                placeholder={`${section.title} item ${itemIndex + 1}`}
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20"
                            />
                            {section.items.length > 1 && (
                                <button
                                    onClick={() => removeItem(secIndex, itemIndex)}
                                    className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        onClick={() => addItem(secIndex)}
                        className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                        <Plus className="w-3 h-3" /> Add item
                    </button>
                </div>
            ))}

            {/* Add new section */}
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Section name (e.g. Certifications)"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20"
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
                <Button variant="primary" onClick={handleAdd} disabled={!newTitle.trim()}>
                    <Plus className="w-4 h-4" /> Add Section
                </Button>
            </div>
        </div>
    );
}
