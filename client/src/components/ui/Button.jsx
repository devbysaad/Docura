import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
    {
        variants: {
            variant: {
                default: "bg-white/10 text-white border border-white/10 hover:bg-white/20",
                primary: "bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-500/25",
                outline: "border border-white/20 text-gray-300 hover:bg-white/5 hover:text-white",
                ghost: "text-gray-400 hover:bg-white/5 hover:text-white",
                danger: "bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30",
                success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/30",
            },
            size: {
                default: "h-10 px-5 py-2",
                sm: "h-8 px-3 text-xs",
                lg: "h-12 px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});

Button.displayName = "Button";

export { Button, buttonVariants };
