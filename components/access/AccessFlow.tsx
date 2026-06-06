"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { CodeStep } from "./CodeStep";
import { ApplicationForm } from "./ApplicationForm";
import { StatusChecker } from "./StatusChecker";
import { BorderBeam } from "@/components/ui/border-beam";

type Step = "code" | "form" | "success";

export function AccessFlow() {
  const [step, setStep] = useState<Step>("code");
  const [validCode, setValidCode] = useState("");

  return (
    <>
      {/* Step indicator */}
      {step !== "success" && (
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 text-xs font-mono ${step === "code" ? "text-white/70" : "text-white/50"}`}>
            <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold border ${step === "code" ? "border-white/20 bg-white/10 text-white/70" : "border-white/15 bg-white/8 text-white/50"}`}>
              {step === "code" ? "1" : "✓"}
            </div>
            Access Code
          </div>
          <div className="flex-1 h-px bg-white/8" />
          <div className={`flex items-center gap-2 text-xs font-mono ${step === "form" ? "text-white/70" : "text-white/20"}`}>
            <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold border ${step === "form" ? "border-white/20 bg-white/10 text-white/70" : "border-white/8 text-white/20"}`}>
              2
            </div>
            Application
          </div>
        </div>
      )}

      {/* Main card */}
      {step === "success" ? (
        <div className="relative bg-[#111111] border border-white/10 rounded p-8 text-center overflow-hidden">
          <CheckCircle2 className="w-12 h-12 text-white/50 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Application Submitted</h2>
          <p className="text-white/40 leading-relaxed mb-6">
            Your application is under review. We read every application carefully — there is no set ETA.
          </p>
          <div className="bg-white/3 rounded p-4 text-left space-y-2 mb-4">
            <p className="text-xs text-white/25 font-mono uppercase tracking-wider mb-2">What happens next?</p>
            <p className="text-white/40 text-sm">· Committee reviews manually, one by one.</p>
            <p className="text-white/40 text-sm">· You may be moved to PENDING with no max duration.</p>
            <p className="text-white/40 text-sm">· Decision is final. Rejected applicants cannot reapply.</p>
            <p className="text-white/40 text-sm">· If approved, you will receive invite rights (3 codes).</p>
          </div>
          <p className="text-white/25 text-sm">Use the status checker below to track your application.</p>
          <BorderBeam colorFrom="rgba(255,255,255,0.3)" colorTo="rgba(255,255,255,0.06)" size={200} duration={12} borderWidth={1.5} />
        </div>
      ) : (
        <div className="relative bg-[#111111] border border-white/5 rounded p-6 sm:p-8 overflow-hidden">
          {step === "code" && (
            <CodeStep
              onValidCode={(code) => {
                setValidCode(code);
                setStep("form");
              }}
            />
          )}
          {step === "form" && (
            <ApplicationForm
              accessCode={validCode}
              onSuccess={() => setStep("success")}
            />
          )}
          <BorderBeam colorFrom="rgba(255,255,255,0.2)" colorTo="rgba(255,255,255,0.04)" size={200} duration={10} borderWidth={1.5} />
        </div>
      )}

      {/* Status checker — always visible */}
      <StatusChecker />
    </>
  );
}
