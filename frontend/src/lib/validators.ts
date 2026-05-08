import { z } from 'zod';

export const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  careerPageUrl: z.string().url('Invalid URL'),
  sourceType: z.enum(['greenhouse', 'lever', 'ashby', 'custom']),
});

export const keywordSchema = z.object({
  keyword: z.string().min(1, 'Keyword is required'),
});

export const settingsSchema = z.object({
  enabled: z.boolean(),
  emailAddress: z.string().email(),
  frequency: z.enum(['daily', 'every-2-days', 'weekly']),
  preferredTime: z.string(),
  minimumMatchScore: z.number().min(0).max(100),
});
