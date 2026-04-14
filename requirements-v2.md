# Aletheia_3: Requirement Specification v2

## 1. Overview
Aletheia_3 is a next-generation, multi-modal memory architecture designed to serve as the long-term cognitive foundation for the Aki agent ecosystem. It utilizes a unified graph-database approach to manage complex relationships, semantic embeddings, and full-text search capabilities.

## 2. Core Objectives
- **Unified Intelligence**: Enable the agent to navigate between disparate data types (text, logs, images, structural metadata) using a single, integrated query language.
- **Relational Context**: Implement a graph-based structure to represent the connections between entities (users, nodes, projects) and events (decisions, logs, milestones).
- **Hybrid Retrieval**: Achieve high-precision retrieval by combining semantic similarity, keyword matching, and graph traversal.
- **Automated Distillation**: Implement processes for the periodic summarization of raw event logs into high-level, permanent knowledge fragments.

## 3. Functional Requirements

### 3.1 Hybrid Retrieval Engine (The "Search" Pillar)
The system must support a "triple-threat" query capability:
- **Vector Similarity**: Integration with embedding models (e.g., hosted on The Dragon) to perform high-dimensional similarity searches.
- **Full-Text Search (FTS)**: Utilization of ArangoSearch (or equivalent) for linguistic, keyword, and pattern-based matching.
- **Graph Traversal**: The ability to perform multi-hop queries (e.g., "Find all events related to Project X that were witnessed by User Y").
- **Weighted Scoring**: A mechanism to calculate a unified relevance score that blends the results from all three vectors.

### 3.2 Multi-Modal Ingestion (The "Ingest" Pillar)
- **Structured Ingestion**: Support for JSON/MML payloads from webhooks (e.g., `doc_weaver`).
- **Unstructured Ingestion**: Ability to ingest raw text logs and image metadata.
- **Entity Extraction**: Automated identification of entities (names, dates, locations) during the ingestion process.
- **Multi-Modal Pipeline**: The architecture shall support specialized embedding paths for different data types (e.g., technical code vs. conversational text) to ensure high-fidelity semantic representation.

### 3.3 Knowledge Distillation (The "Evolution" Pillar)
- **Summarization Pipelines**: Scheduled tasks to analyze high-frequency event logs and generate "distilled" vertices representing long-term memory.
- **Asynchronous Distillation (The 'Dream' Protocol)**: The distillation of raw events into permanent knowledge fragments shall be executed as an asynchronous, low-priority background process to ensure that computational overhead does not interfere with real-time inference latency.
- **Lifecycle Management**: Mechanisms to archive or prune low-significance, high-volume telemetry data to prevent graph bloating.

### 3.4 Schema & Relationship Complexity
- **Hierarchical Traversal**: Support for dual-depth retrieval:
    - **Operational Depth**: Low-latency, shallow traversals (1-2 hops) for standard tasks.
    - **Analytical Depth**: Deep, multi-hop traversals for complex, research-oriented queries.
- **Evolving Ontology**: A "Schema-on-Write" approach starting with a Minimal Core Ontology (e.g., `part_of`, `related_to`, `occurred_at`), allowing the distillation pipeline to dynamically introduce new edge types as relationships are identified.

### 3.5 Integration & Interface
- **Semantic Translation Layer**: The MCP interface will use high-level, intent-based commands (e.g., `find_related_events`), with a middle-layer translating these into complex AQL traversals.
- **Multi-Modal Interface**: Implementation of a Hybrid Vector-Metadata approach where images undergo Tier 1 extraction (textual descriptors via VLM) and high-significance images undergo Tier 2 extraction (dense vector embedding).

## 4. Non-Functional Requirements

### 4.1 Performance & Scalability
- **Low-Latency Retrieval**: Queries must return results in sub-second timeframes to maintain agent responsiveness.
- **Scalable Topology**: The architecture must accommodate the expanding lab mesh (The Beast, The Dragon, The Sorcerer).

### 4.2 Reliability & Integrity
- **Schema Enforcement**: Strict validation of incoming data to ensure graph integrity.
- **Persistence**: Durable storage with robust backup and recovery protocols.

## 5. Architectural Constraints
- **Primary Database**: ArangoDB (Graph/Document/Search).
- **Embedding Source**: External embedding-as-a-service (e.g., local NVIDIA-accelerated endpoints).
- **Interface**: MCP (Model Context Protocol) for agentic interaction.
