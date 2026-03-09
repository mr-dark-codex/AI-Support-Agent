# AI Support Agent System Design

Below is a practical system plan + system design for a support workflow
using **One Main Agent (Orchestrator) + Small Helper Agents**.

The goal is to keep it **simple, reliable, and production‑friendly**,
not an overcomplicated AI lab project.

------------------------------------------------------------------------

# 1. Overall System Flow

Your support workflow becomes an **event-driven AI pipeline**.

``` python
Client Issue\
    ↓\
Ticket Created (Support System)\
    ↓\
Engineer Fixes Issue\
    ↓\
Resolution Template Filled\
    ↓\
Ticket Closed\
    ↓\
Webhook Trigger\
    ↓\
AI Orchestrator\
    ├ Ticket Analyzer Agent\
    ├ Tagging Agent\
    ├ Knowledge Generator Agent\
    └ Analytics Agent\
    ↓\
Data Storage\
    ├ PostgreSQL (structured data)\
    ├ Vector DB (semantic search)\
    ↓\
Outputs\
    ├ Knowledge Base\
    └ Dashboard Metrics
```

**Key idea:**\
Agents do small tasks → Orchestrator controls flow.

------------------------------------------------------------------------

# 2. Agent Architecture

Use **one orchestrator agent** that calls smaller agents as tools.

## Main Agent: Orchestrator

Responsibilities:

-   Triggered when ticket closes
-   Calls helper agents
-   Stores results
-   Updates analytics

### Pseudo Workflow

``` python
on_ticket_closed(ticket):

    analysis = ticket_analyzer(ticket)

    tags = tagging_agent(analysis)

    kb_article = knowledge_agent(analysis)

    store_kb(kb_article)

    update_metrics(analysis)

    embed_ticket(ticket)
```

------------------------------------------------------------------------

## Agent 1 --- Ticket Analyzer

Purpose: Convert messy ticket data into structured knowledge.

### Input

``` json
{
 "ticket_conversation": "...",
 "resolution_notes": "...",
 "logs": "optional"
}
```

### Output

``` json
{
 "problem_summary": "...",
 "symptoms": "...",
 "root_cause": "...",
 "resolution_steps": "...",
 "category": "...",
 "severity": "..."
}
```

------------------------------------------------------------------------

## Agent 2 --- Tagging Agent

Adds metadata automatically.

Example tags:

-   authentication
-   api
-   billing
-   infra
-   configuration
-   bug

Example Output:

``` json
{
 "tags": ["authentication", "token", "login"]
}
```

------------------------------------------------------------------------

## Agent 3 --- Knowledge Generator

Transforms analysis into troubleshooting documentation.

### Output Structure

-   Title
-   Problem
-   Symptoms
-   Root Cause
-   Resolution Steps
-   Related Tags

Example:

Title: Fix "Invalid Token" Login Error

Problem\
Users cannot login after password reset.

Symptoms\
Invalid token error.

Root Cause\
Token expiry mismatch.

Resolution\
1 Clear auth cache\
2 Generate new token\
3 Ask user to login again

------------------------------------------------------------------------

## Agent 4 --- Analytics Agent

Extracts metrics like:

-   category
-   resolution_time
-   root_cause
-   severity

Used to update dashboards.

------------------------------------------------------------------------

# 3. Database Schema

Use **PostgreSQL** for structured data.

## Tickets Table

    tickets
    ------
    ticket_id
    client_id
    title
    description
    status
    created_at
    resolved_at
    engineer
    category
    severity
    resolution_time

## Ticket Analysis Table

    ticket_analysis
    ---------------
    id
    ticket_id
    problem_summary
    symptoms
    root_cause
    resolution_steps
    created_at

## Tags Table

    tags
    ----
    tag_id
    tag_name

## Ticket Tags Table

    ticket_tags
    -----------
    ticket_id
    tag_id

## Knowledge Base Table

    knowledge_base
    --------------
    kb_id
    title
    problem
    symptoms
    root_cause
    resolution_steps
    tags
    source_ticket_id
    created_at

------------------------------------------------------------------------

