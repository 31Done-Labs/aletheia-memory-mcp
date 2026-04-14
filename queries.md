# Aletheia_3: Architectural Queries & Ambiguities

## 1. Data Granularity & Lifecycle
- **Resolution**: A secondary, LLM-driven "Distillation Process" (running on The Dragon) will periodically scan the event buffer. When the agent identifies a pattern, a significant milestone, or a high-density cluster of related events, it will "promote" that information into a permanent, structured Knowledge Fragment. We will rely on semantic judgment, though we must identify a highly capable model for this role.
- **Resolution (Persistence)**: The system shall prioritize the continuous growth of the graph, maintaining all event data within the primary active structure to preserve the full historical context. However, the architecture must be hyper-aware of future scalability, supporting a transition to a Tiered Retention Strategy (Archival/Cold Storage) should traversal complexity impact performance.

## 2. Embedding Strategy
- **Resolution (Multi-Modal Pipeline)**: The ingestion architecture shall be designed to support specialized embedding paths. The system must be capable of routing different data types (e.g., technical code, conversational text, and potentially future modalities like audio or vision) to specialized embedding models to ensure the highest fidelity of semantic representation within the vector space.
- **Resolution (Resource Constraint)**: Asynchronous Distillation (The 'Dream' Protocol): The distillation of raw events into permanent knowledge fragments shall be executed as an asynchronous, low-priority background process. This process must be architected to ensure that the computational overhead of semantic analysis and graph updates does not interfere with the real-time inference latency of the primary agent.

## 3. Schema & Relationship Complexity
- **Resolution (Hierarchical Traversal)**: The system shall support a dual-depth retrieval architecture.
    - **Operational Depth**: Real-time queries must prioritize low-latency, shallow traversals (1-2 hops) to ensure immediate responsiveness for standard agent tasks.
    - **Analytical Depth**: The system must support deep, multi-hop traversals for complex, research-oriented queries, capable of traversing the full complexity of the graph at the cost of higher latency.
- **Resolution (Evolving Ontology)**: We will adopt a "Schema-on-Write, Evolving Ontology" approach. The system will start with a Minimal Core Ontology (e.g., `part_of`, `related_to`, `occurred_at`, `authored_by`) to maintain simplicity and performance. However, the architecture must be extensible, allowing the distillation pipeline to dynamically introduce new edge types as new relationships are identified, evolving the ontology without requiring schema migrations.

## 4. Integration & Interface
- **Question**: For the "Multi-Modal Ingestion," what is the required capability for image processing? Are we storing only the metadata/tags, or are we performing visual feature extraction (vectors) for the images themselves?
- **Constraint**: How strictly should the MCP interface be decoupled from the underlying ArangoDB query language? Should the agent only send high-level "intent" (e.s., "Find me X") and let a middle-layer translate it into AQL?
