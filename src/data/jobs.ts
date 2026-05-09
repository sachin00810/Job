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
    slug: 'logistics-manager-alice-springs',
    title: 'Logistics Manager',
    company: companies[1], // Outback Logistics
    description: 'Manage complex freight routes and fleet operations across the Australian outback. Requires strong organizational skills and experience with remote logistics.',
    category: 'Logistics',
    employmentType: 'full-time',
    salaryMin: 90000,
    salaryMax: 115000,
    currency: 'AUD',
    locationCity: 'Alice Springs',
    locationState: 'NT',
    locationCountry: 'Australia',
    workMode: 'onsite',
    visaSponsorship: false,
    skills: ['Supply Chain', 'Operations Management', 'Fleet Management'],
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
