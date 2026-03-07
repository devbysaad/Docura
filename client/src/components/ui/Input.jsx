import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Input = forwardRef(({ className, type = "text", label, error, ...props }, ref) => {
    return (
        <div className="space-y-1.5">
            {label && (
                <label className="block text-xs font-medium text-gray-400 ml-1">
                    {label}
                </label>
            )}
            <input
                type={type}
                className={cn(
                    "w-full rounded-xl bg-gray-900/60 border border-white/10 text-gray-100 placeholder-gray-600 text-sm px-4 py-2.5",
                    "focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50",
                    "transition-all duration-300",
                    error && "border-red-500/50 focus:ring-red-500/50",
                    className
                )}
                ref={ref}
                {...props}
            />
            {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
        </div>
    );
});

Input.displayName = "Input";

const Textarea = forwardRef(({ className, label, error, ...props }, ref) => {
    return (
        <div className="space-y-1.5">
            {label && (
                <label className="block text-xs font-medium text-gray-400 ml-1">
                    {label}
                </label>
            )}
            <textarea
                className={cn(
                    "w-full rounded-xl bg-gray-900/60 border border-white/10 text-gray-100 placeholder-gray-600 text-sm px-4 py-2.5 resize-none",
                    "focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50",
                    "transition-all duration-300",
                    error && "border-red-500/50 focus:ring-red-500/50",
                    className
                )}
                ref={ref}
                {...props}
            />
            {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
        </div>
    );
});

Textarea.displayName = "Textarea";

export { Input, Textarea };
