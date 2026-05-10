import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Flame, BookOpen, Brain, Clock, Sparkles, AlertTriangle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/lib/session";
import { StatCard } from "@/components/StatCard";
import { GlowButton } from "@/components/GlowButton";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  const sessionId = typeof window !== "undefined" ? getSessionId() : "";

  const { data: streak } = useQuery({
    queryKey: ["streak", sessionId],
    queryFn: async () => {
      const { data } = await supabase
        .from("streaks")
        .select("*")
        .eq("session_id", sessionId)
        .maybeSingle();
      return data;
    },
    enabled: !!sessionId,
  });

  const { data: recent = [] } = useQuery({
    queryKey: ["recent", sessionId],
    queryFn: async () => {
      const { data } = await supabase
        .from("revisions")
        .select("id, subject, chapter, summary, created_at")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
    enabled: !!sessionId,
  });

  const { data: weak = [] } = useQuery({
    queryKey: ["weak", sessionId],
    queryFn: async () => {
      const { data } = await supabase
        .from("weak_topics")
        .select("*")
        .eq("session_id", sessionId)
        .order("mastery", { ascending: true })
        .limit(5);
      return data || [];
    },
    enabled: !!sessionId,
  });

  const total = streak?.total_revisions ?? 0;
  const streakDays = streak?.current_streak ?? 0;
  const timeSaved = total * 25; // mins
  const mastery = total ? Math.min(40 + total * 3, 95) : 0;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Welcome back.</h1>
          <p className="text-muted-foreground mt-1">Five focused minutes is all it takes today.</p>
        </div>
        <Link to="/dashboard/generate">
          <GlowButton><Sparkles className="w-4 h-4" /> New revision</GlowButton>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Flame} label="Streak" value={streakDays} suffix="days" delay={0} />
        <StatCard icon={BookOpen} label="Revisions" value={total} delay={0.05} accent="accent" />
        <StatCard icon={Brain} label="Mastery" value={mastery} suffix="%" delay={0.1} />
        <StatCard icon={Clock} label="Time saved" value={timeSaved} suffix="min" delay={0.15} accent="accent" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        {/* Weak topics */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card-strong p-6 lg:col-span-1"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-accent" />
            <h2 className="font-display font-semibold">Weak topics</h2>
          </div>
          {weak.length === 0 ? (
            <p className="text-sm text-muted-foreground">No weak topics yet. Generate a few revisions and Recall5 will start tracking.</p>
          ) : (
            <div className="space-y-3">
              {weak.map((w) => (
                <div key={w.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground">{w.topic}</span>
                    <span className="text-muted-foreground">{w.mastery}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full"
                      style={{
                        width: `${w.mastery}%`,
                        background: w.mastery < 40 ? "linear-gradient(90deg, oklch(0.7 0.22 20), oklch(0.78 0.18 320))"
                          : "var(--gradient-primary)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent revisions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass-card-strong p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold">Recent revisions</h2>
            <Link to="/dashboard/history" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-sm">No revisions yet.</div>
              <Link to="/dashboard/generate" className="inline-block mt-4">
                <GlowButton><Sparkles className="w-4 h-4" /> Create your first</GlowButton>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recent.map((r) => (
                <Link
                  key={r.id}
                  to="/dashboard/history"
                  className="flex items-center gap-3 py-3 hover:bg-white/5 -mx-2 px-2 rounded-lg transition"
                >
                  <div className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-primary">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{r.subject} · {r.chapter}</div>
                    <div className="text-xs text-muted-foreground truncate">{r.summary.replace(/[#*`]/g, "").slice(0, 90)}</div>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">
                    {new Date(r.created_at).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}