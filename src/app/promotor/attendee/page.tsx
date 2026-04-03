"use client";

import { useEffect, useMemo, useState } from "react";
import { getEventAttendees, getMyEvents, type PromotorAttendee } from "@/Services/eventService";
import PromotorSidebar from "../components/promotorSidebar";
import PromotorTopbar from "../components/promotorTopbar";
import usePromotorAuth from "../hooks/usePromotorAuth";
import AttendeeFilters from "./components/attendeeFilters";
import AttendeeTable from "./components/attendeeTable";
import { paymentFilters, type AttendeeRow } from "./components/attendeeData";

const FILTER_TO_STATUS: Record<(typeof paymentFilters)[number], AttendeeRow["paymentStatus"] | null> = {
	Semua: null,
	Lunas: "lunas",
	Menunggu: "menunggu",
	Dibatalkan: "dibatalkan",
};

export default function PromotorAttendeePage() {
	const { isAuthResolved, token, profileName, profileRoleLabel } = usePromotorAuth();
	const [activeFilter, setActiveFilter] = useState<(typeof paymentFilters)[number]>("Semua");
	const [searchText, setSearchText] = useState("");
	const [rows, setRows] = useState<AttendeeRow[]>([]);
	const [isLoadingRows, setIsLoadingRows] = useState(true);

	useEffect(() => {
		let isMounted = true;

		const loadAttendees = async () => {
			if (!token) {
				if (isMounted) {
					setRows([]);
					setIsLoadingRows(false);
				}
				return;
			}

			setIsLoadingRows(true);

			try {
				const myEvents = await getMyEvents(token, {
					limit: "1",
					page: "1",
					search: "",
					category_id: "",
					sort_by: "created_at",
					sort_order: "desc",
				});

				const eventId = String(myEvents[0]?.id || "").trim();
				if (!eventId) {
					if (isMounted) {
						setRows([]);
					}
					return;
				}

				const attendees = await getEventAttendees(token, eventId, {
					search: searchText,
					page: "1",
					limit: "20",
				});

				if (!isMounted) {
					return;
				}

				setRows(attendees.map((item: PromotorAttendee) => ({
					id: item.id,
					fullName: item.fullName,
					ticketCategory: item.ticketCategory,
					paymentStatus: item.paymentStatus,
					registeredAt: item.registeredAt,
					checkedIn: item.checkedIn,
				})));
			} catch {
				if (isMounted) {
					setRows([]);
				}
			} finally {
				if (isMounted) {
					setIsLoadingRows(false);
				}
			}
		};

		void loadAttendees();

		return () => {
			isMounted = false;
		};
	}, [token, searchText]);

	const visibleRows = useMemo(() => {
		const expectedStatus = FILTER_TO_STATUS[activeFilter];
		if (!expectedStatus) {
			return rows;
		}
		return rows.filter((item) => item.paymentStatus === expectedStatus);
	}, [rows, activeFilter]);

	if (!isAuthResolved) {
		return null;
	}

	return (
		<div className="min-h-screen bg-[#A88648] text-[#433424]">
			<div className="mx-auto flex min-h-screen w-full max-w-360 flex-col lg:flex-row">
				<PromotorSidebar active="attendee" />

				<div className="flex min-h-screen flex-1 flex-col bg-[#F4F1EC]">
					<PromotorTopbar profileName={profileName} profileRoleLabel={profileRoleLabel} />

					<main className="flex-1 px-5 pb-8 pt-7 md:px-8 lg:px-12 lg:pt-8">
						<h2 className="font-serif text-[50px] font-semibold leading-tight text-[#4A3827]">Manajemen Peserta</h2>
						<AttendeeFilters
							activeFilter={activeFilter}
							searchValue={searchText}
							onSearchChange={setSearchText}
							onFilterChange={setActiveFilter}
						/>
						<AttendeeTable rows={visibleRows} isLoading={isLoadingRows} />
					</main>
				</div>
			</div>
		</div>
	);
}
