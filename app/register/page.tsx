import { OAuthButtons } from "@/components/OAuthButtons";
import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  const google = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
  const github = Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);

  return (
    <div className="page-shell flex min-h-[60vh] flex-col items-center justify-center py-16">
      <div className="glass-card w-full max-w-md p-8">
        <p className="section-eyebrow text-center">Join free</p>
        <h1 className="mt-2 text-center text-2xl font-bold">Create your account</h1>
        <p className="mt-2 text-center text-sm text-[var(--color-muted)]">Start tracking your TV journey</p>
        <div className="mt-8 space-y-6">
          <RegisterForm />
          <OAuthButtons google={google} github={github} />
        </div>
      </div>
    </div>
  );
}
