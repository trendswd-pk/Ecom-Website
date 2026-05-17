/**
 * Password storage policy for this app:
 *
 * - Hashed passwords live only in Supabase `auth.users.encrypted_password` (bcrypt).
 * - `public.profiles` holds role/permissions only — no password column.
 * - Use Auth APIs: signInWithPassword, signUp, auth.admin.createUser.
 * - Never insert or compare plain-text passwords in SQL or custom tables.
 */
export const PASSWORD_STORAGE = "supabase-auth-bcrypt" as const;
