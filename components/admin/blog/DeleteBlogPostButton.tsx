"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteBlogPost } from "@/app/api/actions/blog/actions";
import { Trash2 } from "lucide-react";

type DeleteBlogPostButtonProps = {
  postId: number;
  title: string;
};

export function DeleteBlogPostButton({ postId, title }: DeleteBlogPostButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
        startTransition(async () => {
          await deleteBlogPost(postId);
          router.push("/admin/blog");
          router.refresh();
        });
      }}
      className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2 py-1 text-xs text-red-200 hover:bg-red-500/10 disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Delete
    </button>
  );
}
