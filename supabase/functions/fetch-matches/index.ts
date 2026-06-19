import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// This is a free World Cup API (no key needed for read access)
const API_URL = "https://worldcup26.ir/get/games";

serve(async () => {
  try {
    console.log("🔄 Fetching match data...");

    // 1. Fetch from the API
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!data || !data.games) {
      throw new Error("No data received from API");
    }

    // 2. Connect to Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // 3. Loop through matches and save to database
    let count = 0;
    for (const match of data.games) {
      const { error } = await supabase
        .from("matches")
        .upsert({
          id: match.id || `match-${count}`,
          match_date: match.date || "",
          home_team: match.homeTeam || match.home || "",
          away_team: match.awayTeam || match.away || "",
          home_score: match.homeScore || match.scoreHome || 0,
          away_score: match.awayScore || match.scoreAway || 0,
          status: match.status || "scheduled",
          venue: match.venue || "",
          city: match.city || "",
          updated_at: new Date().toISOString(),
        }, { onConflict: "id" });

      if (error) {
        console.error("Error saving match:", error);
      } else {
        count++;
      }
    }

    console.log(`✅ Updated ${count} matches`);

    return new Response(
      JSON.stringify({ success: true, updated: count }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("❌ Error:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});