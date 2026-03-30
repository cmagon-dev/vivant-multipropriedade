"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { signOutAndGoToLogin } from "@/lib/auth/signOutClient";

type ButtonProps = ComponentProps<typeof Button>;

export function SignOutButton({
  children,
  variant = "outline",
  size = "sm",
  ...props
}: Omit<ButtonProps, "onClick" | "type"> & { children?: ReactNode }) {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      {...props}
      onClick={() => void signOutAndGoToLogin()}
    >
      {children ?? (
        <>
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </>
      )}
    </Button>
  );
}
