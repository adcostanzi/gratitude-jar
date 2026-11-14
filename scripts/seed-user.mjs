import { createClient } from "@supabase/supabase-js";

// Run only from a trusted local development environment.
// Usage: pnpm seed:user (reads values from .env.local via Node.js).
if (process.env.NODE_ENV === "production") {
    console.error("Seed user creation is disabled in production mode.");
    process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const adminKey =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.SEED_USER_EMAIL?.trim().toLowerCase();
const password = process.env.SEED_USER_PASSWORD;

const missing = [
    ["NEXT_PUBLIC_SUPABASE_URL", url],
    ["SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY", adminKey],
    ["SEED_USER_EMAIL", email],
    ["SEED_USER_PASSWORD", password],
].filter(([, value]) => !value);

if (missing.length) {
    console.error(`Missing environment variables: ${missing.map(([name]) => name).join(", ")}`);
    process.exit(1);
}

if (password.length < 8) {
    console.error("SEED_USER_PASSWORD must be at least 8 characters long.");
    process.exit(1);
}

const supabase = createClient(url, adminKey, {
    auth: { autoRefreshToken: false, persistSession: false },
});

// The Admin API does not provide a direct get-user-by-email method.
// Check every page, so a second run doesn't attempt to create a duplicate.
async function userAlreadyExists() {
    const perPage = 100;
    for (let page = 1; ; page++) {
        const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
        if (error) throw error;
        if (data.users.some((user) => user.email?.toLowerCase() === email)) return true;
        if (data.users.length < perPage) return false;
    }
}

try {
    if (await userAlreadyExists()) {
        console.log(`Test account already exists: ${email}. No changes made.`);
        process.exit(0);
    }

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Development test account only; no confirmation email needed.
    });
    if (error) throw error;

    console.log(`Created Supabase Auth test account: ${data.user.email}`);
    console.log(`User ID: ${data.user.id}`);
    console.log("You can now test login at /auth/login.");
} catch (error) {
    console.error("Failed to seed user:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
}
