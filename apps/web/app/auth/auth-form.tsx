"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { api } from "@/lib/api";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";
import { Label } from "@workspace/ui/components/label";

type Step = "email" | "otp" | "signup";
type Role = "seeker" | "builder";

export function AuthForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("seeker");
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const parsed = z.string().email().safeParse(email);
    if (!parsed.success) return setError("Enter a valid email");

    if (role === "builder") return setError("Builder signup coming soon");

    setLoading(true);
    const { error: apiError } = await api(`/${role}/auth/otp`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    setLoading(false);

    if (apiError) return setError(apiError.message);
    setStep("otp");
  }

  async function handleVerifyOtp(code: string) {
    setError("");
    setLoading(true);

    const { data, error: apiError } = await api<{
      isNew: boolean;
      seeker?: any;
    }>(`/${role}/auth/verify`, {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
    setLoading(false);

    if (apiError) return setError(apiError.message);
    if (!data) return;

    if (data.isNew) {
      setStep("signup");
    } else {
      router.push(role === "seeker" ? "/seeker/jobs" : "/builder/jobs");
      router.refresh();
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Name is required");

    setLoading(true);
    const { data, error: apiError } = await api<{
      seeker: any;
    }>(`/${role}/auth/signup`, {
      method: "POST",
      body: JSON.stringify({ email, name, company: company || undefined }),
    });
    setLoading(false);

    if (apiError) return setError(apiError.message);
    if (!data) return;

    router.push(role === "seeker" ? "/seeker/jobs" : "/builder/jobs");
    router.refresh();
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-base font-medium tracking-tight">
            {step === "signup" ? "Complete your profile" : "Get started"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {step === "email" && "Enter your email to continue"}
            {step === "otp" && (
              <>
                Code sent to{" "}
                <span className="text-foreground/70">{email}</span>
              </>
            )}
            {step === "signup" && "Just a few more details"}
          </p>
        </div>

        {/* Role toggle */}
        {step === "email" && (
          <div className="flex items-center justify-center gap-0.5 rounded-md border border-border/60 bg-muted/30 p-0.5">
            {(["seeker", "builder"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`
                  relative flex-1 rounded-sm px-4 py-1.5 text-xs font-medium tracking-wide uppercase transition-all duration-200
                  ${
                    role === r
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground/70"
                  }
                `}
              >
                {r}
              </button>
            ))}
          </div>
        )}

        {/* Email step */}
        {step === "email" && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-[11px] text-muted-foreground uppercase tracking-wider">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                className="h-10 bg-transparent border-border/60 focus-visible:border-foreground/30 transition-colors"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="h-10 text-xs font-medium uppercase tracking-wider"
            >
              {loading ? "Sending..." : "Send code"}
            </Button>
          </form>
        )}

        {/* OTP step */}
        {step === "otp" && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-1 duration-200">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => {
                setOtp(value);
                if (value.length === 6) handleVerifyOtp(value);
              }}
              autoFocus
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <button
              type="button"
              className="text-[11px] text-muted-foreground/60 hover:text-foreground/70 transition-colors tracking-wide"
              onClick={() => {
                setOtp("");
                setStep("email");
              }}
            >
              ← different email
            </button>
          </div>
        )}

        {/* Signup step */}
        {step === "signup" && (
          <form onSubmit={handleSignup} className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-1 duration-200">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-[11px] text-muted-foreground uppercase tracking-wider">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="h-10 bg-transparent border-border/60 focus-visible:border-foreground/30 transition-colors"
              />
            </div>
            {role === "seeker" && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="company" className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  Company
                  <span className="ml-1 text-muted-foreground/40 normal-case tracking-normal">optional</span>
                </Label>
                <Input
                  id="company"
                  placeholder="Your company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="h-10 bg-transparent border-border/60 focus-visible:border-foreground/30 transition-colors"
                />
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="h-10 text-xs font-medium uppercase tracking-wider"
            >
              {loading ? "Creating account..." : "Get started"}
            </Button>
          </form>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-[11px] text-destructive animate-in fade-in duration-150">
            {error}
          </p>
        )}

        {/* Separator */}
        {step === "email" && (
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        )}
      </div>
    </div>
  );
}
