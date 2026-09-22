import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CreateListForm } from "@/components/CreateListForm";

export default async function NewListPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link href="/lists" className="text-sm text-[#678] hover:text-white">← Back to lists</Link>
      <h1 className="mt-4 text-2xl font-bold">Create a new list</h1>
      <p className="mt-1 text-sm text-[#678]">Collect shows around any theme you like</p>
      <div className="mt-8">
        <CreateListForm />
      </div>
    </div>
  );
}
