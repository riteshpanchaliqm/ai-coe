# AI Tools and Runtime AI Review Prompt

Check both AI-assisted development tooling and runtime AI capabilities.

## AI-assisted development checks

- AI development tools are disclosed if used.
- Tools such as GitHub Copilot, Cursor, Kiro, Claude Code, ChatGPT, or similar are identified.
- Expected use is stated: code generation, completion, refactoring, tests, documentation, architecture assistance, debugging.
- Generated code review controls are stated.

## Runtime AI capability checks

- Runtime AI capabilities are declared if present.
- LLM provider or platform is identified: OpenAI, Anthropic, Gemini, AWS Bedrock, Azure OpenAI, local/self-hosted.
- RAG, embeddings, vector search, document processing, multimodal processing, agentic workflows, classification, extraction, or summarization are identified.
- Vector DB or vector search requirement is declared if RAG/embeddings/vector search is used.
- Data sent to AI providers is classified: public, internal, client, personal, sensitive, regulated.
- AI-specific risks and controls are documented.

## Evidence to collect

- Dependencies and imports: OpenAI, Anthropic, Gemini, Bedrock SDKs, LangChain, LlamaIndex, Vercel AI SDK, Semantic Kernel.
- Prompt templates, agent/workflow code, embedding calls, retrieval pipelines.
- Vector DB clients: pgvector, Pinecone, Weaviate, Qdrant, Milvus, Chroma, OpenSearch vector.
- Environment variables: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `AWS_REGION`, `BEDROCK_*`, `AI_PROVIDER`, `AI_MODEL`, `EMBEDDING_MODEL`, `VECTOR_DB_URL`.
- Documentation for use of Copilot/Cursor/Kiro/Claude Code/ChatGPT.

## Decision rules

- Mark runtime AI not applicable when no AI dependencies, prompts, model calls, embeddings, or vector DB code are present.
- Mark needs clarification when AI dependencies exist but provider, data type, or use case is not documented.
- Mark not met when client, personal, sensitive, or regulated data appears to be sent to a provider without explicit review/controls.
