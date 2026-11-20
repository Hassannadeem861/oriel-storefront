import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn("flex flex-col items-center rounded-3xl border border-dashed border-line bg-paper/60 px-6 py-16 text-center", className)}>
      {Icon && (
        <span className="mb-5 grid size-14 place-items-center rounded-full bg-sand text-ink">
          <Icon className="size-6" aria-hidden="true" />
        </span>
      )}
      <h2 className="font-display text-3xl">{title}</h2>
      {description && <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>}
      {action && (
        <Button asChild className="mt-6">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
