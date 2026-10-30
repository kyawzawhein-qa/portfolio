"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BlogMarkdown from "@/components/BlogMarkdown";
import { createBlogPost, setBlogPostDraft, updateBlogPost } from "@/app/api/actions/blog/actions";
import { slugifyTitle } from "@/lib/blog-slug";
import { Eye, FilePenLine, Loader2, Save, Send } from "lucide-react";

export type BlogEditorInitial = {
  id?: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  date: string;
  draft: boolean;
};

type BlogEditorProps = {
  mode: "create" | "edit";
  initial: BlogEditorInitial;
};

export function BlogEditor({ mode, initial }: BlogEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));
  const [description, setDescription] = useState(initial.description);
  const [content, setContent] = useState(initial.content);
  const [date, setDate] = useState(initial.date);
  const [draft, setDraft] = useState(initial.draft);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState(true);
  const [isPending, startTransition] = useTransition();

  const suggestedSlug = useMemo(() => slugifyTitle(title), [title]);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugifyTitle(value));
    }
  }

  function submit(saveAsDraft: boolean) {
    setError(null);
    startTransition(async () => {
      try {
        const payload = {
          title,
          slug: slug || suggestedSlug,
          description,
          content,
          date,
          draft: saveAsDraft
        };
        const result =
          mode === "create"
            ? await createBlogPost(payload)
            : await updateBlogPost(initial.id!, payload);
        setDraft(saveAsDraft);
        if (mode === "create") {
          router.push(`/admin/blog/${result.id}/edit`);
        } else {
          router.refresh();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save post.");
      }
    });
  }

  function togglePublish() {
    if (!initial.id) return;
    setError(null);
    const nextDraft = !draft;
    startTransition(async () => {
      try {
        await setBlogPostDraft(initial.id!, nextDraft);
        setDraft(nextDraft);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update publish state.");
      }
    });
  }

  return (
    <div className="space-y-6">
      {error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1 text-sm">
          <span className="text-slate-400">Title</span>
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white"
            placeholder="Post title"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-slate-400">Slug</span>
          <input
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-sm text-cyan-100"
            placeholder={suggestedSlug || "my-post-slug"}
          />
        </label>
        <label className="block space-y-1 text-sm md:col-span-2">
          <span className="text-slate-400">Description</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white"
            placeholder="Short summary for listings and SEO"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-slate-400">Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white"
          />
        </label>
        <div className="flex items-end gap-2 text-sm text-slate-400">
          Status:{" "}
          <span
            className={
              draft
                ? "rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-amber-200"
                : "rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-emerald-200"
            }
          >
            {draft ? "Draft" : "Published"}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-cyan-500/40"
        >
          <Eye className="h-4 w-4" />
          {preview ? "Hide preview" : "Show preview"}
        </button>
        {initial.id ? (
          <button
            type="button"
            disabled={isPending}
            onClick={togglePublish}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-cyan-500/40 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {draft ? "Publish" : "Unpublish (draft)"}
          </button>
        ) : null}
        <button
          type="button"
          disabled={isPending}
          onClick={() => submit(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-cyan-500/40 disabled:opacity-50"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save draft
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => submit(false)}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FilePenLine className="h-4 w-4" />}
          Save & publish
        </button>
        {initial.id && !draft ? (
          <Link
            href={`/blog/${slug}`}
            className="ml-auto text-sm text-cyan-300 hover:text-cyan-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            View public post →
          </Link>
        ) : null}
      </div>

      <div className={`grid gap-4 ${preview ? "lg:grid-cols-2" : ""}`}>
        <label className="block space-y-1 text-sm">
          <span className="text-slate-400">Markdown body</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={preview ? 24 : 28}
            className="min-h-[320px] w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-100"
            placeholder="Write in Markdown…"
          />
        </label>
        {preview ? (
          <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Live preview</p>
            <BlogMarkdown content={content || "_Nothing to preview yet._"} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
