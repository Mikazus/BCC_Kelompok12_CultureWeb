"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil, Upload } from "lucide-react";
import PromotorSidebar from "../../components/promotorSidebar";
import PromotorTopbar from "../../components/promotorTopbar";
import usePromotorAuth from "../../hooks/usePromotorAuth";
import {
	getPromotorEventById,
	updatePromotorEvent,
	type PromotorEditableEvent,
} from "@/Services/eventService";
import { getApiErrorMessage } from "@/lib/apiError";
import dashImage from "@/image/dash.png";

const EMPTY_EVENT: PromotorEditableEvent = {
	id: "",
	title: "",
	description: "",
	startDate: "",
	startTime: "",
	venue: "",
	imageUrl: "",
	ticketName: "",
	ticketPrice: "0",
	ticketCapacity: "0",
	ticketSold: 0,
	ticketStatus: "Tersedia",
};

const toIsoDateTime = (datePart: string, timePart: string) => {
	if (!datePart) {
		return "";
	}

	const raw = `${datePart}T${timePart || "00:00"}`;
	const parsed = new Date(raw);
	if (Number.isNaN(parsed.getTime())) {
		return "";
	}

	return parsed.toISOString();
};

const toCurrencyLabel = (value: string) => {
	const parsed = Number(value);
	const safe = Number.isFinite(parsed) ? parsed : 0;
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0,
	}).format(Math.max(0, safe));
};

