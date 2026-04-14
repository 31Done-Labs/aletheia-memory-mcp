import { z } from 'zod';

export const KnowledgeFragmentSchema = z.object({
  _key: z.string().optional(),
  _id: z.string().optional(),
  summary: z.string(),
  source_event_ids: z.array(z.string()),
  created_at: z.string().datetime(),
  embedding: z.array(z.number()).length(1536).optional(),
  metadata: z.record(z.any()).default({}),
});

export type KnowledgeFragment = z.infer<typeof KnowledgeFragmentSchema>;
