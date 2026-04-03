import Image from "next/image";
import { CalendarDays, Clock3, MapPin, Trash2 } from "lucide-react";
import type { EventCard } from "@/app/EventHighlight/types";
import heroImg from "@/image/dash.png";

type ActiveEventCardProps = {
	event?: EventCard | null;
	isLoading?: boolean;
};

export default function ActiveEventCard({ event, isLoading = false }: ActiveEventCardProps) {
	if (isLoading) {
		return (
			<div>
				<h3 className="mb-3 text-[40px] font-semibold text-[#211A13]">Event Aktif</h3>
				<article className="rounded-2xl border border-[#6D522D] bg-[#F8F6F1] p-6 text-[#493728]">
					<p className="text-lg">Memuat event aktif...</p>
				</article>
			</div>
		);
	}

	if (!event) {
		return (
			<div>
				<h3 className="mb-3 text-[40px] font-semibold text-[#211A13]">Event Aktif</h3>
				<article className="rounded-2xl border border-[#6D522D] bg-[#F8F6F1] p-6 text-[#493728]">
					<p className="text-lg">Belum ada event aktif.</p>
				</article>
			</div>
		);
	}

	return (
		<div>
			<h3 className="mb-3 text-[40px] font-semibold text-[#211A13]">Event Aktif</h3>
			<article className="overflow-hidden rounded-2xl border border-[#6D522D] bg-[#F8F6F1]">
				<div className="relative">
					<Image
						src={event.image || heroImg}
						alt={event.title}
						width={1200}
						height={752}
						className="h-47 w-full object-cover"
						priority
					/>
					{event.stockLabel ? (
						<span className="absolute right-2 top-2 rounded-full bg-[#433A2D]/80 px-4 py-1 text-xs text-[#F8F1E1]">
							{event.stockLabel}
						</span>
					) : null}
				</div>

				<div className="p-4 text-[#493728]">
					<h4 className="text-[34px] font-semibold leading-tight">{event.title}</h4>
					<div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#3F3124]">
						<span className="flex items-center gap-1">
							<MapPin size={14} /> {event.location || "Lokasi belum tersedia"}
						</span>
						<span className="flex items-center gap-1 font-medium">
							<Clock3 size={14} /> {event.priceLabel || "Harga belum tersedia"}
						</span>
					</div>
					<p className="mt-2 flex items-center gap-1 text-sm">
						<CalendarDays size={14} /> {event.dateLabel || "Tanggal belum tersedia"}
					</p>

					<div className="mt-4 flex gap-2">
						<button
							type="button"
							className="flex-1 rounded-full bg-[#A88648] px-4 py-2 text-sm font-medium text-[#FFF8EA] transition hover:bg-[#94743C]"
						>
							Edit
						</button>
						<button
							type="button"
							className="rounded-full bg-[#A88648] px-5 py-2 text-[#FFF8EA] transition hover:bg-[#94743C]"
							aria-label="delete event"
						>
							<Trash2 size={16} />
						</button>
					</div>
				</div>
			</article>
		</div>
	);
}