export default function PromotorEditEventPageContent() {
	const { isAuthResolved, token, profileName, profileRoleLabel } = usePromotorAuth();
	const searchParams = useSearchParams();
	const router = useRouter();

	const [eventData, setEventData] = useState<PromotorEditableEvent>(EMPTY_EVENT);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [newBanner, setNewBanner] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const eventId = (searchParams.get("eventId") || searchParams.get("event_id") || "").trim();

	useEffect(() => {
		if (!newBanner) {
			setPreviewUrl("");
			return;
		}

		const objectUrl = URL.createObjectURL(newBanner);
		setPreviewUrl(objectUrl);

		return () => {
			URL.revokeObjectURL(objectUrl);
		};
	}, [newBanner]);

	useEffect(() => {
		let isMounted = true;

		const loadEvent = async () => {
			if (!token) {
				return;
			}

			if (!eventId) {
				if (isMounted) {
					setErrorMessage("Event ID tidak ditemukan.");
					setIsLoading(false);
				}
				return;
			}

			setIsLoading(true);
			setErrorMessage(null);

			try {
				const data = await getPromotorEventById(token, eventId);
				if (!isMounted) {
					return;
				}

				if (!data) {
					setErrorMessage("Data event tidak ditemukan.");
					setEventData(EMPTY_EVENT);
				} else {
					setEventData(data);
				}
			} catch (error) {
				if (isMounted) {
					setErrorMessage(getApiErrorMessage(error, "Gagal memuat data event untuk diedit."));
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		void loadEvent();

		return () => {
			isMounted = false;
		};
	}, [eventId, token]);

	const soldRatio = useMemo(() => {
		const capacity = Number(eventData.ticketCapacity) || 0;
		if (capacity <= 0) {
			return 0;
		}

		return Math.min(100, Math.max(0, Math.round((eventData.ticketSold / capacity) * 100)));
	}, [eventData.ticketCapacity, eventData.ticketSold]);

	const handleChange = (field: keyof PromotorEditableEvent, value: string) => {
		setEventData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setErrorMessage(null);
		setSuccessMessage(null);

		if (!token || !eventData.id) {
			setErrorMessage("Sesi login atau event ID tidak valid.");
			return;
		}

		if (!eventData.title.trim() || !eventData.description.trim() || !eventData.startDate || !eventData.venue.trim()) {
			setErrorMessage("Judul, deskripsi, tanggal, dan lokasi event wajib diisi.");
			return;
		}

		const startDateIso = toIsoDateTime(eventData.startDate, eventData.startTime);
		if (!startDateIso) {
			setErrorMessage("Tanggal atau waktu event tidak valid.");
			return;
		}

		setIsSubmitting(true);

		try {
			await updatePromotorEvent(token, eventData.id, {
				title: eventData.title,
				description: eventData.description,
				venue: eventData.venue,
				start_date: startDateIso,
				banner: newBanner,
			});

			setSuccessMessage("Perubahan event berhasil disimpan.");
			setNewBanner(null);
		} catch (error) {
			setErrorMessage(getApiErrorMessage(error, "Gagal menyimpan perubahan event."));
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isAuthResolved) {
		return null;
	}

	return (
		<div className="min-h-screen bg-[#A88648] text-[#433424]">
			<div className="flex min-h-screen w-full flex-col lg:flex-row">
				<PromotorSidebar active="event" />

				<div className="flex min-h-screen flex-1 flex-col bg-[#F4F1EC]">
					<PromotorTopbar profileName={profileName} profileRoleLabel={profileRoleLabel} />

					<main className="flex-1 px-5 pb-8 pt-7 md:px-8 lg:px-10 lg:pt-8">
						<h1 className="font-serif text-[42px] font-semibold leading-tight text-[#4A3827]">Edit Event</h1>

						{errorMessage ? (
							<p className="mt-4 rounded-xl border border-[#D46969] bg-[#FFF0F0] px-4 py-3 text-sm text-[#B74848]">{errorMessage}</p>
						) : null}

						{successMessage ? (
							<p className="mt-4 rounded-xl border border-[#59B76D] bg-[#E8F8EC] px-4 py-3 text-sm text-[#2B9F47]">{successMessage}</p>
						) : null}

						<form className="mt-5 space-y-6" onSubmit={handleSubmit}>
							<section className="grid gap-4 xl:grid-cols-[1.45fr_0.9fr]">
								<article className="rounded-2xl border border-[#9B845D] bg-[#F4F1EC] p-5">
									<h2 className="text-[34px] font-semibold leading-tight text-[#3E3022]">Edit Informasi</h2>

									<div className="mt-4 space-y-4">
										<div>
											<label className="mb-1 block text-sm font-medium text-[#4E3C2B]">Judul Event*</label>
											<input
												value={eventData.title}
												onChange={(event) => handleChange("title", event.target.value)}
												className="h-12 w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 text-[16px] text-[#3D2E21] outline-none focus:border-[#A88648]"
												disabled={isLoading}
											/>
										</div>

										<div>
											<label className="mb-1 block text-sm font-medium text-[#4E3C2B]">Deskripsi Event*</label>
											<textarea
												rows={4}
												value={eventData.description}
												onChange={(event) => handleChange("description", event.target.value)}
												className="w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 py-3 text-[15px] text-[#3D2E21] outline-none focus:border-[#A88648]"
												disabled={isLoading}
											/>
										</div>

										<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
											<div>
												<label className="mb-1 block text-sm font-medium text-[#4E3C2B]">Tanggal Event*</label>
												<input
													type="date"
													value={eventData.startDate}
													onChange={(event) => handleChange("startDate", event.target.value)}
													className="h-12 w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 text-[15px] text-[#3D2E21] outline-none focus:border-[#A88648]"
													disabled={isLoading}
												/>
											</div>

											<div>
												<label className="mb-1 block text-sm font-medium text-[#4E3C2B]">Waktu Mulai*</label>
												<input
													type="time"
													value={eventData.startTime}
													onChange={(event) => handleChange("startTime", event.target.value)}
													className="h-12 w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 text-[15px] text-[#3D2E21] outline-none focus:border-[#A88648]"
													disabled={isLoading}
												/>
											</div>
										</div>

										<div>
											<label className="mb-1 block text-sm font-medium text-[#4E3C2B]">Lokasi Event*</label>
											<input
												value={eventData.venue}
												onChange={(event) => handleChange("venue", event.target.value)}
												className="h-12 w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 text-[15px] text-[#3D2E21] outline-none focus:border-[#A88648]"
												disabled={isLoading}
											/>
										</div>
									</div>
								</article>

								<article className="rounded-2xl border border-[#9B845D] bg-[#F4F1EC] p-5">
									<h2 className="text-[34px] font-semibold leading-tight text-[#3E3022]">Edit Foto</h2>

									<div className="mt-4 space-y-3">
										<div className="relative overflow-hidden rounded-xl border border-dashed border-[#9B8A72]">
											<Image
												src={previewUrl || eventData.imageUrl || dashImage}
												alt={eventData.title || "Banner event"}
												width={900}
												height={500}
												className="h-48 w-full object-cover"
											/>
										</div>

										<label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#9B8A72] px-4 py-4 text-sm font-medium text-[#5A4833] transition hover:bg-[#EEE6D8]">
											<input
												type="file"
												accept="image/*"
												className="hidden"
												onChange={(event) => setNewBanner(event.target.files?.[0] || null)}
											/>
											<Upload size={18} />
											{newBanner ? newBanner.name : "Ganti Foto"}
										</label>
									</div>
								</article>
							</section>

							<section className="rounded-2xl border border-[#9B845D] bg-[#F4F1EC] p-5">
								<div className="flex items-center justify-between">
									<h2 className="text-[34px] font-semibold leading-tight text-[#3E3022]">Pengaturan Ticket</h2>
								</div>

								<div className="mt-4 overflow-x-auto">
									<table className="w-full min-w-150 text-left text-sm text-[#4A3827]">
										<thead>
											<tr className="text-[#7B6A53]">
												<th className="pb-2">Nama Ticket</th>
												<th className="pb-2">Harga</th>
												<th className="pb-2">Kapasitas</th>
												<th className="pb-2">Status</th>
												<th className="pb-2">Aksi</th>
											</tr>
										</thead>
										<tbody>
											<tr className="border-t border-[#E1D6C3] align-middle">
												<td className="py-3 font-medium">{eventData.ticketName || `${eventData.title || "Event"} Ticket`}</td>
												<td className="py-3">{toCurrencyLabel(eventData.ticketPrice)}</td>
												<td className="py-3">
													<div className="flex items-center gap-2">
														<div className="h-2 w-24 overflow-hidden rounded-full bg-[#E3D7C4]">
															<div className="h-full rounded-full bg-[#A88648]" style={{ width: `${soldRatio}%` }} />
														</div>
														<span className="text-xs text-[#6F5E47]">
															{eventData.ticketSold}/{eventData.ticketCapacity || "0"} terjual
														</span>
													</div>
												</td>
												<td className="py-3">
													<span className="inline-flex rounded-full border border-[#75B781] bg-[#EAF8ED] px-3 py-0.5 text-xs font-medium text-[#2D9441]">
														{eventData.ticketStatus}
													</span>
												</td>
												<td className="py-3">
													<button type="button" className="text-[#6A5538]" aria-label="edit ticket">
														<Pencil size={15} />
													</button>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</section>

							<div className="flex flex-wrap justify-end gap-3">
								<button
									type="button"
									onClick={() => router.back()}
									className="h-11 rounded-full border border-[#B08F59] px-7 text-sm font-medium text-[#B08F59] transition hover:bg-[#ECE4D5]"
								>
									Batal
								</button>
								<button
									type="submit"
									disabled={isSubmitting || isLoading}
									className="h-11 rounded-full bg-[#A88648] px-7 text-sm font-medium text-[#FFF8EA] transition hover:bg-[#94743C] disabled:cursor-not-allowed disabled:opacity-70"
								>
									{isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
								</button>
							</div>
						</form>
					</main>
				</div>
			</div>
		</div>
	);
}
