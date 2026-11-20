import Image from "next/image";
import AddEntryDialog from "@/components/ui/add-entry-dialog";
import { createClient } from "@/lib/supabase/server";
import RandomMemoryJar from "@/components/random-memory-jar";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  const isSignedIn = !error && Boolean(data?.claims?.sub);

  let hasEntries: boolean | null = null;

  if (isSignedIn) {
    const { data: entries, error: entriesError } = await supabase
      .from("gratitude_entry")
      .select("id")
      .eq("owner_id", data!.claims!.sub)
      .limit(1);

    if (!entriesError) {
      hasEntries = entries.length > 0;
    }
  }
  return (
    <>
      <main className="min-h-screen bg-white px-6 pb-32 pt-8 text-jar-charcoal md:py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl md:mt-8">
            Every jar starts with one moment.
          </h1>
          {isSignedIn ? (
            <RandomMemoryJar hasEntries={hasEntries} />
          ) : (
            <Image
              className="h-auto w-full max-w-[400px]"
              src="/images/gratitude-jar.svg"
              alt="Gratitude Jar"
              width={400}
              height={400}
            />
          )}
          {isSignedIn && hasEntries === null && (
            <p role="status" className="text-sm text-jar-gray">
              We couldn't check your jar right now. You can still try opening
              it.
            </p>
          )}
          <h2 className="mt-8 text-2xl font-semibold">Your Gratitude Jar</h2>
          <p className="mt-3 text-jar-gray">
            Begin colleting the little things that matter.
          </p>
          {isSignedIn && hasEntries !== null && (
            <AddEntryDialog
              content={
                hasEntries ? "Add more gratitudes" : "Add your first gratitude"
              }
            />
          )}
          {!isSignedIn && (
            <p className="mt-3 text-jar-gray">
              <Link
                href="/auth/login"
                className="font-semibold text-jar-sage underline hover:text-jar-sage-hover"
              >
                Sign in
              </Link>{" "}
              to start collecting your gratitude moments.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
