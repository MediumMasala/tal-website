import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy initialization of Supabase client
let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Supabase not configured - missing URL or service key");
    return null;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseServiceKey);
  return supabaseInstance;
}

// Type for the leads table
export interface Lead {
  id?: string;
  company_slug: string;
  company_name: string;
  whatsapp_number: string;
  user_name: string;
  user_workplace: string;
  basic_ask: string;
  page_url: string;
  utm_raw: string;
  ai_title?: string;
  ai_tags?: string[];
  created_at?: string;
}

// Function to save a lead to the database
export async function saveLead(lead: Lead): Promise<{ success: boolean; error?: string; data?: Lead }> {
  const supabase = getSupabaseClient();

  // Check if Supabase is configured
  if (!supabase) {
    console.warn("Supabase not configured - lead will only be logged");
    return { success: true, data: lead };
  }

  try {
    const { data, error } = await supabase
      .from("leads")
      .insert([lead])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error saving lead:", err);
    return { success: false, error: "Failed to save lead" };
  }
}

// Function to get all leads (for admin purposes)
export async function getLeads(companySlug?: string): Promise<Lead[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    console.warn("Supabase not configured");
    return [];
  }

  try {
    let query = supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (companySlug) {
      query = query.eq("company_slug", companySlug);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching leads:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error fetching leads:", err);
    return [];
  }
}
