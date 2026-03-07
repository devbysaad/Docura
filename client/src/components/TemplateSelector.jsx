import { templates } from "../templates";
import { cn } from "../lib/utils";
import { Check } from "lucide-react";

export default function TemplateSelector({ selected, onSelect }) {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400">Choose Template</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {templates.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => onSelect(t.id)}
                        className={cn(
                            "relative group rounded-xl overflow-hidden border-2 transition-all duration-200 text-left",
                            selected === t.id
                                ? "border-purple-500 ring-2 ring-purple-500/30"
                                : "border-white/10 hover:border-white/20"
                        )}
                    >
                        <div className={cn("h-24 w-full", t.preview)} />
                        <div className="p-2.5 bg-gray-900/80">
                            <p className="text-xs font-medium text-white truncate">{t.name}</p>
                            <p className="text-xs text-gray-500 truncate">{t.description}</p>
                        </div>
                        {selected === t.id && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
