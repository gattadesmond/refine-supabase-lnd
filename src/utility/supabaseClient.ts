import { createClient } from "@refinedev/supabase";

const SUPABASE_URL = "https://bgepihodlciujpaqfppx.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZXBpaG9kbGNpdWpwYXFmcHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MDU4OTEsImV4cCI6MjA3Mjk4MTg5MX0.Wu4xlsXt7V4gMjA3UbJNprmwTT361ZN0eF8k8MLZRW8";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: {
    schema: "public",
  },
  auth: {
    persistSession: true,
  },
});
