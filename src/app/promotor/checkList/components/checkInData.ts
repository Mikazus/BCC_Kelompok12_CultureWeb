import type { StaticImageData } from "next/image";

export type CheckInEvent = {
	id: string;
	title: string;
	location: string;
	dateLabel: string;
	timeLabel: string;
	checkedInCount: number;
	totalTickets: number;
	liveLabel: string;
	ctaLabel: string;
	image: string | StaticImageData;
};

export type CheckInAttendee = {
	id: string;
	name: string;
	ticketCategory: string;
	timeLabel: string;
	ticketId: string;
	checkedIn: boolean;
};
