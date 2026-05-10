import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/lib/session";
import { RevisionResult, type Revision } from "@/components/RevisionResult";

export const Route = createFileRoute("/dashboard/history")({
  head: () => ({
    meta: [
      { title: "Revision History — Recall5 AI" },
      { name: "description", content: "Every revision pack you have generated, instantly searchable." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [open, setOpen] = useState<Revision | null>(null);

  const sessionId = typeof window !== "undefined" ? getSessionId() : "";

  const { data: revisions = [], isLoading } = useQuery({
    queryKey: ["history", sessionId],
    queryFn: async () => {
      const { data } = await supabase
        .from("revisions")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false });
      return (data || []) as unknown as Revision[];
    },
    enabled: !!sessionId,
  });

  const subjects = useMemo(
    () => Array.from(new Set(revisions.map((r) => r.subject))).slice(0, 8),
    [revisions],
  );

  const filtered = revisions.filter((r) => {
    if (filter && r.subject !== filter) return false;
    if (!q) return true;
    const t = q.toLowerCase();
    return (
      r.subject.toLowerCase().includes(t) ||
      r.chapter.toLowerCase().includes(t) ||
      r.summary.toLowerCase().includes(t)
    );
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-accent">Library</div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Revision history</h1>
      </div>

      <div className="glass-card-strong p-3 flex flex-wrap items-center gap-2 mb-6">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search subject, chapter or content…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-primary/60 transition text-sm"
          />
        </div>
        {subjects.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter(null)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${!filter ? "bg-white/10 border-white/20 text-foreground" : "border-white/10 text-muted-foreground hover:text-foreground"}`}
            >
              All
            </button>
            {subjects.map((s) => (
              <button key={s}
                onClick={() => setFilter(s)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${filter === s ? "bg-white/10 border-white/20 text-foreground" : "border-white/10 text-muted-foreground hover:text-foreground"}`}
              >{s}</button>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-5 h-40 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card-strong p-12 text-center text-muted-foreground">
          No revisions found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r, i) => (
            <motion.button
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setOpen(r)}
              className="glass-card-strong p-5 text-left hover:glow-ring transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5" />
                {r.subject}
              </div>
              <div className="font-display font-semibold text-lg mt-2">{r.chapter}</div>
              <div className="text-sm text-muted-foreground mt-2 line-clamp-3">
                {r.summary.replace(/[#*`>]/g, "").slice(0, 160)}
              </div>
              <div className="text-xs text-muted-foreground mt-3">
                {r.created_at && new Date(r.created_at).toLocaleString()}
              </div>
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
              transition={{ type: "spring", damping: 28 }}
              className="w-full md:max-w-2xl h-full overflow-y-auto bg-background/95 border-l border-white/10 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-xs uppercase tracking-widest text-accent">{open.subject}</div>
                  <h2 className="font-display text-2xl font-bold mt-1">{open.chapter}</h2>
                </div>
                <button onClick={() => setOpen(null)} className="p-2 rounded-lg hover:bg-white/5">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <RevisionResult r={open} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}