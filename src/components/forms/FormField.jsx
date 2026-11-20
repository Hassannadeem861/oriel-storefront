import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Label + control + error/hint wiring with correct ARIA attributes.
 * `children` is a render function receiving the props for the control.
 */
export default function FormField({ id, label, error, hint, className, optional, children }) {
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("grid gap-2", className)}>
      {label && (
        <Label htmlFor={id}>
          {label}
          {optional && <span className="ml-1 font-normal text-muted-foreground">(optional)</span>}
        </Label>
      )}
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-[12px] text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-[12px] font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}
