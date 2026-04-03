import Image from "next/image";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import type { CheckInEvent } from "./checkInData";

type EventSelectionSectionProps = {
	events: CheckInEvent[];
	onStartCheckIn: (event: CheckInEvent) => void;
	isLoading?: boolean;
	errorMessage?: string | null;
};

function EventCard({ item, onStartCheckIn }: { item: CheckInEvent; onStartCheckIn: (event: CheckInEvent) => void }) {
	return (
		<article className="overflow-hidden rounded-2xl border border-[#6D522D] bg-[#F8F6F1]">
			<div className="relative">
				<Image src={item.image} alt={item.title} width={1200} height={752} className="h-47 w-full object-cover" priority />
				<span className="absolute right-2 top-2 rounded-full bg-[#433A2D]/80 px-3 py-1 text-[10px] text-[#F8F1E1]">
					{item.liveLabel}
				</span>
			</div>

			<div className="p-3 text-[#493728]">
				<h4 className="text-[22px] font-semibold leading-tight">{item.title}</h4>
				<div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#3F3124]">
					<span className="flex items-center gap-1">
						<MapPin size={12} /> {item.location}
					</span>
					<span className="flex items-center gap-1">
						<CalendarDays size={12} /> {item.dateLabel}
					</span>
				</div>
				<div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#3F3124]">
					<span className="flex items-center gap-1">
						<Clock3 size={12} /> {item.timeLabel}
					</span>
					<span>{item.checkedInCount} / {item.totalTickets} checked-in</span>
				</div>

				<button
					type="button"
					onClick={() => onStartCheckIn(item)}
					className="mt-3 h-10 w-full rounded-full bg-[#A88648] px-4 text-sm font-medium text-[#FFF8EA] transition hover:bg-[#94743C]"
				>
					{item.ctaLabel}
				</button>
			</div>
		</article>
	);
}

export default function EventSelectionSection({
	events,
	onStartCheckIn,
	isLoading = false,
	errorMessage = null,
}: EventSelectionSectionProps) {
	return (
		<section>
			<h2 className="font-serif text-[44px] font-semibold leading-tight text-[#4A3827]">Select Event for Check-in</h2>
			<p className="mt-2 max-w-4xl text-sm text-[#6C5A43]">
				Verify identity and manage entry for currently active cultural experiences. Select a live session to initialize the scanning interface.
			</p>
			{errorMessage ? (
				<p className="mt-3 rounded-xl border border-[#D46969] bg-[#FFF0F0] px-3 py-2 text-sm text-[#CD4F4F]">{errorMessage}</p>
			) : null}
			{isLoading ? <p className="mt-3 text-sm text-[#6C5A43]">Memuat event aktif...</p> : null}
			{!isLoading && !errorMessage && events.length === 0 ? (
				<p className="mt-3 text-sm text-[#6C5A43]">Belum ada event yang tersedia untuk check-in.</p>
			) : null}

			<div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
				{events.map((event) => (
					<EventCard key={event.id} item={event} onStartCheckIn={onStartCheckIn} />
				))}
			</div>
		</section>
	);
}
