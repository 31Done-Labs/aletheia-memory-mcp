import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  Tool
} from '@modelcontextprotocol/sdk/types.js';
import { MemoryService } from '@aletheia/core-logic';
import { z } from 'zod';

export class AletheiaMcpServer {
  private server: Server;
  private memoryService: MemoryService;

  constructor() {
    this.server = new Server(
      {
        name: 'aletheia-memory-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.memoryService = new MemoryService();
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.getToolDefinitions(),
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'save_event':
            const eventParams = z.object({
              content: z.string(),
              type: z.string(),
              timestamp: z.string().datetime(),
              source: z.string(),
              embedding: z.array(z.number()).length(1536).optional(),
              metadata: z.record(z.unknown()).optional(),
            }).parse(args);
            return { content: [{ type: 'text', text: JSON.stringify(await this.memoryService.saveEvent(eventParams)) }] };
          
          case 'upsert_entity':
            const entityParams = z.object({
              name: z.string(),
              type: z.enum(['user', 'project', 'node', 'agent', 'tag']),
              metadata: z.record(z.unknown()).optional(),
            }).parse(args);
            return { content: [{ type: 'text', text: JSON.stringify(await this.memoryService.upsertEntity(entityParams)) }] };
          
          case 'search_memory':
            const searchParams = z.object({
              query: z.string(),
              vector: z.array(z.number()).optional(),
              limit: z.number().optional()
            }).parse(args);
            return { content: [{ type: 'text', text: JSON.stringify(await this.memoryService.hybridSearch(searchParams)) }] };
          
          case 'get_context':
            const contextParams = z.object({
              id: z.string(),
              depth: z.number().optional()
            }).parse(args);
            return { content: [{ type: 'text', text: JSON.stringify(await this.memoryService.getContext(contextParams.id, contextParams.depth)) }] };
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: error.message }],
        };
      }
    });
  }

  private getToolDefinitions(): Tool[] {
    return [
      {
        name: 'save_event',
        description: 'Store a raw conversational or system event log in Aletheia long-term memory.',
        inputSchema: {
          type: 'object',
          properties: {
            content: { type: 'string', description: 'The raw content of the event' },
            type: { type: 'string', description: 'Type of event (log, message, decision)' },
            timestamp: { type: 'string', format: 'date-time' },
            source: { type: 'string', description: 'Source of the event' },
            embedding: { type: 'array', items: { type: 'number' }, description: '1536-dim vector' },
            metadata: { type: 'object' }
          },
          required: ['content', 'type', 'timestamp', 'source']
        }
      },
      {
        name: 'upsert_entity',
        description: 'Register or update an entity (User, Project, Agent, Node) in the knowledge graph.',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            type: { type: 'string', enum: ['user', 'project', 'node', 'agent', 'tag'] },
            metadata: { type: 'object' }
          },
          required: ['name', 'type']
        }
      },
      {
        name: 'search_memory',
        description: 'Perform a hybrid (vector + keyword) search across Aletheia memory.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string' },
            vector: { type: 'array', items: { type: 'number' } },
            limit: { type: 'number' }
          },
          required: ['query']
        }
      },
      {
        name: 'get_context',
        description: 'Retrieve deep graph context (multi-hop) for a specific entity.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ArangoDB document _id' },
            depth: { type: 'number', default: 2 }
          },
          required: ['id']
        }
      }
    ];
  }

  public getMcpServer() {
    return this.server;
  }
}
