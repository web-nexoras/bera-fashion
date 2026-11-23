"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertCircle, CheckCircle2, MailCheck } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Spinner } from "@/components/ui/feedback";
import { verifyEmail, verifyOtp } from "@/api/auth.js";
export default function VerifyEmailPage() {
    const params = useParams();
    const token = params.token;
    const [state, setState] = useState("loading");
    const [message, setMessage] = useState("");
    const started = useRef(false);
    const verify = useCallback(async () => {
        setState("loading");
        let response = await verifyEmail(token);
        if (!response.success)
            response = await verifyOtp({ token });
        setMessage(response.message ?? "");
        setState(response.success ? "success" : "error");
    }, [token]);
    useEffect(() => {
        if (started.current)
            return;
        started.current = true;
        void verify();
    }, [verify]);
    return (<div className="animate-fade-up text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        <MailCheck className="size-8"/>
      </span>

      {state === "loading" && (<>
          <h1 className="mt-6 font-display text-3xl font-bold text-ink-900">Verifying your email</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-ink-500">
            This will only take a moment. Please keep this page open.
          </p>
          <Spinner className="mx-auto mt-8"/>
        </>)}

      {state === "success" && (<>
          <span className="mx-auto mt-6 flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-7"/>
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-ink-900">Email verified</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-ink-500">
            {message || "Your email address has been confirmed. You're all set to explore BERA."}
          </p>
          <ButtonLink href="/login" size="lg" className="mt-8 w-full">
            Continue to sign in
          </ButtonLink>
        </>)}

      {state === "error" && (<>
          <span className="mx-auto mt-6 flex size-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertCircle className="size-7"/>
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-ink-900">We couldn&apos;t verify this link</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-ink-500">
            {message || "The link may have expired or was already used. Request a new one to continue."}
          </p>
          <div className="mt-8 space-y-3">
            <Button size="lg" variant="outline" className="w-full" onClick={() => void verify()}>
              Try again
            </Button>
            <Link href="/forgot-password" className="block text-xs font-semibold text-brand-700 hover:underline">
              Request a new link
            </Link>
          </div>
        </>)}
    </div>);
}
