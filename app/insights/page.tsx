import { createClient } from "@/lib/supabase/server";
import { InsightsChart } from "@/components/ui/insights-chart";
import { Card, CardHeader } from "@/components/ui/card";
import { HeartIcon, CalendarIcon } from "lucide-react";
import { redirect } from "next/navigation"
import { Suspense } from "react";

export default async function InsightsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  const isSignedIn = !error && Boolean(data?.claims?.sub);

  let totalEntries: number | null = 0;

  if (!isSignedIn) {
    redirect("/auth/login")
  }

  const { data: entries } = await supabase
      .from("gratitude_entry")
      .select("*", {count: "exact"})
      .eq("owner_id", data!.claims!.sub);
  
  if (entries != null) totalEntries = entries.length;

  

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <main className="min-h-screen bg-white px-6 pb-32 pt-8 text-jar-charcoal md:py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl md:mt-8">
            Your Insights
          </h1>
          <h2>
            A look at your gratitude journey and the moments that matter.
          </h2>
        </div>
        
        <Card>
            <HeartIcon />
            Total Entries: {totalEntries}
        </Card>
        <Card>
            <CalendarIcon />
            Entries this Week: 
        </Card>
        
          <InsightsChart />
        

    </main>
    </Suspense>
  )
}