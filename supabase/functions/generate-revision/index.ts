// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Recall5 AI, an elite study coach. You produce concise, exam-ready 5-minute revisions. Be precise, structured, and ruthless about cutting fluff. Use clear academic tone. When formulas are involved, render them in plain text or LaTeX-friendly notation.`;

const tool = {
  type: "function",
  function: {
    name: "build_revision",
    description: "Return a structured 5-minute revision pack",
    parameters: {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description:
            "A markdown 5-minute revision summary (300-500 words) covering the chapter clearly with headings and bullets.",
        },
        key_concepts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              term: { type: "string" },
              definition: { type: "string" },
            },
            required: ["term", "definition"],
          },
        },
        formulas: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              expression: { type: "string" },
              note: { type: "string" },
            },
            required: ["name", "expression"],
          },
        },
        rapid_fire: {
          type: "array",
          description: "8-12 short Q/A pairs for rapid recall",
          items: {
            type: "object",
            properties: {
              q: { type: "string" },
              a: { type: "string" },
            },
            required: ["q", "a"],
          },
        },
        exam_questions: {
          type: "array",
          description: "5-7 likely exam questions, mix of short and long",
          items: { type: "string" },
        },
      },
      required: [
        "summary",
        "key_concepts",
        "formulas",
        "rapid_fire",
        "exam_questions",
      ],
      additionalProperties: false,
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const { sessionId, subject, chapter, notes, fileUrls } = await req.json();

    if (!sessionId || !subject || !chapter) {
      return new Response(
        JSON.stringify({ error: "sessionId, subject and chapter are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const userContent: any[] = [
      {
        type: "text",
        text: `Subject: ${subject}\nChapter: ${chapter}\n\nStudent notes:\n${notes || "(none provided)"}\n\nGenerate a thorough 5-minute revision pack tailored to this chapter. Use the provided notes and any uploaded images/PDFs as the source of truth. If sources conflict, prefer the latest provided material.`,
      },
    ];

    if (Array.isArray(fileUrls)) {
      for (const url of fileUrls.slice(0, 6)) {
        userContent.push({ type: "image_url", image_url: { url } });
      }
    }

    const aiRes = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userContent },
          ],
          tools: [tool],
          tool_choice: { type: "function", function: { name: "build_revision" } },
        }),
      },
    );

    if (!aiRes.ok) {
      if (aiRes.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (aiRes.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Add credits in Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await aiRes.text();
      console.error("AI gateway error", aiRes.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const call = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error("No tool call returned");
    const parsed = JSON.parse(call.function.arguments);

    const { data: inserted, error: insErr } = await supabase
      .from("revisions")
      .insert({
        session_id: sessionId,
        subject,
        chapter,
        input_text: notes || null,
        summary: parsed.summary,
        key_concepts: parsed.key_concepts,
        formulas: parsed.formulas,
        rapid_fire: parsed.rapid_fire,
        exam_questions: parsed.exam_questions,
      })
      .select()
      .single();
    if (insErr) throw insErr;

    // Update streak / total
    const today = new Date().toISOString().slice(0, 10);
    const { data: streak } = await supabase
      .from("streaks")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle();

    let nextStreak = 1;
    if (streak?.last_active) {
      const last = new Date(streak.last_active);
      const diff = Math.floor(
        (new Date(today).getTime() - last.getTime()) / 86400000,
      );
      if (diff === 0) nextStreak = streak.current_streak;
      else if (diff === 1) nextStreak = streak.current_streak + 1;
      else nextStreak = 1;
    }

    await supabase.from("streaks").upsert({
      session_id: sessionId,
      current_streak: nextStreak,
      last_active: today,
      total_revisions: (streak?.total_revisions || 0) + 1,
      updated_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ revision: inserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-revision error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});