import Link from "next/link";
import { Plus, ScanQrCode, UserSquare2 } from "lucide-react";

const quickActions = [
	{
		title: "Add New Event",
		description:
			"Commission a new digital or physical exhibition to the Earth & Ether ecosystem.",
		icon: Plus,
		href: "/promotor/event",
	},
	{
		title: "Manage Attendees",
		description: "Review the guest manifest, handle VIP inquiries, and manage access tiers.",
		icon: UserSquare2,
		href: "/promotor/attendee",
	},
	{
		title: "Gate Check-in",
		description: "Launch the scanner for active admissions and real-time validation.",
		icon: ScanQrCode,
		href: "/promotor/checkList",
	},
] as const;

export default function QuickActions() {
	return (
		<section className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-3">
			{quickActions.map(({ title, description, icon: Icon, href }) => (
				<Link
					href={href}
					key={title}
					className="rounded-2xl border border-[#936F39] bg-[#F4E4C5] px-5 py-4 text-[#4A3827] shadow-[0_0_0_1px_rgba(147,111,57,0.14)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(96,71,34,0.2)]"
				>
					<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#AE8C4E] text-[#FFF8EA]">
						<Icon size={23} />
					</div>
					<h3 className="text-[37px] font-semibold leading-none">{title}</h3>
					<p className="mt-2 text-[20px] leading-[1.45] text-[#5D4A33]">{description}</p>
				</Link>
			))}
		</section>
	);
}
