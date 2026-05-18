import { createClient } from "@supabase/supabase-js";
import { env } from "process";


export const supabaseAnon = createClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

export const supabaseAdmin = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

export const createUserSupabase = (accessToken: string) =>
  createClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
