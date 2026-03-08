import { cn } from "../../lib/utils";

export function Card({ className, children, glow = false, ...props }) {
    return (
        <div
            className={cn(
                "relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl",
                glow && "border-violet-500/20 shadow-violet-500/5",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }) {
    return (
        <div className={cn("px-6 pt-6 pb-2", className)} {...props}>
            {children}
        </div>
    );
}

export function CardContent({ className, children, ...props }) {
    return (
        <div className={cn("px-6 py-4", className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ className, children, ...props }) {
    return (
        <div className={cn("px-6 pb-6 pt-2", className)} {...props}>
            {children}
        </div>
    );
}
