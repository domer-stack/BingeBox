import { LoginForm } from "@/components/LoginForm";
import { OAuthButtons } from "@/components/OAuthButtons";

export default function LoginPage() {
  const google = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
  const github = Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);

  return (
    <div className="page-shell flex min-h-[60vh] flex-col items-center justify-center py-16">
      <div className="glass-card w-full max-w-md p-8">
        <p className="section-eyebrow text-center">Welcome back</p>
        <h1 className="mt-2 text-center text-2xl font-bold">Sign in to BingeBox</h1>
        <p className="mt-2 text-center text-sm text-[var(--color-muted)]">Pick up where your watchlist left off</p>
        <div className="mt-8 space-y-6">
          <LoginForm />
          <OAuthButtons google={google} github={github} />
        </div>
      </div>
    </div>
  );
}
