import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { Home, Sparkles, History } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Recall5 AI" },
      { name: "description", content: "Your study dashboard: streak, weak topics, and recent revisions." },
    ],
  }),
  component: DashboardLayout,
});

const mobile = [
  { to: "/dashboard", label: "Home", icon: Home, exact: true },
  { to: "/dashboard/generate", label: "Generate", icon: Sparkles },
  { to: "/dashboard/history", label: "History", icon: History },
];

function DashboardLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 md:px-10 py-6 pb-28 md:pb-10">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 glass-card-strong rounded-2xl p-2 flex items-center justify-around z-30">
        {mobile.map((it) => {
          const active = it.exact ? path === it.to : path.startsWith(it.to);
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-[10px]",
                active ? "text-foreground bg-white/10" : "text-muted-foreground",
              )}
            >
              <it.icon className="w-5 h-5" />
              {it.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}