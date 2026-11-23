import { createClient } from "@/lib/supabase/server";
import { InsightsChart } from "@/components/ui/insights-chart";
import { Card, CardHeader } from "@/components/ui/card";
import { HeartIcon, CalendarIcon } from "lucide-react";
import { redirect } from "next/navigation"
import { Suspense } from "react";

export default async function InsightsPage() {

  // Init supabase client
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  // Get user session
  const isSignedIn = !error && Boolean(data?.claims?.sub);

  // Init on screen values
  let totalEntries: number | null = 0;
  let weeklyEntries: number | null = 0;

  const chartData = [
    { day: "Sunday", count: 0 },
    { day: "Monday", count: 0 },
    { day: "Tuesday", count: 0 },
    { day: "Wednesday", count: 0 },
    { day: "Thursday", count: 0 },
    { day: "Friday", count: 0 },
    { day: "Saturday", count: 0 },
  ]

  // Reject unauthenticated users
  if (!isSignedIn) {
    redirect("/auth/login")
  }

  // Set week var
  const last7days = new Date();
  last7days.setDate(last7days.getDate()-7)

  // Get total Entries from database
  const { data: allEntries } = await supabase
      .from("gratitude_entry")
      .select("*", {count:"exact"})
      .eq("owner_id", data!.claims!.sub);
  
  // Set totalEntries value
  if (allEntries != null) totalEntries = allEntries.length;

  // Filter week entries
  const weekEntries = allEntries?.filter((entry)=>{
    return new Date(entry.created) > last7days
  })  


  if (weekEntries != null) {
    // Set weeklyEntries value
    weeklyEntries = weekEntries.length;

    // Group entries by day
    for (let index = 0; index < weekEntries.length; index++) {
      chartData[(new Date(weekEntries[index].created)).getDay()].count ++
    }
  }
 
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
        <div className="w-full max-w-[650px] items-center gap-2 md:flex m-8">
          <Card className="p-8">
              <HeartIcon  />
              Total Entries: {totalEntries}
          </Card>
          <Card className="p-8">
              <CalendarIcon />
              Entries this Week: {weeklyEntries}
          </Card>
        </div>
          <InsightsChart chartData={chartData}/>
        

    </main>
    </Suspense>
  )
}