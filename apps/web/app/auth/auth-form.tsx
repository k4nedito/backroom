"use client";

import { useState } from "react";
import { z } from "zod";
import { api } from "@/lib/api";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";
import { Label } from "@workspace/ui/components/label";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

type Step = "email" | "otp" | "signup" | "done";
type Role = "seeker" | "builder";

export function AuthForm() {
  const [role, setRole] = useState<Role>("seeker");
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [signupToken, setSignupToken] = useState("");
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
      token?: string;
      signupToken?: string;
      seeker?: any;
    }>(`/${role}/auth/verify`, {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
    setLoading(false);

    if (apiError) return setError(apiError.message);
    if (!data) return;

    if (data.isNew) {
      setSignupToken(data.signupToken!);
      setStep("signup");
    } else {
      localStorage.setItem("token", data.token!);
      setStep("done");
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Name is required");

    setLoading(true);
    const { data, error: apiError } = await api<{
      token: string;
      seeker: any;
    }>(`/${role}/auth/signup`, {
      method: "POST",
      body: JSON.stringify({ email, name, company: company || undefined }),
      headers: { Authorization: `Bearer ${signupToken}` },
    });
    setLoading(false);

    if (apiError) return setError(apiError.message);
    if (!data) return;

    localStorage.setItem("token", data.token);
    setStep("done");
  }

  if (step === "done") {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>You're in</CardTitle>
          <CardDescription>
            Logged in as {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Dashboard coming soon.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          {step === "signup" ? "Complete your profile" : "Welcome to Backrooms"}
        </CardTitle>
        <CardDescription>
          {step === "email" && "Enter your email to get started"}
          {step === "otp" && `We sent a code to ${email}`}
          {step === "signup" && "Just a few more details"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {step === "email" && (
          <>
            <Tabs
              value={role}
              onValueChange={(v) => setRole(v as Role)}
            >
              <TabsList className="w-full">
                <TabsTrigger value="seeker">Seeker</TabsTrigger>
                <TabsTrigger value="builder">Builder</TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSendOtp} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send code"}
              </Button>
            </form>
          </>
        )}

        {step === "otp" && (
          <div className="flex flex-col items-center gap-3">
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
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                setOtp("");
                setStep("email");
              }}
            >
              Use a different email
            </button>
          </div>
        )}

        {step === "signup" && (
          <form onSubmit={handleSignup} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            {role === "seeker" && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="company">Company (optional)</Label>
                <Input
                  id="company"
                  placeholder="Your company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Get started"}
            </Button>
          </form>
        )}

        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}
