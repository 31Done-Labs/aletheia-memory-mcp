import { z } from 'zod';

export const EventSchema = z.object({
  _key: z.string().optional(),
  _id: z.string().optional(),
  content: z.string(),
  type: z.string(), // e.g., 'log', 'message', 'decision'
  timestamp: z.string().datetime(),
  source: z.string(),
  embedding: z.array(z.number()).length(1536).optional(),
  metadata: z.record(z.any()).default({}),
});

export type Event = z.infer<typeof EventSchema>;
