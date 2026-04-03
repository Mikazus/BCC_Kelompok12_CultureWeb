"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getMe } from "@/Services/authService";
import { clearAuthTokenCookie, getAuthTokenCookie } from "@/lib/authCookie";
import type { UserRole } from "@/types/api/auth";
import NavAfterLogin from "./nav_aftLogin";
import NavBeforeLogin from "./nav_bfrLogin";

type AuthState =
  | { status: "loading" }
  | { status: "guest" }
  | { status: "authenticated"; profileName: string; profileRole: UserRole | null };

const NavSwitcher = () => {
  const [authState, setAuthState] = useState<AuthState>({ status: "loading" });
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;

    const resolveAuthState = async () => {
      const token = getAuthTokenCookie();

      if (!token) {
        if (isMounted) {
          setAuthState({ status: "guest" });
        }
        return;
      }

      try {
        const me = await getMe(token);

        if (isMounted) {
          setAuthState({
            status: "authenticated",
            profileName: me.name,
            profileRole: me.role,
          });
        }
      } catch {
        clearAuthTokenCookie();
        if (isMounted) {
          setAuthState({ status: "guest" });
        }
      }
    };

    void resolveAuthState();

    const handleAuthChanged = () => {
      void resolveAuthState();
    };

    window.addEventListener("auth-changed", handleAuthChanged);

    return () => {
      isMounted = false;
      window.removeEventListener("auth-changed", handleAuthChanged);
    };
  }, []);

  if (pathname?.startsWith("/promotor")) {
    return null;
  }

  if (authState.status === "authenticated") {
    return <NavAfterLogin profileName={authState.profileName} profileRole={authState.profileRole} />;
  }

  if (authState.status === "guest") {
    return <NavBeforeLogin />;
  }

  return null;
};

export default NavSwitcher;
