import { Plus, ScanQrCode, UserSquare2 } from "lucide-react";

type DashboardStat = {
	title: string;
	value: string;
	icon: "event" | "ticket" | "revenue";
};

type QuickActionsProps = {
	stats: DashboardStat[];
};

const iconByType = {
	event: Plus,
	ticket: UserSquare2,
	revenue: ScanQrCode,
} as const;

export default function QuickActions({ stats }: QuickActionsProps) {
	return (
		<section className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-3">
			{stats.map(({ title, value, icon }) => {
				const Icon = iconByType[icon];

				return (
					<article
						key={title}
						className="rounded-2xl border border-[#936F39] bg-[#F4E4C5] px-5 py-4 text-[#4A3827] shadow-[0_0_0_1px_rgba(147,111,57,0.14)]"
					>
						<div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#AE8C4E] text-[#FFF8EA]">
							<Icon size={18} />
						</div>
						<p className="text-[15px] font-medium text-[#4A3827]">{title}</p>
						<p className="mt-1 text-[38px] font-semibold leading-none text-[#3F3022]">{value}</p>
					</article>
				);
			})}
		</section>
	);
}
