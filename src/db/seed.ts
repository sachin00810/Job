import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { companies as staticCompanies } from "../data/companies";
import { jobs as staticJobs } from "../data/jobs";
import { rooms as staticRooms } from "../data/rooms";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("Seeding companies...");
  for (const c of staticCompanies) {
    await db
      .insert(schema.companies)
      .values({
        id: c.id,
        name: c.name,
        logoUrl: c.logoUrl,
        website: c.website ?? null,
        industry: c.industry,
        size: c.size,
        description: c.description,
        verified: c.verified,
        city: c.city,
      })
      .onConflictDoNothing();
  }

  console.log("Seeding jobs...");
  for (const j of staticJobs) {
    await db
      .insert(schema.jobs)
      .values({
        id: j.id,
        slug: j.slug,
        companyId: j.company.id,
        title: j.title,
        description: j.description,
        category: j.category,
        employmentType: j.employmentType,
        salaryMin: j.salaryMin,
        salaryMax: j.salaryMax,
        currency: j.currency,
        locationCity: j.locationCity,
        locationState: j.locationState,
        locationCountry: j.locationCountry,
        workMode: j.workMode,
        visaSponsorship: j.visaSponsorship,
        featured: j.featured,
        views: j.views,
        postedAt: new Date(j.postedAt),
        expiresAt: j.expiresAt ? new Date(j.expiresAt) : null,
      })
      .onConflictDoNothing();

    for (const skill of j.skills) {
      await db
        .insert(schema.jobSkills)
        .values({ jobId: j.id, skill })
        .onConflictDoNothing();
    }
  }

  console.log("Seeding rooms...");
  for (const r of staticRooms) {
    await db
      .insert(schema.rooms)
      .values({
        id: r.id,
        slug: r.slug,
        title: r.title,
        description: r.description,
        type: r.type,
        rentWeekly: r.rentWeekly,
        bond: r.bond,
        currency: r.currency,
        availableFrom: r.availableFrom,
        minStayMonths: r.minStayMonths,
        suburb: r.suburb,
        city: r.city,
        state: r.state,
        country: r.country,
        lat: r.lat,
        lng: r.lng,
        furnished: r.furnished,
        billsIncluded: r.billsIncluded,
        internet: r.internet,
        parking: r.parking,
        petsAllowed: r.petsAllowed,
        smokingAllowed: r.smokingAllowed,
        genderPref: r.genderPref,
        ownerName: r.ownerName,
        ownerAvatar: r.ownerAvatar,
        featured: r.featured,
        postedAt: new Date(r.postedAt),
      })
      .onConflictDoNothing();

    for (let i = 0; i < r.photos.length; i++) {
      await db
        .insert(schema.roomPhotos)
        .values({ roomId: r.id, url: r.photos[i], position: i })
        .onConflictDoNothing();
    }
  }

  console.log("Done! Seeded", staticCompanies.length, "companies,", staticJobs.length, "jobs,", staticRooms.length, "rooms.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
