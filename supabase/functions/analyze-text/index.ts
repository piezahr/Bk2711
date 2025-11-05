import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, characters, locations } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Du bist ein KI-Assistent für Textanalyse von Büchern und Geschichten.
Analysiere den folgenden Text auf:
1. Widersprüche (z.B. Charakterdetails, Augenfarbe, Alter, etc.)
2. Logikfehler (z.B. zeitliche Inkonsistenzen, unmögliche Handlungen)
3. Stilbrüche (z.B. plötzliche Perspektivwechsel, Tonfall-Änderungen)
4. Charakter-Inkonsistenzen (basierend auf bekannten Charakteren)

Bekannte Charaktere: ${JSON.stringify(characters)}
Bekannte Orte: ${JSON.stringify(locations)}

Gib deine Analyse als JSON-Array zurück mit folgender Struktur:
[
  {
    "type": "contradiction" | "logic" | "style" | "character",
    "severity": "high" | "medium" | "low",
    "position": number (Position im Text),
    "length": number (Länge des betroffenen Textabschnitts),
    "message": "Beschreibung des Problems",
    "suggestion": "Vorschlag zur Behebung"
  }
]

Wenn keine Probleme gefunden werden, gib ein leeres Array zurück: []`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analysiere diesen Text:\n\n${text}` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_text",
              description: "Analysiert Text auf Inkonsistenzen und Fehler",
              parameters: {
                type: "object",
                properties: {
                  issues: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["contradiction", "logic", "style", "character"] },
                        severity: { type: "string", enum: ["high", "medium", "low"] },
                        position: { type: "number" },
                        length: { type: "number" },
                        message: { type: "string" },
                        suggestion: { type: "string" }
                      },
                      required: ["type", "severity", "position", "length", "message"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["issues"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_text" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Ratenlimit überschritten. Bitte versuchen Sie es später erneut." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Zahlungspflichtig. Bitte fügen Sie Guthaben zu Ihrem Workspace hinzu." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error("AI Gateway error");
    }

    const data = await response.json();
    console.log("AI Response:", JSON.stringify(data, null, 2));

    // Extract issues from tool call
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall && toolCall.function?.arguments) {
      const args = JSON.parse(toolCall.function.arguments);
      const issues = args.issues || [];
      
      // Add unique IDs to issues
      const issuesWithIds = issues.map((issue: any, index: number) => ({
        id: `issue-${Date.now()}-${index}`,
        ...issue
      }));

      return new Response(
        JSON.stringify({ issues: issuesWithIds }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fallback if no tool call
    return new Response(
      JSON.stringify({ issues: [] }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-text function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
