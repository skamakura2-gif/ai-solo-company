"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type PostState = { error?: string } | undefined;

export async function createPost(
  _prev: PostState,
  formData: FormData,
): Promise<PostState> {
  const content = String(formData.get("content") ?? "").trim();
  if (!content) {
    return { error: "投稿内容を入力してください。" };
  }
  if (content.length > 280) {
    return { error: "投稿は280文字以内で入力してください。" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "ログインが必要です。" };
  }

  const { error } = await supabase
    .from("posts")
    .insert({ user_id: user.id, content });
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/timeline");
  return undefined;
}

export async function deletePost(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/timeline");
}
