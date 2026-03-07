import { cn } from "../../lib/utils";
import { cva } from "class-variance-authority";

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                default: "bg-white/10 text-gray-300 border border-white/10",
                primary: "bg-purple-500/20 text-purple-300 border border-purple-500/20",
                success: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20",
                warning: "bg-amber-500/20 text-amber-300 border border-amber-500/20",
                danger: "bg-red-500/20 text-red-300 border border-red-500/20",
                pro: "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export function Badge({ className, variant, ...props }) {
    return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
