// This file is a placeholder for your Supabase generated types.
// Please generate these types from your Supabase project dashboard or using the Supabase CLI.
// For example, using the CLI:
// supabase gen types typescript --project-id <your-project-id> --schema public > src/lib/types/supabase.ts
//
// The main `Database` type definition is in `src/lib/types.ts` for now and can be merged here once generated.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Re-export from main types file for consistency until user generates actual types here
export type { Database } from "@/lib/types";
