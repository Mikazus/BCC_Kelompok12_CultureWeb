"use client";

import { useEffect, useState } from "react";
import { getMyEvents } from "@/Services/eventService";
import { getCheckoutActivities, type CheckoutActivity } from "@/Services/checkoutService";
import type { EventCard } from "@/app/EventHighlight/types";
import PromotorSidebar from "../components/promotorSidebar";
import PromotorTopbar from "../components/promotorTopbar";
import usePromotorAuth from "../hooks/usePromotorAuth";
import ActiveEventCard from "./components/activeEventCard";
import ActivityTable from "./components/activityTable";
import QuickActions from "./components/quickActions";

export default function PromotorDashboardPage() {
	const { isAuthResolved, token, profileName, profileRoleLabel } = usePromotorAuth();
	const [activeEvent, setActiveEvent] = useState<EventCard | null>(null);
	const [isLoadingEvent, setIsLoadingEvent] = useState(true);
	const [activities, setActivities] = useState<CheckoutActivity[]>([]);
	const [isLoadingActivities, setIsLoadingActivities] = useState(true);

	useEffect(() => {
		let isMounted = true;

		const loadDashboardData = async () => {
			if (!token) {
				if (isMounted) {
					setIsLoadingEvent(false);
					setIsLoadingActivities(false);
				}
				return;
			}

			try {
				const [myEvents, checkoutActivities] = await Promise.all([
					getMyEvents(token, {
						limit: "20",
						page: "1",
						search: "",
						category_id: "",
						sort_by: "created_at",
						sort_order: "desc",
					}),
					getCheckoutActivities(token),
				]);

				if (!isMounted) {
					return;
				}

				setActiveEvent(myEvents[0] || null);
				setActivities(checkoutActivities);
			} catch {
				if (isMounted) {
					setActiveEvent(null);
					setActivities([]);
				}
			} finally {
				if (isMounted) {
					setIsLoadingEvent(false);
					setIsLoadingActivities(false);
				}
			}
		};

		void loadDashboardData();

		return () => {
			isMounted = false;
		};
	}, [token]);

	if (!isAuthResolved) {
		return null;
	}

	return (
		<div className="min-h-screen bg-[#A88648] text-[#433424]">
			<div className="mx-auto flex min-h-screen w-full max-w-360 flex-col lg:flex-row">
				<PromotorSidebar active="dashboard" />

				<div className="flex min-h-screen flex-1 flex-col bg-[#F4F1EC]">
					<PromotorTopbar profileName={profileName} profileRoleLabel={profileRoleLabel} />

					<main className="flex-1 px-5 pb-8 pt-7 md:px-8 lg:px-12 lg:pt-9">
						<section>
							<h2 className="font-serif text-[34px] leading-tight text-[#4A3827]">Selamat Datang, {profileName}</h2>
							<p className="mt-1 text-[20px] text-[#6C5A43]">
								Your current exhibitions are seeing a 14% increase in engagement this week.
							</p>
						</section>

						<QuickActions />

						<section className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-[1.8fr_0.8fr]">
							<ActivityTable activities={activities} isLoading={isLoadingActivities} />
							<ActiveEventCard event={activeEvent} isLoading={isLoadingEvent} />
						</section>
					</main>
				</div>
			</div>
		</div>
	);
}
