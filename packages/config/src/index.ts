import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  arango: z.object({
    url: z.string().url().default('http://localhost:8529'),
    dbName: z.string().default('aletheia_3'),
    user: z.string().default('root'),
    password: z.string().optional(),
    jwtToken: z.string().optional(),
    useJwt: z.boolean().default(true),
  }),
  embeddings: z.object({
    dimensions: z.number().default(1536),
    model: z.string().default('text-embedding-3-small'),
  }),
  search: z.object({
    vectorWeight: z.number().min(0).max(1).default(0.7),
    ftsWeight: z.number().min(0).max(1).default(0.3),
  }),
  env: z.enum(['development', 'production', 'test']).default('development'),
});

export type Config = z.infer<typeof configSchema>;

let parsedConfig;
try {
  parsedConfig = configSchema.parse({
    arango: {
      url: process.env.ARANGO_URL,
      dbName: process.env.ARANGO_DB,
      user: process.env.ARANGO_USER,
      password: process.env.ARANGO_PASSWORD,
      jwtToken: process.env.ARANGO_JWT_TOKEN,
      useJwt: process.env.ARANGO_USE_JWT !== undefined ? process.env.ARANGO_USE_JWT === 'true' : undefined,
    },
    embeddings: {
      dimensions: process.env.EMBEDDING_DIMENSIONS ? parseInt(process.env.EMBEDDING_DIMENSIONS) : undefined,
      model: process.env.EMBEDDING_MODEL,
    },
    search: {
      vectorWeight: process.env.SEARCH_VECTOR_WEIGHT ? parseFloat(process.env.SEARCH_VECTOR_WEIGHT) : undefined,
      ftsWeight: process.env.SEARCH_FTS_WEIGHT ? parseFloat(process.env.SEARCH_FTS_WEIGHT) : undefined,
    },
    env: process.env.NODE_ENV,
  });
} catch (error) {
  throw new Error(`Configuration validation failed: ${error instanceof z.ZodError ? JSON.stringify(error.format()) : error}`);
}

export const config = parsedConfig;
