import { NodeSchema, EventSchema, KnowledgeFragmentSchema, EdgeSchema } from './index';

describe('Database Schemas', () => {
  it('validates a correct Node object', () => {
    expect(() => NodeSchema.parse({ name: 'Brett', type: 'user', metadata: { role: 'admin' } })).not.toThrow();
  });

  it('validates a correct Event object', () => {
    expect(() => EventSchema.parse({
      content: 'User logged in',
      type: 'log',
      timestamp: new Date().toISOString(),
      source: 'web-app',
      embedding: new Array(1536).fill(0.1),
    })).not.toThrow();
  });

  it('validates a correct KnowledgeFragment object', () => {
    expect(() => KnowledgeFragmentSchema.parse({
      summary: 'User activity summary',
      source_event_ids: ['events/1', 'events/2'],
      created_at: new Date().toISOString(),
      embedding: new Array(1536).fill(0.5),
    })).not.toThrow();
  });

  it('validates a correct Edge object', () => {
    expect(() => EdgeSchema.parse({
      _from: 'Nodes/1',
      _to: 'Events/1',
      type: 'AUTHORED_BY',
      weight: 0.8,
    })).not.toThrow();
  });
});
