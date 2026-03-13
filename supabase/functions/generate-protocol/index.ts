import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Authenticate the user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !authUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      throw new Error("Configuração do servidor incompleta.");
    }

    if (!profile) throw new Error("Dados de perfil são obrigatórios.");

    const systemPrompt = buildSystemPrompt(profile);
    const userPrompt = buildUserPrompt(profile);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_full_protocol",
              description: "Gera o protocolo completo personalizado com base nos dados do formulário do usuário.",
              parameters: protocolSchema,
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_full_protocol" } },
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const body = await response.text();
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Tente novamente em alguns segundos." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI gateway error:", status, body);
      throw new Error("Erro ao gerar protocolo. Tente novamente.");
    }

    const data = await response.json();

    // Extract structured result from tool call first
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.name === "generate_full_protocol") {
      const parsedArgs = tryParseJson(toolCall.function.arguments);
      if (parsedArgs) {
        return new Response(JSON.stringify({ protocol: parsedArgs }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Fallback: parse JSON from message content (raw JSON or markdown code block)
    const content = data?.choices?.[0]?.message?.content;
    const parsedContent = extractProtocolFromContent(content);
    if (parsedContent) {
      return new Response(JSON.stringify({ protocol: parsedContent }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.error("AI did not return valid structured protocol data", JSON.stringify(data));
    throw new Error("Erro ao processar resposta. Tente novamente.");
  } catch (e) {
    console.error("[generate-protocol] error:", e);
    const safeMessages = [
      "Configuração do servidor incompleta.",
      "Dados de perfil são obrigatórios.",
      "Erro ao gerar protocolo. Tente novamente.",
      "Erro ao processar resposta. Tente novamente.",
    ];
    const message = e instanceof Error && safeMessages.includes(e.message)
      ? e.message
      : "Erro interno. Tente novamente.";
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// ============================================================
// Parsing helpers
// ============================================================

function tryParseJson(input: unknown): any | null {
  if (!input) return null;
  if (typeof input === "object") return input;
  if (typeof input !== "string") return null;

  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

function extractProtocolFromContent(content: unknown): any | null {
  if (!content) return null;

  if (Array.isArray(content)) {
    const text = content
      .map((part) => (typeof part?.text === "string" ? part.text : typeof part === "string" ? part : ""))
      .join("\n");
    return extractProtocolFromContent(text);
  }

  if (typeof content !== "string") return null;

  const direct = tryParseJson(content);
  if (direct) return direct;

  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)?.[1];
  if (fenced) {
    const parsedFenced = tryParseJson(fenced);
    if (parsedFenced) return parsedFenced;
  }

  const firstBrace = content.indexOf("{");
  const lastBrace = content.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidate = content.slice(firstBrace, lastBrace + 1);
    return tryParseJson(candidate);
  }

  return null;
}

// ============================================================
// SYSTEM PROMPT — Engineered with XML tags, CoT, constraints
// ============================================================

function buildSystemPrompt(profile: any): string {
  return `Você é o **KOR Protocol Engine**, um gerador de protocolos de alta performance 100% personalizado.

<identity>
Você é um consultor de elite que combina:
- Personal trainer certificado NSCA/ACSM
- Nutricionista esportivo (ISSN)  
- Consultor financeiro CFP
- Estrategista empresarial
- Coach de produtividade baseado em neurociência (Huberman Lab)
</identity>

<rules>
1. Use EXCLUSIVAMENTE os dados fornecidos pelo usuário. NUNCA invente informações.
2. Se um campo estiver vazio ou ausente, SINALIZE no campo "alertas" e adapte o protocolo com valores conservadores.
3. Respeite TODAS as restrições: alergias, lesões, horários, capacidade financeira.
4. Cada recomendação deve ter justificativa baseada em evidência.
5. O protocolo deve ser IMEDIATAMENTE executável — sem generalidades.
6. Todos os textos em português brasileiro.
7. Use o método Low Volume (Samuel Meller) para treinos: poucas séries (2-3), alta intensidade (RPE 8-10), exercícios compostos como base.
8. Cálculo nutricional: Mifflin-St Jeor para BMR, multiplicador de atividade para TDEE.
9. Se o usuário informou alimentos que NÃO gosta ou alergias, NUNCA inclua esses alimentos.
10. Se o usuário NÃO pode pagar suplementos, o plano nutricional NÃO deve depender de suplementos.
11. Cada alimento no plano deve ter uma alternativa acessível com valor nutricional equivalente.
12. Hidratação: calcule peso × 35ml e compare com consumo atual.
13. Adapte refeições aos horários de trabalho do usuário.
14. Para o módulo financeiro, use os gastos reais informados pelo usuário.
15. O módulo empresário só deve ser gerado se modo_empresario === true.
16. VALIDAÇÃO OBRIGATÓRIA: A soma de todas as calorias dos alimentos de todas as refeições DEVE ser EXATAMENTE igual ao valor de dailyCalories. A soma de protein, carbs e fat de todos os alimentos DEVE ser igual aos valores em macros. Recalcule os itens alimentares até que os totais batam.
</rules>

<output_instructions>
Pense passo a passo antes de gerar cada módulo:
1. Analise os dados do usuário
2. Identifique restrições e limitações
3. Calcule valores (TDEE, macros, água, etc.)
4. Gere o protocolo respeitando todas as regras

Use a função generate_full_protocol para retornar o protocolo estruturado.
Preencha TODOS os campos obrigatórios da função.
</output_instructions>`;
}

function buildUserPrompt(profile: any): string {
  return `<user_data>
${JSON.stringify(profile, null, 2)}
</user_data>

Analise os dados acima e gere o protocolo completo personalizado usando a função generate_full_protocol.

Lembre-se:
- Calcule TDEE real com Mifflin-St Jeor
- Respeite alergias: "${profile.nutrition?.allergies || 'nenhuma'}"
- Alimentos que não gosta: "${profile.nutrition?.dislikedFoods || 'nenhum'}"
- Alimentos preferidos: "${profile.nutrition?.likedFoods || ''}"
- Condição para suplementos: "${profile.nutrition?.canAffordSupplements || 'não informado'}"
- Lesões: "${profile.physical?.injuries || 'nenhuma'}"
- Objetivo físico: "${profile.physical?.objective || 'saúde'}"
- Horário de trabalho: ${profile.personal?.workStartTime || '08:00'} às ${profile.personal?.workEndTime || '18:00'}
- Preferência de treino: "${profile.personal?.preferredTrainingTime || 'manhã'}"
- Modo empresário: ${profile.entrepreneur?.enabled ? 'SIM' : 'NÃO'}
- Refeições por dia: ${profile.nutrition?.mealsPerDay || 4}
- Consumo de água: "${profile.nutrition?.dailyWaterIntake || 'não informado'}"
- Consumo de álcool: "${profile.nutrition?.alcoholConsumption || 'não'}"
- Tabagismo: "${profile.nutrition?.smoking || 'não'}"`;
}

// ============================================================
// TOOL CALLING SCHEMA
// ============================================================

const exerciseSchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Nome do exercício" },
    sets: { type: "number", description: "Número de séries de trabalho" },
    reps: { type: "string", description: "Faixa de repetições, ex: '6-8'" },
    rest: { type: "string", description: "Tempo de descanso, ex: '120s'" },
    notes: { type: "string", description: "Notas técnicas e RPE" },
  },
  required: ["name", "sets", "reps", "rest"],
  additionalProperties: false,
};

const workoutDaySchema = {
  type: "object",
  properties: {
    day: { type: "string" },
    focus: { type: "string" },
    warmup: { type: "string" },
    duration: { type: "string" },
    cooldown: { type: "string" },
    exercises: { type: "array", items: exerciseSchema },
  },
  required: ["day", "focus", "warmup", "duration", "cooldown", "exercises"],
  additionalProperties: false,
};

const foodItemSchema = {
  type: "object",
  properties: {
    item: { type: "string" },
    quantity: { type: "string" },
    calories: { type: "number" },
    protein: { type: "number" },
    carbs: { type: "number" },
    fat: { type: "number" },
    alternative: { type: "string", description: "Alternativa acessível com valor nutricional equivalente" },
  },
  required: ["item", "quantity", "calories", "protein", "carbs", "fat"],
  additionalProperties: false,
};

const mealSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    time: { type: "string" },
    foods: { type: "array", items: foodItemSchema },
    totalCalories: { type: "number" },
    totalProtein: { type: "number" },
  },
  required: ["name", "time", "foods", "totalCalories", "totalProtein"],
  additionalProperties: false,
};

const supplementSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    dosage: { type: "string" },
    timing: { type: "string" },
    reference: { type: "string" },
  },
  required: ["name", "dosage", "timing", "reference"],
  additionalProperties: false,
};

