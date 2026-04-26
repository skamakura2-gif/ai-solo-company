import { deletePost } from "@/app/actions/posts";
import { Button } from "@/components/ui/button";

export type TimelinePost = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  handle: string | null;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("ja-JP", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function PostList({
  posts,
  currentUserId,
}: {
  posts: TimelinePost[];
  currentUserId: string;
}) {
  if (posts.length === 0) {
    return (
      <p className="px-4 py-12 text-center text-sm text-muted-foreground">
        まだ投稿はありません。最初のつぶやきを投稿してみよう。
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {posts.map((post) => (
        <li key={post.id} className="px-4 py-4">
          <div className="flex items-baseline justify-between gap-3">
            <div className="flex items-baseline gap-2 text-sm">
              <span className="font-semibold">@{post.handle ?? "user"}</span>
              <span className="text-muted-foreground">
                {formatDate(post.created_at)}
              </span>
            </div>
            {post.user_id === currentUserId ? (
              <form action={deletePost}>
                <input type="hidden" name="id" value={post.id} />
                <Button
                  type="submit"
                  variant="ghost"
                  size="xs"
                  className="text-muted-foreground hover:text-destructive"
                >
                  削除
                </Button>
              </form>
            ) : null}
          </div>
          <p className="mt-1 whitespace-pre-wrap break-words text-base">
            {post.content}
          </p>
        </li>
      ))}
    </ul>
  );
}
