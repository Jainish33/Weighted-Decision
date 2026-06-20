"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  type ConfirmationResult,
} from "firebase/auth";
import Link from "next/link";
import Wordmark from "@/components/Wordmark";
import { firebaseAuth, firebaseConfigured } from "@/lib/firebase";
import { STUDIO_ENABLED, whatsappLink } from "@/lib/config";

// v1: the self-serve studio is invitation-only. When STUDIO_ENABLED flips on
// in v2, the full phone/Google sign-in below takes over.
function ComingSoonWall() {
  return (
    <main className="flex min-h-screen flex-col bg-canvas text-ink">
      <header className="border-b border-gold/30 px-6 py-5 md:px-12">
        <Wordmark />
      </header>
      <div className="mx-auto flex max-w-md flex-1 flex-col justify-center px-6 text-center">
        <p className="font-script text-3xl text-forest">by invitation</p>
        <h1 className="mt-3 font-serif text-3xl">The studio opens soon</h1>
        <p className="mt-4 text-ink/60">
          For now, every gift is crafted personally — hand to hand. Tell us
          about your favourite person and we&rsquo;ll begin together.
        </p>
        <Link
          href="/begin"
          className="mt-8 inline-block rounded-full bg-forest px-8 py-3 text-cream transition-opacity hover:opacity-90"
        >
          Begin a gift
        </Link>
        <a
          href={whatsappLink("Hi Heart Strings — I'd like to begin a gift.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-sm text-ink/50 underline-offset-4 hover:underline"
        >
          or message us on WhatsApp
        </a>
      </div>
    </main>
  );
}

function SignInInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(
    null,
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function sendOtp() {
    const auth = firebaseAuth();
    if (!auth) return;
    setBusy(true);
    setError("");
    try {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
      const result = await signInWithPhoneNumber(auth, `+91${phone}`, verifier);
      setConfirmation(result);
    } catch {
      setError("We couldn't send the code. Check the number and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp() {
    if (!confirmation) return;
    setBusy(true);
    setError("");
    try {
      await confirmation.confirm(otp);
      router.push(next);
    } catch {
      setError("That code didn't match. Try once more.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const auth = firebaseAuth();
    if (!auth) return;
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      router.push(next);
    } catch {
      setError("Google sign-in didn't go through. Try the phone number.");
    }
  }

  // Gated in v1 — the sign-in UI below is preserved for v2.
  if (!STUDIO_ENABLED) return <ComingSoonWall />;

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <header className="px-6 py-5 md:px-12">
        <Wordmark />
      </header>
      <div className="mx-auto max-w-sm px-6 pt-16">
        <h1 className="font-serif text-3xl">
          So we can keep their story safe
        </h1>
        <p className="mt-3 text-sm text-ink/60">
          One quick step before the conversation begins.
        </p>

        {firebaseConfigured ? (
          <>
            {!confirmation ? (
              <>
                <div className="mt-8 flex items-end gap-2 border-b border-taupe pb-2 focus-within:border-burgundy">
                  <span className="text-ink/50">+91</span>
                  <input
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="phone number"
                    inputMode="numeric"
                    className="w-full bg-transparent outline-none placeholder:text-ink/30"
                  />
                </div>
                <button
                  disabled={phone.length !== 10 || busy}
                  onClick={sendOtp}
                  className="mt-6 w-full rounded-full bg-burgundy py-2.5 text-canvas disabled:opacity-30"
                >
                  {busy ? "Sending…" : "Send code"}
                </button>
              </>
            ) : (
              <>
                <input
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="6-digit code"
                  inputMode="numeric"
                  className="mt-8 w-full border-b border-taupe bg-transparent pb-2 text-center font-serif text-2xl tracking-[0.5em] outline-none focus:border-burgundy"
                />
                <button
                  disabled={otp.length !== 6 || busy}
                  onClick={verifyOtp}
                  className="mt-6 w-full rounded-full bg-burgundy py-2.5 text-canvas disabled:opacity-30"
                >
                  {busy ? "Checking…" : "Continue"}
                </button>
              </>
            )}
            <div className="my-6 flex items-center gap-3 text-xs text-ink/40">
              <div className="h-px flex-1 bg-taupe" /> or
              <div className="h-px flex-1 bg-taupe" />
            </div>
            <button
              onClick={google}
              className="w-full rounded-full border border-taupe py-2.5 text-sm hover:border-burgundy"
            >
              Continue with Google
            </button>
            <div id="recaptcha-container" />
          </>
        ) : (
          <>
            <p className="mt-8 rounded-xl border border-taupe bg-white/40 p-4 text-sm text-ink/70">
              Sign-in is not configured yet on this deployment. You can
              continue as a guest — everything is saved on this device.
            </p>
            <button
              onClick={() => router.push(next)}
              className="mt-6 w-full rounded-full bg-burgundy py-2.5 text-canvas"
            >
              Continue as guest
            </button>
          </>
        )}

        {error && <p className="mt-4 text-sm text-burgundy">{error}</p>}
      </div>
    </main>
  );
}

export default function SignIn() {
  return (
    <Suspense>
      <SignInInner />
    </Suspense>
  );
}
