import type { Config } from "drizzle-kit";

export default {
    dialect: "postgresql",
    schema: "./db/drizzle/schema.ts",
    out: "./db/drizzle",
    dbCredentials: {
        url: `url`,
        ssl: { rejectUnauthorized: false},
    },
} satisfies Config;