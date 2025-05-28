# AI-Powered Trivia Question Generator

## Overview

This project is an AI-driven trivia question generator built using LangChain's ReAct agent architecture, Supabase for vector-based semantic retrieval, and OpenAI's GPT models. It dynamically generates multiple-choice questions grounded in context retrieved from a Supabase vector database.

---

## Environment Setup

### 1. Clone the Repository and Install Dependencies

```bash
git clone https://github.com/KevinDeaJones/Informulate.git
cd frontend && npm install
cd ../backend && npm install
```

### 2. Configure Supabase

#### Option A: Use Provided Supabase Project

Create a `.env` file in the backend root:

```env
OPENAI_API_KEY=[YOUR_OPENAI_API_KEY]
SUPABASE_URL=https://nwrumscddywzhdqlispk.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53cnVtc2NkZHl3emhkcWxpc3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTE1NTEsImV4cCI6MjA2Mzc2NzU1MX0.0Aa3BELR4SJItWe0rqg3frgjfFF7coxVzuGrD-b1jzc
```

> Note: The provided key is a public anon key—suitable for querying but not for ingestion.

#### Option B: Use Your Own Supabase Project

* Sign up at [Supabase](https://supabase.com)
* Create a new project
* Add the following to `.env` (use service role key for ingestion):

```env
OPENAI_API_KEY=[YOUR_OPENAI_API_KEY]
SUPABASE_URL=[YOUR_SUPABASE_URL]
SUPABASE_KEY=[YOUR_SERVICE_ROLE_KEY]
```

* Enable the `vector` extension:

```sql
create extension if not exists vector;
```

* Create the `trivia_facts` table:

```sql
CREATE TABLE trivia_facts (
  id uuid DEFAULT uuid_generate_v4(),
  embedding vector(1536),
  content text,
  metadata jsonb,
  PRIMARY KEY (id)
);
```

* Insert data:

```bash
cd backend
npm run injest
```

* Define the semantic match function:

```sql
CREATE OR REPLACE FUNCTION match_trivia (
  query_embedding vector(1536),
  match_count int,
  filter jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.content,
    t.metadata,
    1 - (t.embedding <#> query_embedding) AS similarity
  FROM trivia_facts t
  WHERE t.metadata @> filter
  ORDER BY t.embedding <#> query_embedding
  LIMIT match_count;
END;
$$;
```

### 3. Run the Application

```bash
cd frontend && npm start
cd backend && npm start
```

> Default ports: frontend on 3000, backend on 3001

---


## Design Decisions

### ReAct Agent with Tool Modularity

Used LangChain's `initializeAgentExecutorWithOptions` with `zero-shot-react-description` to enable dynamic tool usage:

* `VectorSearchTool()` for semantic retrieval
* `CheckNoResult()` to validate search results

### Robust Output Parsing

* Applied `jsonrepair` to handle malformed JSON
* Enforced strict schema validation (question, 4 options, answerIndex)

### Retry & Resilience Logic

* Agent call wrapped in retry logic (up to 3 attempts)
* Graceful fallback to dummy question ensures stable UX

### Temperature Tuning

* Set temperature to 0.8 for more creative, non-repetitive question generation

---

## Assumptions

* **LLM Token Limits Are Not Exceeded**: The context window stays within the bounds of the selected OpenAI model.
* **Supabase Vector Search Latency Is Acceptable**: Assumes retrieval is performant enough for real-time use.
* **Tool Descriptions Remain Stable**: ReAct behavior relies on consistent tool prompts.
* **LLM Is Available and Consistent**: Relies on OpenAI APIs being up, responsive, and consistent.

---

## Technical Challenges Tackled

### 1. Prompt Engineering

* Iteratively tuned prompts for structured JSON, context grounding, and graceful fallback behavior

### 2. Tool Coordination via ReAct

* Ensured clear signal to agent when to invoke vector search, validate results, or retry

### 3. Output Cleanup and Validation

* Integrated `jsonrepair` and schema checks to avoid runtime issues from malformed LLM output

### 4. Retry Strategy

* Designed robust retry loop with backoff and fallback to preserve user experience

---

## If I Had More Time

### 1. Latency Optimization (\~5s average)

* Replace ReAct with function-calling agents or simpler chains
* Pre-cache frequent questions
* Add Supabase query caching or concurrency

### 2. Fine-Tuned or Distilled Models

* Use a smaller, task-specific model for faster question generation
* Offload simple questions from GPT-4o to cheaper/faster models

### 3. Smarter Topic Seeding

* Dynamically select topics using user context or content popularity
* Enables offline pre-generation to reduce real-time load

### 4. Usage Monitoring & Tracing

* Integrate LangSmith or basic tracing to monitor:

  * Tool usage
  * Retry rates
  * Latency breakdowns
  * Failure modes

### 5. Answer Explanation & Feedback Loop

* Generate rationale for answers
* Collect user feedback for future fine-tuning

### 6. Lightweight Interface

* Simple CLI or React UI for testing, tracing, and feedback
* Easier demoing and usability validation

---
