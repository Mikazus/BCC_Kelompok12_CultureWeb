import { Search } from "lucide-react";
import { paymentFilters } from "./attendeeData";

type AttendeeFiltersProps = {
	activeFilter?: (typeof paymentFilters)[number];
	searchValue: string;
	onSearchChange: (value: string) => void;
	onFilterChange: (filter: (typeof paymentFilters)[number]) => void;
};

export default function AttendeeFilters({
	activeFilter = "Semua",
	searchValue,
	onSearchChange,
	onFilterChange,
}: AttendeeFiltersProps) {
	return (
		<section className="mt-5 rounded-2xl border border-[#6E522D] bg-[#F4F1EC] p-4 lg:p-5">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<div className="relative w-full lg:max-w-147.5">
					<Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8C857C]" />
					<input
						type="text"
						value={searchValue}
						onChange={(event) => onSearchChange(event.target.value)}
						placeholder="Cari berdasarkan nama atau id ticket"
						className="h-12 w-full rounded-xl border border-[#D5D0C8] bg-[#F9F9F8] pl-10 pr-4 text-sm text-[#473729] outline-none transition focus:border-[#A88648]"
					/>
				</div>

				<div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 lg:w-auto">
					{paymentFilters.map((filter) => {
						const isActive = filter === activeFilter;
						return (
							<button
								type="button"
								onClick={() => onFilterChange(filter)}
								key={filter}
								className={`h-11 min-w-16 rounded-xl border px-4 text-sm font-medium transition ${
									isActive
										? "border-[#A88648] bg-[#FCFAF5] text-[#8B6A33]"
										: "border-[#D5D0C8] bg-[#F7F7F6] text-[#8E8881] hover:border-[#C7B28A]"
								}`}
							>
								{filter}
							</button>
						);
					})}
				</div>
			</div>
		</section>
	);
}
