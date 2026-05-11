import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const EXTERNAL_SUPABASE_URL = "https://kyqtkotrnhqhzfffqbyf.supabase.co";
const EXTERNAL_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5cXRrb3RybmhxaHpmZmZxYnlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MDA1MzMsImV4cCI6MjA5Mzk3NjUzM30.cGCHGtXJy2dc4-zbv3euXw2DgURqpd7GVMluEn5T2LY";

let _client: SupabaseClient<any> | undefined;

function create(): SupabaseClient<any> {
  return createClient<any>(EXTERNAL_SUPABASE_URL, EXTERNAL_SUPABASE_ANON_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      storageKey: "gvxm-ext-auth",
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

export const externalSupabase = new Proxy({} as SupabaseClient<any>, {
  get(_t, prop, recv) {
    if (!_client) _client = create();
    return Reflect.get(_client, prop, recv);
  },
});
