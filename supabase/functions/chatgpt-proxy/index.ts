import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface ChatRequest {
  message: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse and validate request body
    let body: ChatRequest;
    try {
      body = await req.json();
      console.log("📡 Received request payload:", body);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON payload' }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400
        }
      );
    }

    // Validate message field
    if (!body.message || typeof body.message !== 'string' || !body.message.trim()) {
      return new Response(
        JSON.stringify({ error: 'Message must be a non-empty string' }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400
        }
      );
    }

    // Get OpenAI API key
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      console.error("OpenAI API key not configured");
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500
        }
      );
    }

    // Call OpenAI API
    console.log("📡 Sending request to OpenAI:", { messageLength: body.message.length });
    
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: body.message }],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.json();
      console.error("OpenAI API error:", error);
      return new Response(
        JSON.stringify({ error: error.error?.message || 'OpenAI API error' }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: openAIResponse.status
        }
      );
    }

    const data: OpenAIResponse = await openAIResponse.json();
    const responseMessage = data.choices[0]?.message?.content;

    if (!responseMessage) {
      console.error("Invalid OpenAI response format:", data);
      return new Response(
        JSON.stringify({ error: 'Invalid response format from OpenAI' }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 502
        }
      );
    }

    // Return successful response
    return new Response(
      JSON.stringify({ message: responseMessage }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error) {
    console.error('Unexpected error in ChatGPT proxy:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});