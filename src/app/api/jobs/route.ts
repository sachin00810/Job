import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { jobs, companies, jobSkills } from "@/db/schema";
import { and, eq, gte, ilike, or, desc, asc, sql, count } from "drizzle-orm";
import { auth } from "@/auth";
import { createJobSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const employmentType = searchParams.get("employmentType") ?? "";
  const workMode = searchParams.get("workMode") ?? "";
  const minSalary = Number(searchParams.get("minSalary") ?? 0);
  const visaOnly = searchParams.get("visaSponsorship") === "true";
  const location = searchParams.get("location") ?? "";
  const sort = searchParams.get("sort") ?? "recent";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Number(searchParams.get("limit") ?? 12));
  const offset = (page - 1) * limit;

  const conditions = [];
  if (q) conditions.push(or(ilike(jobs.title, `%${q}%`), ilike(companies.name, `%${q}%`)));
  if (category) conditions.push(eq(jobs.category, category));
  if (employmentType) conditions.push(eq(jobs.employmentType, employmentType));
  if (workMode) conditions.push(eq(jobs.workMode, workMode));
  if (minSalary > 0) conditions.push(gte(jobs.salaryMin, minSalary));
  if (visaOnly) conditions.push(eq(jobs.visaSponsorship, true));
  if (location) conditions.push(or(ilike(jobs.locationCity, `%${location}%`), ilike(jobs.locationState, `%${location}%`)));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const orderBy =
    sort === "salary-desc" ? desc(jobs.salaryMax)
    : sort === "salary-asc" ? asc(jobs.salaryMin)
    : desc(jobs.postedAt);

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: jobs.id,
        slug: jobs.slug,
        title: jobs.title,
        description: jobs.description,
        category: jobs.category,
        employmentType: jobs.employmentType,
        salaryMin: jobs.salaryMin,
        salaryMax: jobs.salaryMax,
        currency: jobs.currency,
        locationCity: jobs.locationCity,
        locationState: jobs.locationState,
        locationCountry: jobs.locationCountry,
        workMode: jobs.workMode,
        visaSponsorship: jobs.visaSponsorship,
        featured: jobs.featured,
        views: jobs.views,
        postedAt: jobs.postedAt,
        expiresAt: jobs.expiresAt,
        company: {
          id: companies.id,
          name: companies.name,
          logoUrl: companies.logoUrl,
          website: companies.website,
          industry: companies.industry,
          size: companies.size,
          description: companies.description,
          verified: companies.verified,
          city: companies.city,
        },
      })
      .from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(where)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(jobs).innerJoin(companies, eq(jobs.companyId, companies.id)).where(where),
  ]);

  const jobsWithSkills = await Promise.all(
    rows.map(async (job) => {
      const skills = await db.select({ skill: jobSkills.skill }).from(jobSkills).where(eq(jobSkills.jobId, job.id));
      return { ...job, skills: skills.map((s) => s.skill) };
    })
  );

  return NextResponse.json({
    jobs: jobsWithSkills,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createJobSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const d = parsed.data;
  const companyId = `comp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const jobId = `job-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const slug = `${d.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${d.locationCity.toLowerCase()}-${jobId.slice(-4)}`;

  await db.insert(companies).values({
    id: companyId,
    name: d.companyName,
    logoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(d.companyName)}`,
    website: d.companyWebsite || null,
    industry: d.companyIndustry,
    size: "1-50",
    description: d.companyName,
    verified: false,
    city: d.locationCity,
  }).onConflictDoNothing();

  await db.insert(jobs).values({
    id: jobId,
    slug,
    companyId,
    title: d.title,
    description: d.description,
    category: d.category,
    employmentType: d.employmentType,
    salaryMin: d.salaryMin ?? 0,
    salaryMax: d.salaryMax ?? 0,
    currency: "AUD",
    locationCity: d.locationCity,
    locationState: d.locationState,
    locationCountry: "Australia",
    workMode: d.workMode,
    visaSponsorship: d.visaSponsorship ?? false,
    featured: false,
    views: 0,
  });

  if (d.skills?.length) {
    await db.insert(jobSkills).values(d.skills.map((skill) => ({ jobId, skill })));
  }

  return NextResponse.json({ slug }, { status: 201 });
}
