/**
 * Creates admin@trendswd.com in Supabase Auth + profiles (admin role).
 * Password is sent once to the Auth Admin API; Supabase stores a bcrypt hash
 * in auth.users.encrypted_password — never in public.profiles.
 * Usage: npm run seed:admin
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAIL = "admin@trendswd.com";
const ADMIN_PASSWORD = "admin123";

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    console.warn("Could not read .env.local — using existing environment variables.");
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: listData } = await supabase.auth.admin.listUsers();
const existing = listData?.users?.find((u) => u.email === ADMIN_EMAIL);

let userId = existing?.id;

if (!userId) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
  });

  if (error) {
    console.error("Failed to create auth user:", error.message);
    process.exit(1);
  }

  userId = data.user.id;
  console.log("Created auth user:", ADMIN_EMAIL);
} else {
  console.log("Auth user already exists:", ADMIN_EMAIL);

  const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
    password: ADMIN_PASSWORD,
    email_confirm: true,
  });

  if (updateError) {
    console.warn("Could not update password:", updateError.message);
  }
}

const { error: profileError } = await supabase.from("profiles").upsert(
  {
    id: userId,
    email: ADMIN_EMAIL,
    role: "admin",
    permissions: {
      can_view: true,
      can_edit: true,
      can_delete: true,
    },
  },
  { onConflict: "id" },
);

if (profileError) {
  console.error("Failed to upsert profile:", profileError.message);
  console.error("Make sure you ran supabase/profiles.sql first.");
  process.exit(1);
}

console.log("Admin profile ready (role: admin).");
console.log("Password stored as bcrypt hash in auth.users (not in profiles).");
console.log("Sign in at /admin/login with email:", ADMIN_EMAIL);
