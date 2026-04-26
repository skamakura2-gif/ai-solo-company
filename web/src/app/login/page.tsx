import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata = { title: "ログイン | Chirp" };

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Chirp</h1>
          <p className="text-sm text-muted-foreground">
            アカウントにログインしてつぶやきを投稿しよう
          </p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          アカウントがありませんか？{" "}
          <Link
            href="/signup"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            新規登録
          </Link>
        </p>
      </div>
    </div>
  );
}
