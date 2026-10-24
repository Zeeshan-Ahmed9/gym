"use client";

import * as React from "react";
import { KeyRound, ShieldCheck, Lock, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AdminPasscodeModal } from "@/components/admin/auth/admin-passcode-modal";

export function AdminPasscodeCard() {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <>
      <Card className="border-border shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pale-mint text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Admin Panel Passcode Gate</CardTitle>
                <CardDescription className="text-xs">
                  Manage access protection and passcode credentials for the admin center.
                </CardDescription>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
              <Lock className="h-3 w-3" />
              <span>Protected</span>
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          <p className="text-xs text-muted-foreground leading-relaxed">
            The admin panel is protected by a secure passcode gate. Every session requires passcode authorization. To update or change this passcode, verification of the previous passcode is strictly required.
          </p>

          <div className="rounded-xl border border-border bg-[#F8FAF9] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-border text-foreground">
                <KeyRound className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Passcode Credential</p>
                <p className="text-[11px] text-muted-foreground">Encrypted with bcrypt cryptographic hashing</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer shadow-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Change Passcode</span>
            </button>
          </div>
        </CardContent>
      </Card>

      <AdminPasscodeModal
        isOpen={modalOpen}
        initialMode="change"
        onClose={() => setModalOpen(false)}
        onSuccessRedirect="/admin/settings"
      />
    </>
  );
}
