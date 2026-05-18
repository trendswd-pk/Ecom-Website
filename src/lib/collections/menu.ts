import { createAdminClient } from "@/lib/supabase/server";
import type { MenuCollection } from "@/types/collection";

export async function getMenuCollections(): Promise<MenuCollection[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("collections")
      .select("name, slug")
      .eq("show_in_menu", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}
