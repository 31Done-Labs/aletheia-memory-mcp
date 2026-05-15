import { aql } from 'arangojs';
import { ArangoClient } from '../database/arango-client.js';
import { 
  Node, NodeSchema, 
  Event, EventSchema, 
  Edge, EdgeSchema,
  KnowledgeFragment, KnowledgeFragmentSchema 
} from '@aletheia/database-schemas';
import { config } from '@aletheia/config';

export class MemoryService {
  /**
   * Persist a new event log
   */
  async saveEvent(eventData: any): Promise<Event> {
    const event = EventSchema.parse(eventData);
    const db = await ArangoClient.getInstance();
    const collection = db.collection('Events');
    
    const meta = await collection.save(event);
    return { ...event, _key: meta._key, _id: meta._id };
  }

  /**
   * Upsert an entity (User, Project, Node)
   */
  async upsertEntity(nodeData: any): Promise<Node> {
    const node = NodeSchema.parse(nodeData);
    const db = await ArangoClient.getInstance();
    const collection = db.collection('Nodes');
    
    const query = aql`
      UPSERT { name: ${node.name}, type: ${node.type} }
      INSERT ${node}
      UPDATE ${node}
      IN Nodes
      RETURN NEW
    `;
    
    const cursor = await db.query(query);
    return await cursor.next();
  }

  /**
   * Create a relationship between two vertices
   */
  async link(edgeData: any): Promise<Edge> {
    const edge = EdgeSchema.parse(edgeData);
    const db = await ArangoClient.getInstance();
    const collection = db.collection('Edges');
    
    const meta = await collection.save(edge);
    return { ...edge, _key: meta._key, _id: meta._id };
  }

  /**
   * Hybrid Search (Semantic + FTS + Graph)
   * Weighting: 70% Semantic, 30% Keyword
   */
  async hybridSearch(params: {
    query: string;
    vector?: number[];
    limit?: number;
    threshold?: number;
  }) {
    const db = await ArangoClient.getInstance();
    const { vectorWeight, ftsWeight } = config.search;
    const limit = params.limit || 10;

    // This is a conceptual AQL for Hybrid Search in ArangoDB 3.12
    // It combines Vector Similarity and ArangoSearch (FTS)
    const searchQuery = aql`
      FOR doc IN AletheiaSearch
        SEARCH ANALYZER(
          TOKENS(${params.query}, "text_en") ALL == doc.content,
          "text_en"
        )
        
        LET ftsScore = BM25(doc)
        LET vectorScore = ${params.vector ? aql`COSINE_SIMILARITY(doc.embedding, ${params.vector})` : aql`0`}
        
        LET finalScore = (ftsScore * ${ftsWeight}) + (vectorScore * ${vectorWeight})
        
        SORT finalScore DESC
        LIMIT ${limit}
        RETURN doc
    `;

    const cursor = await db.query(searchQuery);
    return await cursor.all();
  }

  /**
   * Multi-hop Context Retrieval
   */
  async getContext(vertexId: string, depth: number = 2) {
    const db = await ArangoClient.getInstance();
    const query = aql`
      FOR v, e, p IN 1..${depth} ANY ${vertexId} Edges
        RETURN { vertex: v, edge: e }
    `;
    
    const cursor = await db.query(query);
    return await cursor.all();
  }
}
