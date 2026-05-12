import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  doublePrecision,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  passwordHash: text("password_hash"),
  avatarUrl: text("avatar_url"),
  role: text("role").notNull().default("seeker"),
  city: text("city"),
  country: text("country"),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const companies = pgTable("companies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  website: text("website"),
  industry: text("industry").notNull(),
  size: text("size").notNull(),
  description: text("description").notNull(),
  verified: boolean("verified").notNull().default(false),
  city: text("city").notNull(),
});

export const jobs = pgTable(
  "jobs",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    companyId: text("company_id")
      .notNull()
      .references(() => companies.id),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    employmentType: text("employment_type").notNull(),
    salaryMin: integer("salary_min").notNull(),
    salaryMax: integer("salary_max").notNull(),
    currency: text("currency").notNull().default("AUD"),
    locationCity: text("location_city").notNull(),
    locationState: text("location_state").notNull(),
    locationCountry: text("location_country").notNull().default("Australia"),
    workMode: text("work_mode").notNull(),
    visaSponsorship: boolean("visa_sponsorship").notNull().default(false),
    featured: boolean("featured").notNull().default(false),
    views: integer("views").notNull().default(0),
    postedAt: timestamp("posted_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at"),
  },
  (t) => ({
    categoryIdx: index("jobs_category_idx").on(t.category),
    cityIdx: index("jobs_city_idx").on(t.locationCity),
    workModeIdx: index("jobs_work_mode_idx").on(t.workMode),
    employmentTypeIdx: index("jobs_employment_type_idx").on(t.employmentType),
    postedAtIdx: index("jobs_posted_at_idx").on(t.postedAt),
  })
);

export const jobSkills = pgTable(
  "job_skills",
  {
    jobId: text("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    skill: text("skill").notNull(),
  },
  (t) => ({
    jobIdIdx: index("job_skills_job_id_idx").on(t.jobId),
  })
);

export const rooms = pgTable(
  "rooms",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    type: text("type").notNull(),
    rentWeekly: integer("rent_weekly").notNull(),
    bond: integer("bond").notNull(),
    currency: text("currency").notNull().default("AUD"),
    availableFrom: text("available_from").notNull(),
    minStayMonths: integer("min_stay_months").notNull().default(1),
    suburb: text("suburb").notNull(),
    city: text("city").notNull(),
    state: text("state").notNull(),
    country: text("country").notNull().default("Australia"),
    lat: doublePrecision("lat"),
    lng: doublePrecision("lng"),
    furnished: boolean("furnished").notNull().default(false),
    billsIncluded: boolean("bills_included").notNull().default(false),
    internet: boolean("internet").notNull().default(false),
    parking: boolean("parking").notNull().default(false),
    petsAllowed: boolean("pets_allowed").notNull().default(false),
    smokingAllowed: boolean("smoking_allowed").notNull().default(false),
    genderPref: text("gender_pref").notNull().default("any"),
    ownerName: text("owner_name").notNull(),
    ownerAvatar: text("owner_avatar").notNull(),
    featured: boolean("featured").notNull().default(false),
    postedAt: timestamp("posted_at").notNull().defaultNow(),
  },
  (t) => ({
    cityIdx: index("rooms_city_idx").on(t.city),
    typeIdx: index("rooms_type_idx").on(t.type),
    rentIdx: index("rooms_rent_idx").on(t.rentWeekly),
    postedAtIdx: index("rooms_posted_at_idx").on(t.postedAt),
  })
);

export const roomPhotos = pgTable(
  "room_photos",
  {
    roomId: text("room_id")
      .notNull()
      .references(() => rooms.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    position: integer("position").notNull().default(0),
  },
  (t) => ({
    roomIdIdx: index("room_photos_room_id_idx").on(t.roomId),
  })
);

export const savedJobs = pgTable(
  "saved_jobs",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    jobId: text("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    savedAt: timestamp("saved_at").notNull().defaultNow(),
  },
  (t) => ({
    uniq: uniqueIndex("saved_jobs_user_job_uniq").on(t.userId, t.jobId),
  })
);

export const savedRooms = pgTable(
  "saved_rooms",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roomId: text("room_id")
      .notNull()
      .references(() => rooms.id, { onDelete: "cascade" }),
    savedAt: timestamp("saved_at").notNull().defaultNow(),
  },
  (t) => ({
    uniq: uniqueIndex("saved_rooms_user_room_uniq").on(t.userId, t.roomId),
  })
);

export const applications = pgTable(
  "applications",
  {
    id: text("id").primaryKey(),
    jobId: text("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    coverLetter: text("cover_letter").notNull().default(""),
    status: text("status").notNull().default("applied"),
    appliedAt: timestamp("applied_at").notNull().defaultNow(),
  },
  (t) => ({
    uniq: uniqueIndex("applications_user_job_uniq").on(t.userId, t.jobId),
    statusIdx: index("applications_status_idx").on(t.status),
  })
);

export const messages = pgTable(
  "messages",
  {
    id: text("id").primaryKey(),
    applicationId: text("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    readAt: timestamp("read_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    applicationIdx: index("messages_application_idx").on(t.applicationId),
    senderIdx: index("messages_sender_idx").on(t.senderId),
  })
);
