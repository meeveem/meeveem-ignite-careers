import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  firstName: string;
  lastName: string;
  email: string;
  listIds?: number[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email, listIds = [] }: ContactRequest = await req.json();

    // Validate input
    if (!firstName || !lastName || !email) {
      return new Response(
        JSON.stringify({ error: "First name, last name, and email are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate name lengths
    if (firstName.length > 100 || lastName.length > 100) {
      return new Response(
        JSON.stringify({ error: "Names must be less than 100 characters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    if (!BREVO_API_KEY) {
      console.error("BREVO_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Brevo API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Add contact to Brevo
    const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        attributes: {
          FIRSTNAME: firstName.trim(),
          LASTNAME: lastName.trim(),
        },
        listIds: listIds,
        updateEnabled: true, // Update if contact already exists
      }),
    });

    const responseData = await brevoResponse.json();

    // Handle different response codes
    if (brevoResponse.status === 201) {
      console.log("Contact created successfully:", responseData);
      return new Response(
        JSON.stringify({ success: true, message: "Contact added successfully" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else if (brevoResponse.status === 204) {
      console.log("Contact already exists and was updated:", email);
      return new Response(
        JSON.stringify({ success: true, message: "Contact updated successfully" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else {
      console.error("Brevo API error:", brevoResponse.status, responseData);
      return new Response(
        JSON.stringify({ 
          error: "Failed to add contact to mailing list", 
          details: responseData 
        }),
        {
          status: brevoResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error in add-brevo-contact function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
