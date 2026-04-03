import Link from "next/link";
import { LayoutGrid, ScanQrCode, Ticket, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type PromotorSidebarProps = {
	active: "dashboard" | "event" | "attendee" | "check-in";
};

type SidebarLink = {
	key: PromotorSidebarProps["active"];
	label: string;
	icon: LucideIcon;
	href: string;
};

const sidebarLinks: SidebarLink[] = [
	{ key: "dashboard", label: "Dashboard", icon: LayoutGrid, href: "/promotor/dashboard" },
	{ key: "event", label: "Event", icon: Ticket, href: "/promotor/event" },
	{ key: "attendee", label: "Attendees", icon: Users, href: "/promotor/attendee" },
	{ key: "check-in", label: "Check-in", icon: ScanQrCode, href: "/promotor/checkList" },
];

export default function PromotorSidebar({ active }: PromotorSidebarProps) {
	return (
		<aside className="w-full bg-[#A88648] px-6 pb-5 pt-7 text-[#FFF8EC] lg:w-65 lg:px-7 lg:pb-8">
			<div>
				<h1 className="font-serif text-4xl font-semibold leading-none tracking-tight lg:text-[38px]">LokaBudaya</h1>
				<p className="mt-2 text-sm text-[#F4E8D5]">The Digital Curator</p>
			</div>

			<nav className="mt-8 grid grid-cols-2 gap-3 text-sm md:grid-cols-4 lg:grid-cols-1 lg:gap-2">
				{sidebarLinks.map(({ key, label, icon: Icon, href }) => {
					const isActive = active === key;
					const classes = `flex items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
						isActive ? "bg-[#EFE8DC] font-medium text-[#A88648]" : "text-[#FBF1DE] hover:bg-[#BA9A5B]"
					}`;
					return (
						<Link key={key} href={href} className={classes}>
							<Icon size={18} strokeWidth={2.2} />
							<span>{label}</span>
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