# 4. Vector Search Design

Vector search enables **semantic similarity search**.

Example query:

Engineer searches:

"login issue after reset"

AI finds:

-   Ticket #324
-   Ticket #871
-   KB Article: Invalid Token Fix

## What to Embed

Store embeddings for:

-   ticket conversation
-   problem summary
-   resolution
-   knowledge articles

## Vector Database Structure

Example using **Qdrant / Pinecone / Chroma**

Collection:

    support_knowledge

Fields:

    id
    embedding
    ticket_id
    content
    tags
    type (ticket / kb)

Example Entry:

``` json
{
 "id": "ticket_234",
 "content": "User unable to login after password reset",
 "tags": ["auth", "login"],
 "type": "ticket"
}
```

------------------------------------------------------------------------

## Search Flow

New Ticket\
↓\
Embed ticket description\
↓\
Search Vector DB\
↓\
Find similar tickets\
↓\
Suggest solution

This becomes a **Support Copilot**.

------------------------------------------------------------------------

# 5. Knowledge Base Structure

Design KB for **fast troubleshooting**.

    Knowledge Base
    │
    ├ Authentication
    │   ├ Login failure
    │   ├ Token expiry
    │   └ MFA problems
    │
    ├ API
    │   ├ Invalid API key
    │   ├ Webhook failures
    │
    ├ Billing
    │   ├ Payment declined
    │
    └ Infrastructure
        ├ DNS issue
        ├ Server restart

## Article Format

Every article follows the same template.

Title

Problem\
Short description

Symptoms\
What the user sees

Root Cause\
Actual technical cause

Resolution Steps\
Step-by-step fix

Tags\
category + keywords

This makes articles **searchable and consistent**.

------------------------------------------------------------------------

# 6. Dashboard Metrics

Dashboard should help answer **support leadership questions**.

## Ticket Volume

-   Tickets per day
-   Tickets per week
-   Tickets per client

## Category Distribution

Example:

Authentication 35%\
API Issues 25%\
Billing 20%\
Infrastructure 20%

## Resolution Time

Metrics:

-   Average resolution time
-   Median resolution time
-   Resolution time by category

Example:

Auth → 1.5 hours\
API → 3 hours\
Infra → 6 hours

## Root Cause Analysis

-   User error
-   Product bug
-   Configuration
-   External dependency

Example:

User error → 42%\
Product bug → 28%\
Config issue → 18%\
External → 12%

## Recurring Issues

Example:

Invalid API key → 32 tickets\
Webhook timeout → 21 tickets\
Login token expiry → 19 tickets

This helps product teams identify **systemic issues**.

------------------------------------------------------------------------

# 7. Recommended Tech Stack

Keep the stack simple.

## Backend

-   Python
-   FastAPI
-   LangGraph (agent orchestration)

## AI

-   OpenAI
-   Claude

## Database

-   PostgreSQL

## Vector Database

-   Qdrant

## Dashboard

-   Metabase

## Knowledge Base

-   Notion
-   Confluence
-   Internal Wiki

------------------------------------------------------------------------

# 8. MVP Implementation Plan

## Phase 1 --- MVP (1--2 weeks)

-   Ticket Closed Webhook
-   AI Extract Problem + Fix
-   Generate KB Article
-   Store in Knowledge Base

## Phase 2 --- Intelligence Layer

Add:

-   automatic tagging
-   dashboard metrics
-   vector search
-   similar ticket detection

## Phase 3 --- AI Copilot

When engineer opens a ticket, AI suggests:

-   similar tickets
-   possible root cause
-   recommended fix

This significantly reduces **resolution time**.

------------------------------------------------------------------------

# 9. Final Architecture

Ticket System\
↓\
Webhook\
↓\
FastAPI Backend\
↓\
AI Orchestrator (LangGraph)\
↓\
Agents\
├ Ticket Analyzer\
├ Tagging Agent\
├ Knowledge Generator\
└ Analytics Agent\
↓\
Postgres + Vector DB\
↓\
Outputs\
├ Knowledge Base\
└ Dashboard
