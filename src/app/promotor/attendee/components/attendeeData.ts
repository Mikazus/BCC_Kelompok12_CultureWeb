export type PaymentStatus = "lunas" | "menunggu" | "dibatalkan";

export type AttendeeRow = {
	id: string;
	fullName: string;
	ticketCategory: string;
	paymentStatus: PaymentStatus;
	registeredAt: string;
	checkedIn: boolean;
};

export const paymentFilters = ["Semua", "Lunas", "Menunggu", "Dibatalkan"] as const;
