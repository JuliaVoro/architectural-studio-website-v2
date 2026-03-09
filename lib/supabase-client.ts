import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Only throw errors if we're in a runtime environment (not during build)
// During build, we create placeholder clients so the build can complete
const isRuntime = typeof window !== "undefined" || process.env.NODE_ENV === "production";

let supabaseBrowserClient: ReturnType<typeof createClient> | null = null;
let supabaseServerClient: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabaseBrowserClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
    },
  });

  supabaseServerClient = supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          persistSession: false,
        },
      })
    : null;
} else if (isRuntime) {
  throw new Error(
    "Supabase configuration is missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
  );
}

export { supabaseBrowserClient, supabaseServerClient };

