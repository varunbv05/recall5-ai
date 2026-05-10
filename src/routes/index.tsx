import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles, Brain, Zap, FileText, Lightbulb, Sigma, GraduationCap,
  Upload, ArrowRight, Github, Star,
} from "lucide-react";
import { GlowButton } from "@/components/GlowButton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Recall5 AI — Master any subject in 5 minutes" },
      { name: "description", content: "Turn dense study notes, PDFs and handwritten pages into a 5-minute revision pack with concepts, formulas, rapid-fire Q&A and exam predictions." },
      { property: "og:title", content: "Recall5 AI — Master any subject in 5 minutes" },
      { property: "og:description", content: "AI-generated revision packs for students." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Sparkles, title: "5-min summaries", desc: "Distill an entire chapter into a sharp, exam-ready brief." },
  { icon: Lightbulb, title: "Key concepts", desc: "Auto-extracted definitions you actually need to remember." },
  { icon: Sigma, title: "Formula sheet", desc: "Every equation, derivation and unit on one screen." },
  { icon: Zap, title: "Rapid-fire Q&A", desc: "Active recall drills tuned to spaced repetition." },
  { icon: GraduationCap, title: "Exam predictions", desc: "Likely questions modelled from past patterns." },
  { icon: Upload, title: "Multimodal upload", desc: "PDFs, slides, handwritten notes — drop them in." },
];

const steps = [
  { n: "01", t: "Paste or upload", d: "Notes, PDFs, photos of your handwritten pages — anything." },
  { n: "02", t: "Recall5 thinks", d: "Multimodal AI parses, structures and compresses." },
  { n: "03", t: "Revise in 5 minutes", d: "Open the pack, drill the questions, ace the exam." },
];

function Landing() {
  return (
    <div className="min-h-screen relative noise-overlay">
      {/* Nav */}
      <header className="sticky top-4 z-40 mx-auto max-w-6xl px-4">
        <div className="glass-card-strong rounded-full px-4 py-2 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg glow-button flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
            <span className="font-display font-bold">Recall5<span className="gradient-text">AI</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#how" className="hover:text-foreground transition">How it works</a>
            <a href="#stats" className="hover:text-foreground transition">Why students love it</a>
          </nav>
          <Link to="/dashboard">
            <GlowButton size="sm">
              Open app <ArrowRight className="w-4 h-4" />
            </GlowButton>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-24 md:pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass-card px-3 py-1.5 text-xs text-muted-foreground"
          >
            <Star className="w-3.5 h-3.5 text-accent" />
            Powered by multimodal AI — text, PDF & handwriting
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-6 text-5xl md:text-7xl font-display font-bold tracking-tight"
          >
            Master any subject<br />
            <span className="gradient-text">in 5 minutes.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-2xl mx-auto text-muted-foreground text-lg"
          >
            Recall5 AI turns your messy notes, PDFs and handwritten pages into a
            premium revision pack — concepts, formulas, rapid-fire Q&A and exam
            predictions. Calm, focused, fast.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/dashboard/generate">
              <GlowButton size="lg">
                <Sparkles className="w-4 h-4" />
                Generate your first revision
              </GlowButton>
            </Link>
            <Link to="/dashboard">
              <GlowButton size="lg" variant="ghost">
                See dashboard <ArrowRight className="w-4 h-4" />
              </GlowButton>
            </Link>
          </motion.div>

          {/* Mock dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="mt-20 glass-card-strong p-3 rounded-3xl glow-ring max-w-4xl mx-auto"
          >
            <div className="rounded-2xl bg-black/30 p-6 grid md:grid-cols-3 gap-4">
              {[
                { l: "Streak", v: "12 days", c: "from-fuchsia-500 to-purple-500" },
                { l: "Revisions", v: "47", c: "from-cyan-400 to-blue-500" },
                { l: "Mastery", v: "82%", c: "from-violet-500 to-pink-500" },
              ].map((s, i) => (
                <div key={i} className="glass-card p-4 text-left">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
                  <div className={`mt-2 text-3xl font-display font-bold bg-gradient-to-br ${s.c} bg-clip-text text-transparent`}>
                    {s.v}
                  </div>
                </div>
              ))}
              <div className="md:col-span-3 glass-card p-4 text-left">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText className="w-3.5 h-3.5" /> Physics · Electromagnetic Induction
                </div>
                <div className="mt-2 font-display text-foreground">Faraday's law and Lenz's law summary</div>
                <div className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  EMF induced equals the negative rate of change of magnetic flux. Direction opposes change…
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-widest text-accent">Features</div>
          <h2 className="mt-2 text-3xl md:text-5xl font-display font-bold">Built for the night before the exam.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass-card-strong p-6 hover:glow-ring transition-all"
            >
              <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-primary">
                <f.icon className="w-5 h-5" />
              </div>
              <div className="mt-4 font-display font-semibold text-lg">{f.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-widest text-accent">How it works</div>
          <h2 className="mt-2 text-3xl md:text-5xl font-display font-bold">Three steps. Zero friction.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 relative">
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-px"
            style={{ background: "linear-gradient(90deg, transparent, oklch(0.68 0.24 295 / 0.6), oklch(0.78 0.16 210 / 0.6), transparent)" }} />
          {steps.map((s, i) => (
            <motion.div key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-strong p-6 relative">
              <div className="text-5xl font-display font-bold gradient-text">{s.n}</div>
              <div className="mt-2 font-display text-xl">{s.t}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.d}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="max-w-6xl mx-auto px-4 py-20">
        <div className="glass-card-strong p-10 grid md:grid-cols-4 gap-6 text-center">
          {[
            { v: "5×", l: "Faster revision" },
            { v: "92%", l: "Recall after 24h" },
            { v: "10k+", l: "Revisions generated" },
            { v: "4.9", l: "Student rating" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-4xl md:text-5xl font-display font-bold gradient-text">{s.v}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA + Footer */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-4xl md:text-6xl font-display font-bold">Stop re-reading.<br /><span className="gradient-text">Start recalling.</span></h2>
        <div className="mt-8">
          <Link to="/dashboard/generate">
            <GlowButton size="lg"><Sparkles className="w-4 h-4" /> Try Recall5 AI free</GlowButton>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/50 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Recall5 AI · Built with Lovable
      </footer>
    </div>
  );
}
