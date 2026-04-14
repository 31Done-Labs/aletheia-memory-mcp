# Aletheia_3: Architectural Queries & Ambiguities

## 1. Data Granularity & Lifecycle
- **Resolution**: A secondary, LLM-driven "Distillation Process" (running on The Dragon) will periodically scan the event buffer. When the agent identifies a pattern, a significant milestone, or a high-density cluster of related events, it will "promote" that information into a permanent, structured Knowledge Fragment. We will rely on semantic judgment, though we must identify a highly capable model for this role.
- **Resolution (Persistence)**: The system shall prioritize the continuous growth of the graph, maintaining all event data within the primary active structure to preserve the full historical context. However, the architecture must be hyper-aware of future scalability, supporting a transition to a Tiered Retention Strategy (Archival/Cold Storage) should traversal complexity impact performance.

## 2. Embedding Strategy
- **Resolution (Multi-Modal Pipeline)**: The ingestion architecture shall be designed to support specialized embedding paths. The system must be capable of routing different data types (e.g., technical code, conversational text, and potentially future modalities like audio or vision) to specialized embedding models to ensure the highest fidelity of semantic representation within the vector space.
- **Resource Constraint**: How much computational overhead can we allocate to the "Distillation Pipeline" on The 
Dragon without impacting real-time inference latency?

## 3. Schema & Relationship Complexity
- **Question**: How deep should the "Graph Traversal" requirement go? Are we focusing on 1-hop or 2-hop relationships for real-time queries, or do we need the ability to perform deep, multi-hop reasoning?
- **Ambiguity**: How do we define the "Edge" types? Should we start with a hyper-minimal set (e.g., `part_of`, `related_to`, `occurred_at`) and expand, or do we need a highly complex, pre-defined ontology?

## 4. Integration & Interface
- **Question**: For the "Multi-Modal Ingestion," what is the required capability for image processing? Are we storing only the metadata/tags, or are we performing visual feature extraction (vectors) for the images themselves?
- **Constraint**: How strictly should the MCP interface be decoupled from the underlying ArangoDB query language? Should the agent only send high-level "intent" (e.s., "Find me X") and let a middle-layer translate it into AQL?
