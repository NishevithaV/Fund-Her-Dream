import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      // Call verify endpoint
      supabase.functions.invoke("verify-payment", {
        body: { sessionId },
      }).then(() => setVerified(true)).catch(console.error);
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto max-w-md text-center animate-scale-in">
        <CheckCircle2 className="mx-auto mb-6 h-20 w-20 text-primary" />
        <h1 className="mb-4 text-3xl font-bold">Thank You!</h1>
        <p className="mb-8 text-muted-foreground">
          Your contribution has been received. You're helping a woman founder bring her idea to life!
        </p>
        <Button variant="hero" size="lg" onClick={() => navigate("/")}>
          Back to Ideas
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
