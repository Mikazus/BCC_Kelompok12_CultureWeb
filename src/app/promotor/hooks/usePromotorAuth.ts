"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/Services/authService";
import { clearAuthTokenCookie, getAuthTokenCookie } from "@/lib/authCookie";

type PromotorAuthState = {
	isAuthResolved: boolean;
	token: string | null;
	profileName: string;
	profileRoleLabel: string;
};

export default function usePromotorAuth(): PromotorAuthState {
	const router = useRouter();
	const [state, setState] = useState<PromotorAuthState>({
		isAuthResolved: false,
		token: null,
		profileName: "Promotor",
		profileRoleLabel: "Lead Promotor",
	});

	useEffect(() => {
		let isMounted = true;

		const forceLogout = () => {
			clearAuthTokenCookie();
			window.dispatchEvent(new Event("auth-changed"));
			router.replace("/sign-in");
		};

		const resolvePromotorAuth = async () => {
			const token = getAuthTokenCookie();

			if (!token) {
				if (isMounted) {
					setState((previous) => ({
						...previous,
						isAuthResolved: true,
						token: null,
					}));
				}
				forceLogout();
				return;
			}

			try {
				const me = await getMe(token);
				if (!isMounted) {
					return;
				}

				if (me.role !== "promotor") {
					setState((previous) => ({
						...previous,
						isAuthResolved: true,
						token: null,
					}));
					forceLogout();
					return;
				}

				setState({
					isAuthResolved: true,
					token,
					profileName: me.name || "Promotor",
					profileRoleLabel: "Lead Promotor",
				});
			} catch {
				if (isMounted) {
					setState((previous) => ({
						...previous,
						isAuthResolved: true,
						token: null,
					}));
				}
				forceLogout();
			}
		};

		void resolvePromotorAuth();

		return () => {
			isMounted = false;
		};
	}, [router]);

	return state;
}
