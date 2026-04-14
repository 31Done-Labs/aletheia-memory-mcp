import { z } from 'zod';

export const NodeTypeSchema = z.enum(['user', 'project', 'node', 'agent', 'tag']);

export const NodeSchema = z.object({
  _key: z.string().optional(),
  _id: z.string().optional(),
  name: z.string(),
  type: NodeTypeSchema,
  metadata: z.record(z.any()).default({}),
});

export type Node = z.infer<typeof NodeSchema>;
export type NodeType = z.infer<typeof NodeTypeSchema>;
