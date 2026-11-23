import { createClient } from "@/lib/supabase/server";
import { InsightsChart } from "@/components/ui/insights-chart";
import { Card, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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

  // Set today var
  const today = new Date();
  today.setDate(today.getDate()-1)

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
 
  // Get today's entries
  const todayEntries = weekEntries?.filter((entry)=> {
    return new Date(entry.created) > today
  }
  )


  return (
    <Suspense fallback={<div>Loading...</div>}>
    <main className="mx-auto p-8 w-auto max-w-7xl">
      {/* TOP */}
        <div className="mx-auto mb-8 flex max-w-3xl flex-col items-center text-center">
          <h1 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl md:mt-8">
            Your Insights
          </h1>
          <h2>
            A look at your gratitude journey and the moments that matter.
          </h2>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-2 justify-center gap-20 mb-8">
          <Card className="p-8">
                <HeartIcon />
              Total Entries: {totalEntries}
          </Card>
          <Card className="p-8">
              <CalendarIcon  />
              Entries this Week: {weeklyEntries}
          </Card>
        </div>

        {/* BODY */}
        <div className="grid grid-cols-3 gap-10 h-full">

        {/* Chart */}
          <InsightsChart chartData={chartData} className="col-span-2 h-full" />
        {/* Scroll Area */}
          <ScrollArea className="h-15 rounded-md border p-2 max-h-96">
            <h2 className="font-bold text-center">Today's Memories</h2>
            <Separator className="my-2"/>
            {todayEntries?.map((entry)=>
              (
                <div>
                  {entry.content}
                  <Separator className="my-2"/>
                </div>
              ))}
          </ScrollArea>
        </div>
    </main>
    </Suspense>
  )
}