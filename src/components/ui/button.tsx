import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-bold transition-all disabled:opacity-50 disabled:pointer-events-none",
          variant === "default" && "bg-[#3d302c] text-white hover:bg-[#2c221f] shadow-sm",
          variant === "outline" && "border border-[#eaded8] bg-white text-[#3d302c] hover:bg-[#fbf1ec]",
          variant === "secondary" && "bg-[#f8f6ef] text-[#3d302c] hover:bg-[#ede5dc]",
          variant === "ghost" && "hover:bg-[#fbf1ec] text-[#3d302c]",
          variant === "destructive" && "bg-red-600 text-white hover:bg-red-700",
          size === "default" && "h-9 px-4 py-2 text-xs",
          size === "sm" && "h-8 px-3 text-xs",
          size === "lg" && "h-11 px-6 text-sm",
          size === "icon" && "h-9 w-9 p-0",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
