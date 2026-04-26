"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createPost } from "@/app/actions/posts";

const MAX = 280;

export function ComposeForm() {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [pending, startTransition] = useTransition();

  const remaining = MAX - text.length;
  const over = remaining < 0;

  function handleAction(formData: FormData) {
    setError(undefined);
    startTransition(async () => {
      const result = await createPost(undefined, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setText("");
      }
    });
  }

  return (
    <form action={handleAction} className="space-y-3">
      <textarea
        name="content"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="いまどうしてる？"
        rows={3}
        className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-base outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <div className="flex items-center justify-between">
        <span
          className={
            "text-xs " + (over ? "text-destructive" : "text-muted-foreground")
          }
        >
          {remaining}
        </span>
        <Button type="submit" disabled={pending || over || text.trim() === ""}>
          {pending ? "投稿中…" : "投稿する"}
        </Button>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </form>
  );
}
