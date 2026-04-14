import { NodeSchema, EventSchema, KnowledgeFragmentSchema, EdgeSchema } from './index';

const testNode = {
  name: "Brett",
  type: "user",
  metadata: { role: "admin" }
};

const testEvent = {
  content: "User logged in",
  type: "log",
  timestamp: new Date().toISOString(),
  source: "web-app",
  embedding: new Array(1536).fill(0.1)
};

const testFragment = {
  summary: "User activity summary",
  source_event_ids: ["events/1", "events/2"],
  created_at: new Date().toISOString(),
  embedding: new Array(1536).fill(0.5)
};

const testEdge = {
  _from: "Nodes/1",
  _to: "Events/1",
  type: "AUTHORED_BY",
  weight: 0.8
};

try {
  NodeSchema.parse(testNode);
  console.log("NodeSchema valid");
  
  EventSchema.parse(testEvent);
  console.log("EventSchema valid");
  
  KnowledgeFragmentSchema.parse(testFragment);
  console.log("KnowledgeFragmentSchema valid");
  
  EdgeSchema.parse(testEdge);
  console.log("EdgeSchema valid");
  
  console.log("All schemas verified successfully!");
} catch (error) {
  console.error("Schema verification failed:", error);
  process.exit(1);
}
