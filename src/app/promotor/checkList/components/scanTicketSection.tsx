"use client";

import { ArrowLeft, Ticket } from "lucide-react";
import { useMemo, useState } from "react";
import QrCameraScanner from "./qrCameraScanner";
import type { CheckInAttendee, CheckInEvent } from "./checkInData";

type ScanTicketSectionProps = {
	event: CheckInEvent;
	attendees: CheckInAttendee[];
	onBack: () => void;
	onValidateTicket: (ticketId: string) => Promise<void>;
	isValidating?: boolean;
	feedbackMessage?: string | null;
	feedbackType?: "success" | "error" | null;
};

function AvatarSeed({ name }: { name: string }) {
	const initials = name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((chunk) => chunk[0]?.toUpperCase() || "")
		.join("");

	return (
		<span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#B58E4E] text-[10px] font-semibold text-[#FFF6E8]">
			{initials}
		</span>
	);
}

export default function ScanTicketSection({
	event,
	attendees,
	onBack,
	onValidateTicket,
	isValidating = false,
	feedbackMessage = null,
	feedbackType = null,
}: ScanTicketSectionProps) {
	const [manualTicketId, setManualTicketId] = useState("");
	const [lastScannedTicket, setLastScannedTicket] = useState("");
	const checkedInCount = useMemo(() => attendees.filter((item) => item.checkedIn).length, [attendees]);

	const handleDetected = async (ticketId: string) => {
		setLastScannedTicket(ticketId);
		await onValidateTicket(ticketId);
	};

	const handleManualValidate = async () => {
		if (!manualTicketId.trim()) {
			return;
		}
		await onValidateTicket(manualTicketId.trim());
		setLastScannedTicket(manualTicketId.trim());
		setManualTicketId("");
	};

	return (
		<section>
			<button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm text-[#6A5947] transition hover:text-[#4A3827]">
				<ArrowLeft size={14} /> change event
			</button>

			<h2 className="mt-2 font-serif text-[44px] font-semibold leading-tight text-[#4A3827]">Scan Tiket</h2>

			<div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_0.95fr]">
				<div>
					<div className="h-87.5 rounded-2xl border border-[#6D522D] bg-[#F8F6F1] p-4">
						<QrCameraScanner onDetected={handleDetected} />
					</div>
					<p className="mt-2 text-center text-xs text-[#6A5947]">
						Event: {event.title} | Checked-in: {checkedInCount}/{attendees.length}
					</p>
					{lastScannedTicket ? (
						<p className="mt-1 text-center text-xs text-[#8A6A34]">Ticket terakhir: {lastScannedTicket}</p>
					) : null}
					{feedbackMessage ? (
						<p
							className={`mt-2 rounded-xl px-3 py-2 text-center text-xs ${
								feedbackType === "error"
									? "bg-[#FFF0F0] text-[#CD4F4F]"
									: "bg-[#E8F8EC] text-[#2B9F47]"
							}`}
						>
							{feedbackMessage}
						</p>
					) : null}

					<div className="mt-8">
						<h3 className="text-[36px] font-semibold text-[#3E3022]">Pencarian Manual</h3>
						<div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px]">
							<div className="relative">
								<Ticket size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#B3AAA0]" />
								<input
									type="text"
									value={manualTicketId}
									onChange={(event) => setManualTicketId(event.target.value)}
									placeholder="Masukkan ID Ticket"
									className="h-12 w-full rounded-xl border border-[#B8B1A8] bg-[#F8F7F5] pl-9 pr-4 text-sm text-[#3D2E21] outline-none focus:border-[#A88648]"
								/>
							</div>
							<button
								type="button"
								onClick={handleManualValidate}
								disabled={isValidating}
								className="h-12 rounded-xl border border-[#CFC7BC] bg-[#F2F1EF] text-sm text-[#8F877D] transition hover:border-[#A88648] hover:text-[#8A6A34]"
							>
								{isValidating ? "Memvalidasi..." : "Validasi"}
							</button>
						</div>
					</div>
				</div>

				<aside className="rounded-2xl border border-[#6D522D] bg-[#F8F6F1] p-4">
					<h3 className="text-[32px] font-semibold text-[#3E3022]">Pengaturan Ticket</h3>
					<div className="mt-4 space-y-3">
						{attendees.map((item) => (
							<article key={item.id} className="flex items-center justify-between rounded-xl border border-[#B9AD9B] bg-[#F9F8F6] px-3 py-2">
								<div className="flex items-center gap-2">
									<AvatarSeed name={item.name} />
									<div className="text-[#463626]">
										<p className="text-sm font-semibold">{item.name}</p>
										<p className="text-[11px]">
											{item.ticketCategory} • {item.timeLabel}
										</p>
									</div>
								</div>

								<span
									className={`inline-flex min-w-20 items-center justify-center rounded-full border px-2 py-1 text-[10px] font-semibold ${
										item.checkedIn
											? "border-[#59B76D] bg-[#E8F8EC] text-[#2B9F47]"
											: "border-[#D5CEC2] bg-[#F4F2EF] text-[#9A9288]"
									}`}
								>
									{item.checkedIn ? "Berhasil" : "Menunggu"}
								</span>
							</article>
						))}
					</div>
				</aside>
			</div>
		</section>
	);
}
