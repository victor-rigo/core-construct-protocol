import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Extract user from auth header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const supabaseAnon = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await supabaseAnon.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const { messages, action, protocolUpdate } = await req.json();

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Load user context
    const [profileRes, formRes, protocolRes] = await Promise.all([
      supabaseAdmin.from("profiles").select("profile_data").eq("id", user.id).single(),
      supabaseAdmin.from("form_responses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabaseAdmin.from("generated_protocols").select("id, ai_protocol_data, created_at").eq("user_id", user.id).not("ai_protocol_data", "is", null).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    ]);

    const profileData = profileRes.data?.profile_data;
    const formData = formRes.data;
    const currentProtocol = protocolRes.data;

    // If action is "update_protocol", update the protocol in DB
    if (action === "update_protocol" && protocolUpdate && currentProtocol) {
      const { error: updateError } = await supabaseAdmin
        .from("generated_protocols")
        .update({ ai_protocol_data: protocolUpdate })
        .eq("id", currentProtocol.id)
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Error updating protocol:", updateError);
        return new Response(JSON.stringify({ error: "Erro ao atualizar protocolo" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build system prompt with user context
    const systemPrompt = buildAssistantSystemPrompt(profileData, formData, currentProtocol?.ai_protocol_data);

    const aiMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: aiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit excedido. Tente novamente em alguns segundos." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const body = await response.text();
      console.error("AI gateway error:", response.status, body);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("protocol-assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function buildAssistantSystemPrompt(profile: any, formData: any, protocol: any): string {
  return `Você é o **KOR Assistant**, um consultor pessoal inteligente integrado ao app KOR Protocol.

<identity>
Você é um consultor de elite que combina:
- Personal trainer certificado
- Nutricionista esportivo
- Consultor financeiro
- Estrategista empresarial
- Coach de produtividade
</identity>

<rules>
1. NUNCA invente dados que não existam no contexto fornecido.
2. Responda SEMPRE em português brasileiro.
3. Seja claro, objetivo e profissional.
4. Respeite TODAS as restrições do usuário: alergias, lesões, horários, limitações financeiras.
5. Quando o usuário pedir um ajuste no protocolo, explique:
   - O que será alterado
   - Por que essa mudança faz sentido
   - Como impacta o resultado geral
6. Se o usuário pedir algo que contraria dados do formulário (ex: ignorar uma lesão), alerte educadamente.
7. Nunca recomende algo perigoso para a saúde.
8. Quando sugerir uma alteração no protocolo, inclua no final da mensagem um bloco JSON com a alteração proposta no seguinte formato:
   ===PROTOCOL_UPDATE===
   {"módulo": "nutrition|physical|routine|financial|entrepreneur", "changes": {... dados atualizados do módulo ...}}
   ===END_UPDATE===
   Só inclua esse bloco quando houver uma alteração concreta a ser aplicada.
9. Mantenha respostas concisas — máximo 3-4 parágrafos por resposta.
</rules>

<user_profile>
${profile ? JSON.stringify(profile, null, 2) : "Não disponível"}
</user_profile>

<form_responses>
${formData ? JSON.stringify(formData, null, 2) : "Não disponível"}
</form_responses>

<current_protocol>
${protocol ? JSON.stringify(protocol, null, 2) : "Nenhum protocolo gerado ainda"}
</current_protocol>

Responda como um consultor pessoal. O usuário pode:
- Perguntar sobre qualquer parte do protocolo
- Pedir ajustes (ex: trocar alimentos, mudar horários de treino)
- Pedir para regenerar módulos específicos
- Pedir explicações sobre recomendações`;
}