const dailyActivitySchema = {
  type: "object",
  properties: {
    time: { type: "string" },
    activity: { type: "string" },
    icon: { type: "string" },
  },
  required: ["time", "activity", "icon"],
  additionalProperties: false,
};

const weeklyFocusSchema = {
  type: "object",
  properties: {
    day: { type: "string" },
    focus: { type: "string" },
    detail: { type: "string" },
  },
  required: ["day", "focus", "detail"],
  additionalProperties: false,
};

const statusEnum = { type: "string", enum: ["good", "warning", "critical"] };

const protocolSchema = {
  type: "object",
  properties: {
    routine: {
      type: "object",
      properties: {
        dailyProtocol: { type: "array", items: dailyActivitySchema },
        weeklyProtocol: { type: "array", items: weeklyFocusSchema },
        alerts: { type: "array", items: { type: "object", properties: { type: { type: "string" }, title: { type: "string" }, description: { type: "string" } }, required: ["type", "title", "description"], additionalProperties: false } },
      },
      required: ["dailyProtocol", "weeklyProtocol", "alerts"],
      additionalProperties: false,
    },
    physical: {
      type: "object",
      properties: {
        workoutPlan: { type: "array", items: workoutDaySchema },
        alerts: { type: "array", items: { type: "object", properties: { type: { type: "string" }, title: { type: "string" }, description: { type: "string" } }, required: ["type", "title", "description"], additionalProperties: false } },
      },
      required: ["workoutPlan", "alerts"],
      additionalProperties: false,
    },
    nutrition: {
      type: "object",
      properties: {
        goal: { type: "string" },
        dailyCalories: { type: "number" },
        macros: {
          type: "object",
          properties: {
            protein: { type: "number" },
            carbs: { type: "number" },
            fat: { type: "number" },
          },
          required: ["protein", "carbs", "fat"],
          additionalProperties: false,
        },
        meals: { type: "array", items: mealSchema },
        hydration: {
          type: "object",
          properties: {
            currentIntake: { type: "string" },
            recommendedLiters: { type: "number" },
            recommendedMl: { type: "number" },
            difference: { type: "string" },
          },
          required: ["currentIntake", "recommendedLiters", "recommendedMl", "difference"],
          additionalProperties: false,
        },
        supplements: { type: "array", items: supplementSchema },
        alerts: { type: "array", items: { type: "object", properties: { type: { type: "string" }, title: { type: "string" }, description: { type: "string" } }, required: ["type", "title", "description"], additionalProperties: false } },
      },
      required: ["goal", "dailyCalories", "macros", "meals", "hydration", "supplements", "alerts"],
      additionalProperties: false,
    },
    financial: {
      type: "object",
      properties: {
        diagnosis: {
          type: "object",
          properties: {
            income: { type: "number" },
            totalExpenses: { type: "number" },
            savings: { type: "number" },
            savingsRate: { type: "string" },
            debts: { type: "number" },
            investments: { type: "number" },
          },
          required: ["income", "totalExpenses", "savings", "savingsRate"],
          additionalProperties: false,
        },
        expenseBreakdown: {
          type: "array",
          items: {
            type: "object",
            properties: {
              category: { type: "string" },
              label: { type: "string" },
              amount: { type: "number" },
              percentage: { type: "string" },
              recommendation: { type: "string" },
            },
            required: ["category", "label", "amount", "percentage"],
            additionalProperties: false,
          },
        },
        incomeStrategy: { type: "string" },
        skills: { type: "array", items: { type: "string" } },
        investmentStrategy: { type: "string" },
        monetization: { type: "string" },
        alerts: { type: "array", items: { type: "object", properties: { type: { type: "string" }, title: { type: "string" }, description: { type: "string" } }, required: ["type", "title", "description"], additionalProperties: false } },
      },
      required: ["diagnosis", "expenseBreakdown", "incomeStrategy", "skills", "investmentStrategy", "monetization", "alerts"],
      additionalProperties: false,
    },
    entrepreneur: {
      type: "object",
      properties: {
        enabled: { type: "boolean" },
        financialDiagnosis: {
          type: "array",
          items: { type: "object", properties: { metric: { type: "string" }, value: { type: "string" }, status: statusEnum }, required: ["metric", "value", "status"], additionalProperties: false },
        },
        marginScenarios: {
          type: "array",
          items: {
            type: "object",
            properties: { scenario: { type: "string" }, newMargin: { type: "string" }, monthlyProfit: { type: "string" }, annualProfit: { type: "string" }, gain: { type: "string" } },
            required: ["scenario", "newMargin", "monthlyProfit", "annualProfit", "gain"],
            additionalProperties: false,
          },
        },
        acquisitionMetrics: {
          type: "array",
          items: {
            type: "object",
            properties: { channel: { type: "string" }, estimatedCAC: { type: "string" }, ltv: { type: "string" }, ltvCacRatio: { type: "string" }, status: statusEnum },
            required: ["channel", "estimatedCAC", "ltv", "ltvCacRatio", "status"],
            additionalProperties: false,
          },
        },
        funnelStages: {
          type: "array",
          items: {
            type: "object",
            properties: { stage: { type: "string" }, conversionRate: { type: "string" }, volumeNeeded: { type: "string" }, benchmark: { type: "string" }, status: statusEnum },
            required: ["stage", "conversionRate", "volumeNeeded", "benchmark", "status"],
            additionalProperties: false,
          },
        },
        scaleActions: {
          type: "array",
          items: {
            type: "object",
            properties: { action: { type: "string" }, impact: { type: "string" }, deadline: { type: "string" }, priority: { type: "number" } },
            required: ["action", "impact", "deadline", "priority"],
            additionalProperties: false,
          },
        },
        kpiTargets: {
          type: "array",
          items: {
            type: "object",
            properties: { kpi: { type: "string" }, current: { type: "string" }, optimized: { type: "string" }, benchmark: { type: "string" }, status: statusEnum },
            required: ["kpi", "current", "optimized", "benchmark", "status"],
            additionalProperties: false,
          },
        },
        alerts: { type: "array", items: { type: "object", properties: { type: { type: "string" }, title: { type: "string" }, description: { type: "string" } }, required: ["type", "title", "description"], additionalProperties: false } },
      },
      required: ["enabled"],
      additionalProperties: false,
    },
    overview: {
      type: "object",
      properties: {
        summary: { type: "string", description: "Resumo executivo do protocolo em 2-3 frases" },
        priorityActions: {
          type: "array",
          items: { type: "object", properties: { action: { type: "string" }, category: { type: "string" }, priority: { type: "number" } }, required: ["action", "category", "priority"], additionalProperties: false },
        },
        missingFields: { type: "array", items: { type: "string" } },
      },
      required: ["summary", "priorityActions", "missingFields"],
      additionalProperties: false,
    },
  },
  required: ["routine", "physical", "nutrition", "financial", "entrepreneur", "overview"],
  additionalProperties: false,
};
