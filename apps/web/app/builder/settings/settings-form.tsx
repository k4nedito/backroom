"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";

type Builder = {
  id: string;
  email: string;
  name: string;
};

export function SettingsForm({ builder }: { builder: Builder }) {
  const router = useRouter();

  // Email change
  const [newEmail, setNewEmail] = useState("");
  const [emailStep, setEmailStep] = useState<"idle" | "otp">("idle");
  const [otp, setOtp] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMsg, setEmailMsg] = useState("");
  const [emailError, setEmailError] = useState("");

  async function handleEmailSend(e: React.FormEvent) {
    e.preventDefault();
    setEmailError("");
    setEmailMsg("");

    if (!newEmail.trim()) return setEmailError("Enter a new email");
    if (newEmail === builder.email)
      return setEmailError("That's your current email");

    setEmailLoading(true);
    const { error } = await api("/builder/settings/email", {
      method: "POST",
      body: JSON.stringify({ newEmail }),
    });
    setEmailLoading(false);

    if (error) return setEmailError(error.message);
    setEmailStep("otp");
  }

  async function handleEmailVerify(code: string) {
    setEmailError("");
    setEmailLoading(true);

    const { error } = await api("/builder/settings/email/verify", {
      method: "POST",
      body: JSON.stringify({ newEmail, code }),
    });
    setEmailLoading(false);

    if (error) return setEmailError(error.message);

    setEmailMsg("Email updated");
    setEmailStep("idle");
    setNewEmail("");
    setOtp("");
    router.refresh();
    setTimeout(() => setEmailMsg(""), 2000);
  }

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-300">
      {/* Email section */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-xs font-medium tracking-tight">Email</h2>
          <p className="text-[10px] text-muted-foreground/50 tracking-wide">
            Current:{" "}
            <span className="text-muted-foreground/70">{builder.email}</span>
          </p>
        </div>

        {emailStep === "idle" ? (
          <form onSubmit={handleEmailSend} className="flex flex-col gap-4">
            <fieldset className="flex flex-col gap-1.5">
              <Label
                htmlFor="newEmail"
                className="text-[11px] text-muted-foreground uppercase tracking-wider"
              >
                New email
              </Label>
              <Input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new@email.com"
                className="h-10 bg-transparent border-border/60 focus-visible:border-foreground/30 transition-colors"
              />
            </fieldset>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={emailLoading}
                size="sm"
                variant="outline"
                className="text-[11px] uppercase tracking-wider"
              >
                {emailLoading ? "Sending..." : "Send verification code"}
              </Button>
              {emailMsg && (
                <span className="text-[11px] text-muted-foreground/60 animate-in fade-in duration-150">
                  {emailMsg}
                </span>
              )}
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-1 duration-200">
            <p className="text-[11px] text-muted-foreground/60 tracking-wide">
              Code sent to{" "}
              <span className="text-foreground/70">{newEmail}</span>
            </p>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => {
                setOtp(value);
                if (value.length === 6) handleEmailVerify(value);
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
              onClick={() => {
                setEmailStep("idle");
                setOtp("");
                setEmailError("");
              }}
              className="text-[11px] text-muted-foreground/50 hover:text-foreground/70 transition-colors tracking-wide w-fit"
            >
              &larr; cancel
            </button>
          </div>
        )}

        {emailError && (
          <p className="text-[11px] text-destructive animate-in fade-in duration-150">
            {emailError}
          </p>
        )}
      </section>
    </div>
  );
}
