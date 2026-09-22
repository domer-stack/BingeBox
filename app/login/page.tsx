import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="page-shell flex min-h-[60vh] flex-col items-center justify-center py-16">
      <div className="glass-card w-full max-w-md p-8">
        <p className="section-eyebrow text-center">Welcome back</p>
        <h1 className="mt-2 text-center text-2xl font-bold">Sign in to BingeBox</h1>
        <p className="mt-2 text-center text-sm text-[var(--color-muted)]">Pick up where your watchlist left off</p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
