import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({ title, subtitle, align = "center", className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-12", align === "center" && "text-center", className)}>
      <h2 className="text-3xl font-bold text-navy sm:text-4xl">{title}</h2>
      <div className={cn(
        "mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-electric-blue to-cyan",
        align === "center" && "mx-auto"
      )} />
      {subtitle && (
        <p className="mt-4 max-w-2xl text-muted-foreground sm:text-lg" style={align === "center" ? { margin: "1rem auto 0" } : undefined}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
