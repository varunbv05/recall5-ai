import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { BookOpen, Lightbulb, Sigma, Zap, GraduationCap } from "lucide-react";

export type Revision = {
  id: string;
  subject: string;
  chapter: string;
  summary: string;
  key_concepts: { term: string; definition: string }[];
  formulas: { name: string; expression: string; note?: string }[];
  rapid_fire: { q: string; a: string }[];
  exam_questions: string[];
  created_at?: string;
};

const Section = ({
  icon: Icon,
  title,
  children,
  delay = 0,
}: {
  icon: typeof BookOpen;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.section
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="glass-card-strong p-6"
  >
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-primary">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="font-display font-semibold text-lg">{title}</h3>
    </div>
    {children}
  </motion.section>
);

export function RevisionResult({ r }: { r: Revision }) {
  return (
    <div className="space-y-5">
      <Section icon={BookOpen} title="5-Minute Summary" delay={0}>
        <div className="markdown-body text-muted-foreground leading-relaxed space-y-3 text-sm
          [&_h1]:text-foreground [&_h1]:font-display [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:mt-2
          [&_h2]:text-foreground [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-2
          [&_h3]:text-foreground [&_h3]:font-display [&_h3]:font-semibold
          [&_strong]:text-foreground [&_em]:text-foreground/90
          [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1
          [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-white/5 [&_code]:text-accent">
          <ReactMarkdown>{r.summary}</ReactMarkdown>
        </div>
      </Section>

      <Section icon={Lightbulb} title="Key Concepts" delay={0.05}>
        <div className="grid sm:grid-cols-2 gap-3">
          {r.key_concepts.map((c, i) => (
            <div key={i} className="glass-card p-4">
              <div className="font-display font-semibold text-foreground">{c.term}</div>
              <div className="text-sm text-muted-foreground mt-1">{c.definition}</div>
            </div>
          ))}
        </div>
      </Section>

      {r.formulas.length > 0 && (
        <Section icon={Sigma} title="Formulas" delay={0.1}>
          <div className="space-y-2">
            {r.formulas.map((f, i) => (
              <div key={i} className="glass-card p-4 flex flex-wrap items-baseline gap-3">
                <span className="text-foreground font-medium">{f.name}</span>
                <code className="px-3 py-1 rounded-md bg-white/5 text-accent font-mono text-sm">
                  {f.expression}
                </code>
                {f.note && <span className="text-xs text-muted-foreground">{f.note}</span>}
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section icon={Zap} title="Rapid-Fire Questions" delay={0.15}>
        <div className="space-y-2">
          {r.rapid_fire.map((q, i) => (
            <details key={i} className="glass-card p-4 group">
              <summary className="cursor-pointer font-medium flex items-center gap-2">
                <span className="text-primary">Q{i + 1}.</span> {q.q}
              </summary>
              <div className="mt-2 text-sm text-muted-foreground">{q.a}</div>
            </details>
          ))}
        </div>
      </Section>

      <Section icon={GraduationCap} title="Likely Exam Questions" delay={0.2}>
        <ol className="space-y-2 list-decimal list-inside text-muted-foreground">
          {r.exam_questions.map((q, i) => (
            <li key={i} className="glass-card p-3 list-none">
              <span className="text-primary font-mono mr-2">{String(i + 1).padStart(2, "0")}.</span>
              <span className="text-foreground">{q}</span>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}