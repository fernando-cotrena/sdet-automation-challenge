import { z } from 'zod';

export const PetCategorySchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
});

export const PetTagSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
});

export const PetStatusSchema = z.enum(['available', 'pending', 'sold']);

export const PetSchema = z.object({
  id: z.number(),
  category: PetCategorySchema.optional(),
  name: z.string().min(1),
  photoUrls: z.array(z.string()),
  tags: z.array(PetTagSchema).optional(),
  status: PetStatusSchema.optional(),
});

export const ApiResponseSchema = z.object({
  code: z.number().optional(),
  type: z.string().optional(),
  message: z.string().optional(),
});

export type PetCategory = z.infer<typeof PetCategorySchema>;
export type PetTag = z.infer<typeof PetTagSchema>;
export type PetStatus = z.infer<typeof PetStatusSchema>;
export type Pet = z.infer<typeof PetSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
