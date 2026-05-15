import { ArangoClient } from '../database/arango-client.js';
import { config } from '@aletheia/config';

async function initialize() {
  console.log("Initializing ArangoDB for Aletheia_3...");
  
  const db = ArangoClient.getInstance();
  const collections = ['Nodes', 'Events', 'KnowledgeFragments'];
  const edgeCollections = ['Edges'];

  // 1. Create Document Collections
  for (const name of collections) {
    const col = db.collection(name);
    if (!(await col.exists())) {
      await col.create();
      console.log(`Created collection: ${name}`);
    }
  }

  // 2. Create Edge Collections
  for (const name of edgeCollections) {
    const col = db.edgeCollection(name);
    if (!(await col.exists())) {
      await col.create();
      console.log(`Created edge collection: ${name}`);
    }
  }

  // 3. Create ArangoSearch View
  const viewName = 'AletheiaSearch';
  const view = db.view(viewName);
  if (!(await view.exists())) {
    await db.createView(viewName, {
      links: {
        Events: {
          fields: {
            content: { analyzers: ['text_en'] }
          }
        },
        KnowledgeFragments: {
          fields: {
            summary: { analyzers: ['text_en'] }
          }
        },
        Nodes: {
          fields: {
            name: { analyzers: ['text_en'] }
          }
        }
      }
    });
    console.log(`Created ArangoSearch view: ${viewName}`);
  }

  // 4. Create Graph
  const graphName = 'AletheiaGraph';
  const graph = db.graph(graphName);
  if (!(await graph.exists())) {
    await graph.create({
      edgeDefinitions: [{
        collection: 'Edges',
        from: ['Nodes', 'Events', 'KnowledgeFragments'],
        to: ['Nodes', 'Events', 'KnowledgeFragments']
      }]
    });
    console.log(`Created Graph: ${graphName}`);
  }

  console.log("Database initialization complete.");
}

initialize().catch(console.error);
