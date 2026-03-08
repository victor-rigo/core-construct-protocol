

# Plan: AI-Generated Protocols via Lovable AI Gateway

## Overview
Replace the hardcoded `protocolEngine.ts` logic with AI-generated protocols using the Lovable AI Gateway (Gemini). The system prompt will be crafted using best practices from the uploaded research document. The AI will receive the user's form data and generate personalized protocols for each module.

## Architecture

```text
Onboarding Form → Supabase (form_responses + profiles)
                         ↓
              Protocol Page loads
                         ↓
         Edge Function: generate-protocol
         (system prompt + user form data)
                         ↓
         Lovable AI Gateway (Gemini 3 Flash)
                         ↓
         Structured JSON response (tool calling)
                         ↓
         Save to generated_protocols table
                         ↓
         Display in Protocol tabs
```

## Implementation Steps

### 1. Edge Function: `supabase/functions/generate-protocol/index.ts`
- Accepts user profile data as input
- Builds a detailed system prompt in Portuguese with:
  - **Identity**: "You are a precision protocol generator for KOR platform"
  - **Rules**: Only use provided data, never invent, flag missing fields
  - **Structure**: Generate 5 modules (Routine, Physical, Nutrition, Financial, Entrepreneur)
  - **Constraints**: Respect allergies, injuries, work schedule, financial limits
  - **Output format**: Use tool calling to return structured JSON matching the existing TypeScript interfaces
- Uses `google/gemini-3-flash-preview` model
- Tool calling schema mirrors existing `protocolEngine.ts` output structure
- Handles 429/402 errors
- Update `supabase/config.toml` with function config

### 2. System Prompt Design (applying uploaded research)
Based on the research document, the prompt will use:
- **XML tags** for data sections (`<user_data>`, `<rules>`, `<output_format>`)
- **Chain-of-Thought Level 2**: Explicit reasoning steps before generating each module
- **The 3 mandatory agent instructions**: Persistence, tool use, planning
- **Positive constraints** instead of negatives
- **Few-shot example** of one complete protocol output
- Structured tool calling for reliable JSON extraction

### 3. Frontend Integration
- **New file**: `src/lib/aiProtocolService.ts` — client-side service to call the edge function via `supabase.functions.invoke()`
- **Update `src/pages/Protocol.tsx`**: 
  - Add loading state for AI generation
  - Call AI service when no saved protocol exists OR when user triggers regeneration
  - Save the AI response to `generated_protocols` table (new column `ai_protocol_data` JSONB)
  - Display AI-generated content in each tab component
- **Update each protocol component** (`ProtocolRoutine`, `ProtocolPhysical`, `ProtocolFinancial`, `ProtocolEntrepreneur`, `ProtocolOverview`):
  - Accept optional `aiProtocol` prop
  - When `aiProtocol` exists, render from AI data
  - Fallback to existing `protocolEngine.ts` logic if AI fails

### 4. Database Migration
- Add `ai_protocol_data` (JSONB, nullable) column to `generated_protocols` table to store the full AI-generated protocol

### 5. AI Output Schema (via tool calling)
The tool calling function will define this structure:
- `routine`: daily schedule array, weekly focus, alerts
- `physical`: workout plan (exercises with sets/reps/rest), nutrition plan (meals, macros, hydration, supplements)
- `financial`: diagnosis, income strategy, expense analysis, investment recommendations
- `entrepreneur`: (conditional) business KPIs, margin optimization, acquisition strategy, scale actions
- `overview`: profile summary, priority actions, missing field warnings

### 6. Onboarding Flow Update
- In `handleComplete()` in `Onboarding.tsx`: after saving form responses, trigger the edge function to generate the AI protocol
- Store result in `generated_protocols.ai_protocol_data`
- Redirect to `/protocol` only after AI generation completes (with timeout fallback)

## Key Design Decisions
- **Gemini 3 Flash** for speed and cost efficiency
- **Tool calling** (not raw JSON) for reliable structured output
- **Fallback to existing engine** if AI fails — no breaking change
- **System prompt in Portuguese** since all content is PT-BR
- **No streaming** — protocol is generated once and cached, using `supabase.functions.invoke()`

