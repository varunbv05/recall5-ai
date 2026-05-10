import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Sparkles, History, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Overview", icon: Home, exact: true },
  { to: "/dashboard/generate", label: "Generate", icon: Sparkles },
  { to: "/dashboard/history", label: "History", icon: History },
];

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col gap-2 p-4 sticky top-0 h-screen">
      <Link to="/" className="flex items-center gap-2 px-3 py-4">
        <div className="w-9 h-9 rounded-xl glow-button flex items-center justify-center">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <div className="font-display font-bold text-lg leading-none">Recall5<span className="gradient-text">AI</span></div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">5-min revisions</div>
        </div>
      </Link>
      <nav className="mt-4 flex flex-col gap-1">
        {items.map((it) => {
          const active = it.exact ? path === it.to : path.startsWith(it.to);
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                active
                  ? "glass-card-strong text-foreground glow-ring"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5",
              )}
            >
              <it.icon className="w-4 h-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto glass-card p-4 text-xs text-muted-foreground">
        <div className="font-display text-foreground mb-1">AI tip</div>
        Upload handwritten notes — Recall5 reads them and turns them into instant revision packs.
      </div>
    </aside>
  );
}