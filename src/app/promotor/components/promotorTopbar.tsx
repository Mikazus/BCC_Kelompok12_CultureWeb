import { Bell, Calendar, CircleUserRound } from "lucide-react";

type PromotorTopbarProps = {
	profileName?: string;
	profileRoleLabel?: string;
};

export default function PromotorTopbar({
	profileName = "Promotor",
	profileRoleLabel = "Lead Promotor",
}: PromotorTopbarProps) {
	return (
		<header className="flex h-18.5 items-center justify-end bg-[#A88648] px-6 text-[#FFFBF1] lg:px-8">
			<div className="flex items-center gap-5 text-sm">
				<button type="button" aria-label="notifications" className="opacity-95 transition hover:opacity-75">
					<Bell size={22} />
				</button>
				<button type="button" aria-label="calendar" className="opacity-95 transition hover:opacity-75">
					<Calendar size={22} />
				</button>
				<div className="mx-1 hidden h-8 w-px bg-[#DCC79B] md:block" />
				<div className="hidden items-center gap-3 md:flex">
					<div>
						<p className="text-[16px] font-medium leading-tight">{profileName}</p>
						<p className="text-xs text-[#F2E5CA]">{profileRoleLabel}</p>
					</div>
					<CircleUserRound size={22} />
				</div>
			</div>
		</header>
	);
}
