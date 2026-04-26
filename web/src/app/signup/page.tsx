import Link from "next/link";
import { SignupForm } from "./signup-form";

export const metadata = { title: "新規登録 | Chirp" };

export default function SignupPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Chirp</h1>
          <p className="text-sm text-muted-foreground">
            アカウントを作成してつぶやきを始めよう
          </p>
        </div>
        <SignupForm />
        <p className="text-center text-sm text-muted-foreground">
          すでにアカウントをお持ちですか？{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
