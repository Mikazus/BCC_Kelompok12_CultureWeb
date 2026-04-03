"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { deletePromotorEvent, getMyEvents } from "@/Services/eventService";
import { getCheckoutActivities, type CheckoutActivity } from "@/Services/checkoutService";
import { getMyWalletBalance } from "@/Services/walletService";
import type { EventCard } from "@/app/EventHighlight/types";
import { getApiErrorMessage } from "@/lib/apiError";
import PromotorSidebar from "../components/promotorSidebar";
import PromotorTopbar from "../components/promotorTopbar";
import usePromotorAuth from "../hooks/usePromotorAuth";
import ActiveEventCard from "./components/activeEventCard";
import ActivityTable from "./components/activityTable";
import QuickActions from "./components/quickActions";

export default function PromotorDashboardPage() {
	const { isAuthResolved, token, profileName, profileRoleLabel } = usePromotorAuth();
	const [activeEvent, setActiveEvent] = useState<EventCard | null>(null);
	const [totalEvents, setTotalEvents] = useState(0);
	const [isLoadingEvent, setIsLoadingEvent] = useState(true);
	const [activities, setActivities] = useState<CheckoutActivity[]>([]);
	const [isLoadingActivities, setIsLoadingActivities] = useState(true);
	const [walletBalance, setWalletBalance] = useState(0);
	const [isLoadingWallet, setIsLoadingWallet] = useState(true);
	const [isDeletingEvent, setIsDeletingEvent] = useState(false);
	const [actionError, setActionError] = useState<string | null>(null);

	const formatStatNumber = (value: number) => new Intl.NumberFormat("id-ID").format(Math.max(0, Math.floor(value)));
	const formatStatCurrency = (value: number) =>
		new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			maximumFractionDigits: 0,
		})
			.format(Math.max(0, value))
			.replace(/^Rp\s?/, "");

	const dashboardStats = useMemo(() => {
		const totalTicketSold = activities.reduce((sum, item) => sum + (item.quantity || 0), 0);

		return [
			{ title: "Total Event", value: formatStatNumber(totalEvents), icon: "event" as const },
			{ title: "Total Ticket Terjual", value: formatStatNumber(totalTicketSold), icon: "ticket" as const },
			{ title: "Pendapatan", value: formatStatCurrency(walletBalance), icon: "revenue" as const },
		];
	}, [activities, totalEvents, walletBalance]);

	const summaryText = useMemo(() => {
		if (isLoadingActivities || isLoadingEvent || isLoadingWallet) {
			return "Memuat ringkasan performa event Anda...";
		}

		if (activities.length === 0) {
			return "Belum ada transaksi terbaru. Buat atau aktifkan event untuk mulai mendapatkan penjualan.";
		}

		const sold = dashboardStats[1]?.value || "0";
		const revenue = dashboardStats[2]?.value || "0";
		return `Penjualan terbaru tercatat ${sold} tiket dengan pendapatan Rp ${revenue}.`;
	}, [activities.length, dashboardStats, isLoadingActivities, isLoadingEvent, isLoadingWallet]);

	const loadDashboardData = useCallback(async () => {
		if (!token) {
			setIsLoadingEvent(false);
			setIsLoadingActivities(false);
			setIsLoadingWallet(false);
			return;
		}

		setIsLoadingEvent(true);
		setIsLoadingActivities(true);
		setIsLoadingWallet(true);

		try {
			const [myEvents, checkoutActivities, balance] = await Promise.all([
				getMyEvents(token, {
					limit: "20",
					page: "1",
					search: "",
					category_id: "",
					sort_by: "created_at",
					sort_order: "desc",
				}),
				getCheckoutActivities(token),
				getMyWalletBalance(token),
			]);

			setActiveEvent(myEvents[0] || null);
			setTotalEvents(myEvents.length);
			setActivities(checkoutActivities);
			setWalletBalance(balance);
		} catch {
			setActiveEvent(null);
			setTotalEvents(0);
			setActivities([]);
			setWalletBalance(0);
		} finally {
			setIsLoadingEvent(false);
			setIsLoadingActivities(false);
			setIsLoadingWallet(false);
		}
	}, [token]);

	useEffect(() => {
		void loadDashboardData();
	}, [loadDashboardData]);

	const handleDeleteEvent = async (eventId: string) => {
		if (!token) {
			setActionError("Sesi login tidak ditemukan.");
			return;
		}

		setIsDeletingEvent(true);
		setActionError(null);

		try {
			await deletePromotorEvent(token, eventId);
			await loadDashboardData();
		} catch (error) {
			setActionError(getApiErrorMessage(error, "Gagal menghapus event."));
		} finally {
			setIsDeletingEvent(false);
		}
	};

	if (!isAuthResolved) {
		return null;
	}

	return (
		<div className="min-h-screen bg-[#A88648] text-[#433424]">
			<div className="flex min-h-screen w-full flex-col lg:flex-row">
				<PromotorSidebar active="dashboard" />

				<div className="flex min-h-screen flex-1 flex-col bg-[#F4F1EC]">
					<PromotorTopbar profileName={profileName} profileRoleLabel={profileRoleLabel} />

					<main className="flex-1 px-5 pb-8 pt-7 md:px-8 lg:px-12 lg:pt-9">
						<section>
							<h2 className="font-serif text-[34px] leading-tight text-[#4A3827]">Selamat Datang, {profileName}</h2>
							<p className="mt-1 text-[18px] text-[#6C5A43]">{summaryText}</p>
							{actionError ? (
								<p className="mt-3 rounded-xl border border-[#D46969] bg-[#FFF0F0] px-4 py-3 text-sm text-[#B74848]">{actionError}</p>
							) : null}
						</section>

						<QuickActions stats={dashboardStats} />

						<section className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-[1.8fr_0.8fr]">
							<ActivityTable activities={activities} isLoading={isLoadingActivities} />
							<ActiveEventCard
								event={activeEvent}
								isLoading={isLoadingEvent}
								isDeleting={isDeletingEvent}
								onDeleteEvent={handleDeleteEvent}
							/>
						</section>
					</main>
				</div>
			</div>
		</div>
	);
}
