"use client";

import { useEffect, useMemo, useState } from "react";
import dashImage from "@/image/dash.png";
import { getApiErrorMessage } from "@/lib/apiError";
import { checkInEventTicket, getEventAttendees, getMyEvents, type PromotorAttendee } from "@/Services/eventService";
import PromotorSidebar from "../components/promotorSidebar";
import PromotorTopbar from "../components/promotorTopbar";
import usePromotorAuth from "../hooks/usePromotorAuth";
import type { CheckInAttendee, CheckInEvent } from "./components/checkInData";
import EventSelectionSection from "./components/eventSelectionSection";
import ScanTicketSection from "./components/scanTicketSection";

export default function PromotorCheckListPage() {
	const { isAuthResolved, token, profileName, profileRoleLabel } = usePromotorAuth();
	const [events, setEvents] = useState<CheckInEvent[]>([]);
	const [isLoadingEvents, setIsLoadingEvents] = useState(true);
	const [eventLoadError, setEventLoadError] = useState<string | null>(null);
	const [selectedEvent, setSelectedEvent] = useState<CheckInEvent | null>(null);
	const [attendees, setAttendees] = useState<CheckInAttendee[]>([]);
	const [isLoadingAttendees, setIsLoadingAttendees] = useState(false);
	const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
	const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);
	const [isValidatingTicket, setIsValidatingTicket] = useState(false);

	const mapPromotorAttendee = (item: PromotorAttendee): CheckInAttendee => {
		const timeLabel = item.registeredAt.includes("\n")
			? (item.registeredAt.split("\n")[1] || "-").trim()
			: item.registeredAt;

		return {
			id: item.id,
			name: item.fullName,
			ticketCategory: item.ticketCategory,
			timeLabel,
			ticketId: item.ticketCode,
			checkedIn: item.checkedIn,
		};
	};

	useEffect(() => {
		let isMounted = true;

		const loadEvents = async () => {
			if (!token) {
				if (isMounted) {
					setEvents([]);
					setIsLoadingEvents(false);
				}
				return;
			}

			setIsLoadingEvents(true);
			setEventLoadError(null);

			try {
				const eventCards = await getMyEvents(token, {
					limit: "6",
					page: "1",
					search: "",
					category_id: "",
					sort_by: "created_at",
					sort_order: "desc",
				});

				const checkInEvents = await Promise.all(
					eventCards.map(async (eventCard, index) => {
						const eventId = String(eventCard.id);
						const eventAttendees = await getEventAttendees(token, eventId, {
							search: "",
							page: "1",
							limit: "200",
						});

						const checkedInCount = eventAttendees.filter((attendee) => attendee.checkedIn).length;

						return {
							id: eventId,
							title: eventCard.title,
							location: eventCard.location,
							dateLabel: eventCard.dateLabel,
							timeLabel: "Jadwal ada di detail event",
							checkedInCount,
							totalTickets: eventAttendees.length,
							liveLabel: "Live Now",
							ctaLabel: index === 0 ? "Open Gate" : "Start Check-in",
							image: eventCard.image || dashImage,
						} as CheckInEvent;
					})
				);

				if (!isMounted) {
					return;
				}

				setEvents(checkInEvents);
			} catch (error) {
				if (isMounted) {
					setEvents([]);
					setEventLoadError(getApiErrorMessage(error, "Gagal memuat event check-in."));
				}
			} finally {
				if (isMounted) {
					setIsLoadingEvents(false);
				}
			}
		};

		void loadEvents();

		return () => {
			isMounted = false;
		};
	}, [token]);

	useEffect(() => {
		let isMounted = true;

		const loadAttendeesForSelectedEvent = async () => {
			if (!token || !selectedEvent?.id) {
				if (isMounted) {
					setAttendees([]);
					setIsLoadingAttendees(false);
				}
				return;
			}

			setIsLoadingAttendees(true);

			try {
				const rows = await getEventAttendees(token, selectedEvent.id, {
					search: "",
					page: "1",
					limit: "200",
				});

				if (!isMounted) {
					return;
				}

				setAttendees(rows.map(mapPromotorAttendee));
			} catch {
				if (isMounted) {
					setAttendees([]);
				}
			} finally {
				if (isMounted) {
					setIsLoadingAttendees(false);
				}
			}
		};

		void loadAttendeesForSelectedEvent();

		return () => {
			isMounted = false;
		};
	}, [token, selectedEvent?.id]);

	const handleStartCheckIn = (event: CheckInEvent) => {
		setSelectedEvent(event);
		setFeedbackMessage(null);
		setFeedbackType(null);
	};

	const handleBackToSelection = () => {
		setSelectedEvent(null);
		setFeedbackMessage(null);
		setFeedbackType(null);
	};

	const handleValidateTicket = async (ticketId: string) => {
		if (!token || !selectedEvent?.id) {
			setFeedbackMessage("Sesi tidak valid. Silakan login ulang.");
			setFeedbackType("error");
			return;
		}

		const normalizedTicket = ticketId.trim().toLowerCase();
		if (!normalizedTicket) {
			return;
		}

		setIsValidatingTicket(true);
		setFeedbackMessage(null);

		try {
			const response = await checkInEventTicket(token, selectedEvent.id, ticketId.trim());
			setFeedbackMessage(
				typeof response?.message === "string" && response.message.trim()
					? response.message
					: "Check-in berhasil."
			);
			setFeedbackType("success");

			const refreshed = await getEventAttendees(token, selectedEvent.id, {
				search: "",
				page: "1",
				limit: "200",
			});
			setAttendees(refreshed.map(mapPromotorAttendee));
		} catch (error) {
			setFeedbackMessage(getApiErrorMessage(error, "Gagal validasi ticket."));
			setFeedbackType("error");
		} finally {
			setIsValidatingTicket(false);
		}
	};

	const sortedAttendees = useMemo(
		() => [...attendees].sort((a, b) => Number(b.checkedIn) - Number(a.checkedIn)),
		[attendees]
	);

	if (!isAuthResolved) {
		return null;
	}

	return (
		<div className="min-h-screen bg-[#A88648] text-[#433424]">
			<div className="flex min-h-screen w-full flex-col lg:flex-row">
				<PromotorSidebar active="check-in" />

				<div className="flex min-h-screen flex-1 flex-col bg-[#F4F1EC]">
					<PromotorTopbar profileName={profileName} profileRoleLabel={profileRoleLabel} />

					<main className="flex-1 px-5 pb-8 pt-7 md:px-8 lg:px-12 lg:pt-8">
						{selectedEvent ? (
							<ScanTicketSection
								event={selectedEvent}
								attendees={sortedAttendees}
								onBack={handleBackToSelection}
								onValidateTicket={handleValidateTicket}
								isValidating={isValidatingTicket || isLoadingAttendees}
								feedbackMessage={feedbackMessage}
								feedbackType={feedbackType}
							/>
						) : (
							<EventSelectionSection
								events={events}
								onStartCheckIn={handleStartCheckIn}
								isLoading={isLoadingEvents}
								errorMessage={eventLoadError}
							/>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}
