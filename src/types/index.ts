export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: 'seeker' | 'employer' | 'landlord' | 'admin';
  city?: string;
  country?: string;
  verified: boolean;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  logoUrl: string;
  website?: string;
  industry: string;
  size: string;
  description: string;
  verified: boolean;
  city: string;
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  company: Company;
  description: string;
  category: string;
  employmentType: 'full-time' | 'part-time' | 'casual' | 'contract' | 'internship';
  salaryMin: number;
  salaryMax: number;
  currency: string;
  locationCity: string;
  locationState: string;
  locationCountry: string;
  workMode: 'onsite' | 'hybrid' | 'remote';
  visaSponsorship: boolean;
  skills: string[];
  postedAt: string;
  expiresAt: string;
  featured: boolean;
  views: number;
}

export interface Room {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: 'studio' | 'private-room' | 'shared-room' | 'whole-place';
  rentWeekly: number;
  bond: number;
  currency: string;
  availableFrom: string;
  minStayMonths: number;
  suburb: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  furnished: boolean;
  billsIncluded: boolean;
  internet: boolean;
  parking: boolean;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  genderPref: 'any' | 'female' | 'male';
  photos: string[];
  ownerName: string;
  ownerAvatar: string;
  featured: boolean;
  postedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  coverLetter: string;
  status: 'applied' | 'viewed' | 'shortlisted' | 'rejected' | 'hired';
  appliedAt: string;
}
