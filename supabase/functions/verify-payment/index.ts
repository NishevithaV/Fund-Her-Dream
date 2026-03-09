import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import { checkRateLimit, getClientIp, rateLimitedResponse } from "../_shared/rateLimit.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// 30 verification attempts per IP per hour
const RATE_LIMIT = 30;
const WINDOW_MS = 60 * 60 * 1000;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const ip = getClientIp(req);
  const { allowed, retryAfter } = checkRateLimit(`verify:${ip}`, RATE_LIMIT, WINDOW_MS);
  if (!allowed) return rateLimitedResponse(retryAfter!, corsHeaders);

  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      throw new Error("Missing sessionId");
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not configured");

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return new Response(JSON.stringify({ verified: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ideaId = session.metadata?.idea_id;
    const amount = parseInt(session.metadata?.amount || "0");

    if (!ideaId || !amount) {
      throw new Error("Missing metadata");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceKey) throw new Error("Supabase env vars not configured");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Idempotency check: skip if this session was already processed
    const { data: existing } = await supabase
      .from("contributions")
      .select("id")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ verified: true, already_processed: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Record the contribution
    await supabase.from("contributions").insert({
      idea_id: ideaId,
      amount,
      stripe_session_id: sessionId,
    });

    // Increment amount_raised and backer_count
    const { data: idea } = await supabase
      .from("ideas")
      .select("amount_raised, backer_count")
      .eq("id", ideaId)
      .single();

    if (idea) {
      await supabase
        .from("ideas")
        .update({
          amount_raised: idea.amount_raised + amount,
          backer_count: idea.backer_count + 1,
        })
        .eq("id", ideaId);
    }

    return new Response(JSON.stringify({ verified: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Verify error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
