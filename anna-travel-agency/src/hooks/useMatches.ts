// src/hooks/useMatches.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Match {
  id: string;
  match_date: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  status: string;
  venue: string;
  city: string;
}

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    try {
      console.log("🔄 Fetching matches from Supabase...");
      setLoading(true);
      
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('match_date', { ascending: true });

      console.log("📦 Data received:", data);
      console.log("❌ Error:", error);

      if (error) throw error;
      setMatches(data || []);
    } catch (err: any) {
      console.error("💥 Catch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { matches, loading, error, refresh: fetchMatches };
}