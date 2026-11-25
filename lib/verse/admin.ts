import "server-only";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

/** Returns a 401 response when the admin session is missing, otherwise null. */
export async function adminGuard(): Promise<NextResponse | null> {
  return (await isAdminAuthenticated()) ? null : NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

const CATEGORIES = ["daily", "weekly", "one_time", "holder", "community", "lore"];
const VERIFICATIONS = ["auto", "quiz", "proof", "holder"];
const REPEATS = ["once", "daily", "weekly"];
const DIFFICULTIES = ["easy", "medium", "hard"];
const STATUSES = ["draft", "published", "paused", "expired"];

type QuizItem = { q: string; options: string[]; answer: number };

function isQuiz(v: unknown): v is QuizItem[] {
  return (
    Array.isArray(v) &&
    v.length > 0 &&
    v.length <= 10 &&
    v.every(
      (i) =>
        i &&
        typeof i.q === "string" &&
        i.q.trim() &&
        Array.isArray(i.options) &&
        i.options.length >= 2 &&
        i.options.length <= 6 &&
        i.options.every((o: unknown) => typeof o === "string" && o.trim()) &&
        Number.isInteger(i.answer) &&
        i.answer >= 0 &&
        i.answer < i.options.length,
    )
  );
}

const optDate = (v: unknown) => (typeof v === "string" && v ? new Date(v).toISOString() : null);
const optText = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);

/** Validates an admin quest payload. Returns the DB row or an error message. */
export function parseQuestInput(body: Record<string, unknown>): { row: Record<string, unknown> } | { error: string } {
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  if (!/^[a-z0-9-]{3,48}$/.test(slug)) return { error: "Slug: 3–48 chars, lowercase letters, numbers, dashes." };
  const title = optText(body.title, 80);
  const description = optText(body.description, 600);
  if (!title || !description) return { error: "Title and description are required." };

  const xp = Number(body.xp);
  if (!Number.isInteger(xp) || xp < 1 || xp > 1000) return { error: "XP must be an integer between 1 and 1000." };
  const est = Number(body.est_minutes ?? 1);
  if (!Number.isInteger(est) || est < 1) return { error: "Time estimate must be a positive integer." };

  if (!CATEGORIES.includes(body.category as string)) return { error: "Invalid category." };
  if (!VERIFICATIONS.includes(body.verification as string)) return { error: "Invalid verification type." };
  if (!REPEATS.includes(body.repeat as string)) return { error: "Invalid repeat." };
  if (!DIFFICULTIES.includes(body.difficulty as string)) return { error: "Invalid difficulty." };
  const status = (body.status as string) ?? "draft";
  if (!STATUSES.includes(status)) return { error: "Invalid status." };

  let quiz: QuizItem[] | null = null;
  if (body.verification === "quiz") {
    if (!isQuiz(body.quiz)) return { error: "Quiz: 1–10 questions, 2–6 options each, answer = option index." };
    quiz = body.quiz;
  }

  const max = body.max_completions === null || body.max_completions === "" || body.max_completions === undefined
    ? null
    : Number(body.max_completions);
  if (max !== null && (!Number.isInteger(max) || max < 1)) return { error: "Max completions must be empty or ≥ 1." };

  let starts: string | null;
  let ends: string | null;
  try {
    starts = optDate(body.starts_at);
    ends = optDate(body.ends_at);
  } catch {
    return { error: "Invalid date." };
  }
  if (starts && ends && ends <= starts) return { error: "End date must be after start date." };

  const loreHref = optText(body.lore_href, 200);
  if (loreHref && !loreHref.startsWith("/")) return { error: "Lore link must be a site path starting with /." };

  return {
    row: {
      slug,
      title,
      description,
      category: body.category,
      xp,
      est_minutes: est,
      difficulty: body.difficulty,
      verification: body.verification,
      quiz,
      proof_hint: optText(body.proof_hint, 200),
      repeat: body.repeat,
      max_completions: max,
      starts_at: starts,
      ends_at: ends,
      status,
      featured: Boolean(body.featured),
      lore_ref: optText(body.lore_ref, 80),
      lore_href: loreHref,
      sort_order: Number.isInteger(Number(body.sort_order)) ? Number(body.sort_order) : 100,
      updated_at: new Date().toISOString(),
    },
  };
}
