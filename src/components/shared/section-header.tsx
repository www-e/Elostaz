import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("text-center mb-10", className)}>
      <h2 className="text-3xl font-bold text-foreground font-heading">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-muted-foreground text-lg">{subtitle}</p>
      )}
    </div>
  );
}
