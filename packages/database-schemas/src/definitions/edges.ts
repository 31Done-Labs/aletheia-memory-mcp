import { z } from 'zod';

export const EdgeTypeSchema = z.enum([
  'PART_OF',
  'RELATED_TO',
  'OCCURRED_AT',
  'AUTHORED_BY',
  'WITNESSED_BY',
  'EVIDENCED_BY',
  'REFERENCES'
]);

export const EdgeSchema = z.object({
  _key: z.string().optional(),
  _id: z.string().optional(),
  _from: z.string(),
  _to: z.string(),
  type: EdgeTypeSchema,
  weight: z.number().min(0).max(1).default(1),
  metadata: z.record(z.any()).default({}),
});

export type Edge = z.infer<typeof EdgeSchema>;
export type EdgeType = z.infer<typeof EdgeTypeSchema>;
