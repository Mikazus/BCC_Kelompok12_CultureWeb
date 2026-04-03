"use client";

import { useEffect, useMemo, useState } from "react";
import EventSettingsCard from "./components/eventSettingsCard";
import PromotorSidebar from "../components/promotorSidebar";
import PromotorTopbar from "../components/promotorTopbar";
import usePromotorAuth from "../hooks/usePromotorAuth";
import TicketSettingsCard from "./components/ticketSettingsCard";
import { createEvent, getCategories, type EventCategoryOption } from "@/Services/eventService";
import { getApiErrorMessage } from "@/lib/apiError";

type EventFormState = {
	categoryId: string;
	title: string;
	summary: string;
	description: string;
	venue: string;
	address: string;
	googleMapsUrl: string;
	startDate: string;
	startTime: string;
	endDate: string;
	endTime: string;
	bannerFile: File | null;
	ticketName: string;
	price: string;
	quota: string;
	registrationDeadline: string;
};

const INITIAL_FORM_STATE: EventFormState = {
	categoryId: "",
	title: "",
	summary: "",
	description: "",
	venue: "",
	address: "",
	googleMapsUrl: "",
	startDate: "",
	startTime: "",
	endDate: "",
	endTime: "",
	bannerFile: null,
	ticketName: "",
	price: "",
	quota: "",
	registrationDeadline: "",
};

const toIsoFromDateTime = (datePart: string, timePart: string) => {
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

const toIsoFromDateTimeLocal = (value: string) => {
	if (!value) {
		return "";
	}

	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		return "";
	}

	return parsed.toISOString();
};

export default function PromotorEventPage() {
	const { isAuthResolved, token, profileName, profileRoleLabel } = usePromotorAuth();
	const [formState, setFormState] = useState<EventFormState>(INITIAL_FORM_STATE);
	const [categories, setCategories] = useState<EventCategoryOption[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		const loadCategories = async () => {
			try {
				const items = await getCategories();
				if (isMounted) {
					setCategories(items);
				}
			} catch {
				if (isMounted) {
					setCategories([]);
				}
			}
		};

		void loadCategories();

		return () => {
			isMounted = false;
		};
	}, []);

	const eventValues = useMemo(
		() => ({
			categoryId: formState.categoryId,
			title: formState.title,
			summary: formState.summary,
			description: formState.description,
			venue: formState.venue,
			address: formState.address,
			googleMapsUrl: formState.googleMapsUrl,
			startDate: formState.startDate,
			startTime: formState.startTime,
			endDate: formState.endDate,
			endTime: formState.endTime,
			bannerFile: formState.bannerFile,
		}),
		[formState]
	);

	const ticketValues = useMemo(
		() => ({
			ticketName: formState.ticketName,
			price: formState.price,
			quota: formState.quota,
			registrationDeadline: formState.registrationDeadline,
		}),
		[formState]
	);

	const handleEventFieldChange = (field: keyof typeof eventValues, value: string | File | null) => {
		setFormState((previous) => ({
			...previous,
			[field]: value,
		}));
	};

	const handleTicketFieldChange = (field: keyof typeof ticketValues, value: string) => {
		setFormState((previous) => ({
			...previous,
			[field]: value,
		}));
	};

	const validateForm = () => {
		if (!formState.categoryId || !formState.title || !formState.description || !formState.venue || !formState.startDate) {
			return "Kategori, judul, deskripsi, venue, dan tanggal mulai wajib diisi.";
		}

		if (!formState.bannerFile) {
			return "Banner event wajib diupload.";
		}

		if (formState.price && Number(formState.price) < 0) {
			return "Harga tiket tidak boleh negatif.";
		}

		if (formState.quota && Number(formState.quota) <= 0) {
			return "Kuota tiket harus lebih dari 0.";
		}

		return null;
	};

	const handleSubmit = async () => {
		setErrorMessage(null);
		setSuccessMessage(null);

		if (!token) {
			setErrorMessage("Sesi login tidak ditemukan. Silakan login ulang.");
			return;
		}

		const validationError = validateForm();
		if (validationError) {
			setErrorMessage(validationError);
			return;
		}

		setIsSubmitting(true);

		try {
			const startDateIso = toIsoFromDateTime(formState.startDate, formState.startTime);
			const endDateIso = toIsoFromDateTime(formState.endDate || formState.startDate, formState.endTime || formState.startTime);
			const registrationDeadlineIso = toIsoFromDateTimeLocal(formState.registrationDeadline);
			const isPaid = Number(formState.price || "0") > 0 ? "true" : "false";

			const response = await createEvent(token, {
				category_id: formState.categoryId,
				title: formState.title,
				summary: formState.summary,
				description: formState.description,
				venue: formState.venue,
				address: formState.address,
				google_maps_url: formState.googleMapsUrl,
				start_date: startDateIso,
				end_date: endDateIso,
				registration_deadline: registrationDeadlineIso,
				is_paid: isPaid,
				price: formState.price || "0",
				quota: formState.quota || "0",
				banner: formState.bannerFile,
			});

			setSuccessMessage(
				typeof response.message === "string" && response.message.trim()
					? response.message
					: "Event berhasil dibuat."
			);
			setFormState(INITIAL_FORM_STATE);
		} catch (error) {
			setErrorMessage(getApiErrorMessage(error, "Gagal membuat event."));
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isAuthResolved) {
		return null;
	}

	return (
		<div className="min-h-screen bg-[#A88648] text-[#433424]">
			<div className="mx-auto flex min-h-screen w-full max-w-360 flex-col lg:flex-row">
				<PromotorSidebar active="event" />

				<div className="flex min-h-screen flex-1 flex-col bg-[#F4F1EC]">
					<PromotorTopbar profileName={profileName} profileRoleLabel={profileRoleLabel} />

					<main className="flex-1 px-5 pb-8 pt-7 md:px-8 lg:px-12 lg:pt-8">
						<h2 className="font-serif text-[42px] font-semibold leading-tight text-[#4A3827]">Buat Event Budaya Baru</h2>
						{errorMessage ? (
							<p className="mt-4 rounded-xl border border-[#D46969] bg-[#FFF0F0] px-4 py-3 text-sm text-[#B74848]">{errorMessage}</p>
						) : null}
						{successMessage ? (
							<p className="mt-4 rounded-xl border border-[#59B76D] bg-[#E8F8EC] px-4 py-3 text-sm text-[#2B9F47]">{successMessage}</p>
						) : null}

						<div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1.12fr_0.74fr]">
							<EventSettingsCard
								values={eventValues}
								categories={categories}
								isSubmitting={isSubmitting}
								onChange={handleEventFieldChange}
								onSubmit={handleSubmit}
							/>
							<TicketSettingsCard values={ticketValues} onChange={handleTicketFieldChange} />
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}
