import { z } from 'zod';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  created_at: string;
  url: string;
}

export interface User {
  id: string;
  email: string;
  avatar_url?: string;
}

export const FileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  size: z.number().positive(),
  type: z.string().min(1),
  created_at: z.string().datetime(),
  url: z.string().url()
});

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  avatar_url: z.string().url().optional()
});