import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface ChatRequest {
  message: string;
}

interface OpenAIResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message: string;
    type: string;
    code?: string;
  };
}

interface ErrorResponse {
  error: string;
  details?: unknown;
  code?: string;
}

function createErrorResponse(message: string, status: number, details?: unknown): Response {
  const errorBody: ErrorResponse = {
    error: message,
    ...(details && { details })
  };

  return new Response(
    JSON.stringify(errorBody),
    { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status
    }
  );
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      return createErrorResponse(
        'Method not allowed',
        405,
        { allowed: ['POST'] }
      );
    }

    // Parse and validate request body
    let body: ChatRequest;
    try {
      body = await req.json();
    } catch (error) {
      return createErrorResponse(
        'Invalid JSON payload',
        400,
        { details: error.message }
      );
    }

    // Validate message field
    if (!body.message) {
      return createErrorResponse(
        'Message is required',
        400,
        { received: body }
      );
    }

    if (typeof body.message !== 'string') {
      return createErrorResponse(
        'Message must be a string',
        400,
        { received: typeof body.message }
      );
    }

    const message = body.message.trim();
    if (!message) {
      return createErrorResponse(
        'Message cannot be empty',
        400
      );
    }

    // Get and validate API key
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      console.error("OpenAI API key not configured");
      return createErrorResponse(
        'Service configuration error',
        503
      );
    }

    // Call OpenAI API
    console.log("📡 Sending request to OpenAI:", { messageLength: message.length });
    
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    // Parse OpenAI response
    let data: OpenAIResponse;
    try {
      data = await openAIResponse.json();
    } catch (error) {
      console.error("Failed to parse OpenAI response:", error);
      return createErrorResponse(
        'Invalid response from OpenAI',
        502,
        { details: error.message }
      );
    }

    // Handle OpenAI error responses
    if (!openAIResponse.ok) {
      console.error("OpenAI API error:", data.error);
      return createErrorResponse(
        data.error?.message || 'OpenAI API error',
        openAIResponse.status,
        { type: data.error?.type, code: data.error?.code }
      );
    }

    // Validate OpenAI response format
    const responseMessage = data.choices?.[0]?.message?.content;
    if (!responseMessage) {
      console.error("Invalid OpenAI response format:", data);
      return createErrorResponse(
        'Invalid response format from OpenAI',
        502,
        { received: data }
      );
    }

    // Return successful response
    return new Response(
      JSON.stringify({ message: responseMessage }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json"
        },
        status: 200
      }
    );

  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in ChatGPT proxy:', error);
    return createErrorResponse(
      'Internal server error',
      500,
      error instanceof Error ? { message: error.message } : undefined
    );
  }
});