import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL!,
    ssl: (process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "").includes("neon.tech")
      ? "require"
      : false,
  },
});
