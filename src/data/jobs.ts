import { Job } from '../types';
import { companies } from './companies';

export const jobs: Job[] = [
  {
    id: 'job-1',
    slug: 'senior-software-engineer-sydney',
    title: 'Senior Software Engineer',
    company: companies[0], // Coral Reef Tech
    description: 'Join our team to build scalable software solutions for ocean conservation and research. You will lead development of our data processing pipelines.',
    category: 'Technology',
    employmentType: 'full-time',
    salaryMin: 130000,
    salaryMax: 160000,
    currency: 'AUD',
    locationCity: 'Sydney',
    locationState: 'NSW',
    locationCountry: 'Australia',
    workMode: 'hybrid',
    visaSponsorship: true,
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL'],
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 28 * 86400000).toISOString(),
    featured: true,
    views: 342
  },
  {
    id: 'job-2',
    slug: 'resort-manager-cairns',
    title: 'Resort Manager',
    company: companies[1], // Great Barrier Hospitality
    description: 'Oversee daily operations of our premium coastal resort. Provide excellent guest experiences and manage staff effectively.',
    category: 'Hospitality',
    employmentType: 'full-time',
    salaryMin: 90000,
    salaryMax: 115000,
    currency: 'AUD',
    locationCity: 'Cairns',
    locationState: 'QLD',
    locationCountry: 'Australia',
    workMode: 'onsite',
    visaSponsorship: false,
    skills: ['Hospitality Management', 'Guest Relations', 'Team Leadership'],
    postedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 25 * 86400000).toISOString(),
    featured: false,
    views: 128
  },
  {
    id: 'job-3',
    slug: 'registered-nurse-sydney',
    title: 'Registered Nurse',
    company: companies[2], // Bondi Health Group
    description: 'Looking for a compassionate registered nurse to join our dynamic healthcare team in the Eastern Suburbs.',
    category: 'Healthcare',
    employmentType: 'casual',
    salaryMin: 70000,
    salaryMax: 90000,
    currency: 'AUD',
    locationCity: 'Sydney',
    locationState: 'NSW',
    locationCountry: 'Australia',
    workMode: 'onsite',
    visaSponsorship: true,
    skills: ['Patient Care', 'Clinical Assessment', 'Nursing'],
    postedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 29 * 86400000).toISOString(),
    featured: true,
    views: 450
  }
];
