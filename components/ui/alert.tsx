// src/components/ui/alert.tsx
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AlertProps {
  variant?: 'default' | 'destructive';
  className?: string;
  children: ReactNode;
}

export function Alert({ 
  variant = 'default', 
  className,
  children 
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
        variant === 'destructive' && "border-red-500/50 text-red-600 dark:border-red-500/50 dark:text-red-500",
        variant === 'default' && "bg-background text-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AlertDescription({
  className,
  children
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("text-sm [&_p]:leading-relaxed", className)}>
      {children}
    </div>
  );
}