

# Plan: Fix Calorie and Macro Calculations

## Problem
The displayed daily calories and macronutrients (protein, carbs, fat) don't match the sum of what's actually in the proposed meals. Two sources of inconsistency:

1. **Fallback engine** (`protocolEngine.ts`): Calculates TDEE-based targets (e.g., 2800 kcal) but assigns fixed food portions that sum to a different total (e.g., 1900 kcal). No scaling is applied.
2. **AI-generated protocol**: The AI may return `dailyCalories` that doesn't match the sum of `meal.totalCalories`.

## Solution

### 1. Display component — always compute from meals (`ProtocolPhysical.tsx`)
Instead of showing `nutritionData.dailyCalories` and `nutritionData.macros` directly, recalculate them by summing across all meals' foods. This guarantees the header numbers always match the meal breakdown.

- `displayCalories = sum of all foods' calories across all meals`
- `displayProtein = sum of all foods' protein`
- `displayCarbs = sum of all foods' carbs`  
- `displayFat = sum of all foods' fat`
- Also recalculate each meal's `totalCalories` and `totalProtein` from its foods

### 2. Fallback engine — scale portions to match targets (`protocolEngine.ts`)
After building meals with fixed food items, calculate a scaling factor (`targetCalories / actualCalories`) and multiply all food quantities proportionally. This makes the fallback engine produce meals that actually add up to the TDEE-calculated target.

### 3. AI prompt — add validation instruction (`generate-protocol/index.ts`)
Add a rule to the system prompt: "The sum of all meal calories MUST equal dailyCalories. The sum of all food macros across meals MUST equal the macros object."

## Files Modified
- `src/components/protocol/ProtocolPhysical.tsx` — recalculate displayed totals from meal foods
- `src/lib/protocolEngine.ts` — scale food portions to match TDEE targets
- `supabase/functions/generate-protocol/index.ts` — add consistency rule to AI prompt

