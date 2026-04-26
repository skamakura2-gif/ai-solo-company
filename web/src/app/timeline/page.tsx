import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { ComposeForm } from "./compose-form";
import { PostList, type TimelinePost } from "./post-list";

export const metadata = { title: "タイムライン | Chirp" };

export default async function TimelinePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: posts } = await supabase
    .from("posts_with_author")
    .select("id, content, created_at, user_id, handle")
    .order("created_at", { ascending: false })
    .limit(100);

  const handle =
    (user.user_metadata?.handle as string | undefined) ??
    user.email?.split("@")[0] ??
    "user";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Chirp</h1>
          <p className="text-xs text-muted-foreground">@{handle}</p>
        </div>
        <form action={signout}>
          <Button type="submit" variant="ghost" size="sm">
            ログアウト
          </Button>
        </form>
      </header>

      <div className="border-b border-border px-4 py-4">
        <ComposeForm />
      </div>

      <PostList posts={(posts ?? []) as TimelinePost[]} currentUserId={user.id} />
    </div>
  );
}
