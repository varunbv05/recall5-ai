import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  accent = "primary",
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  accent?: "primary" | "accent";
  delay?: number;
}) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.floor(v).toLocaleString());

  useEffect(() => {
    const c = animate(mv, value, { duration: 1.2, delay, ease: "easeOut" });
    return () => c.stop();
  }, [value, mv, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card-strong p-5 relative overflow-hidden group"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"
        style={{
          background: accent === "primary"
            ? "var(--gradient-primary)"
            : "radial-gradient(circle, oklch(0.78 0.16 210 / 0.7), transparent 60%)",
        }}
      />
      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <motion.span className="text-4xl font-display font-bold text-foreground">
          {rounded}
        </motion.span>
        {suffix && <span className="text-muted-foreground text-sm">{suffix}</span>}
      </div>
    </motion.div>
  );
}