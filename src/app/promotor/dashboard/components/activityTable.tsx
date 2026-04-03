import type { CheckoutActivity } from "@/Services/checkoutService";

type ActivityTableProps = {
	activities: CheckoutActivity[];
	isLoading?: boolean;
};

export default function ActivityTable({ activities, isLoading = false }: ActivityTableProps) {
	const recentActivities = activities.slice(0, 5);

	return (
		<div>
			<h3 className="mb-3 text-[36px] font-semibold text-[#3E3022]">Aktivitas Terkini</h3>
			<div className="overflow-x-auto rounded-2xl border border-[#6D522D] bg-[#F8F6F1]">
				<table className="w-full min-w-165 border-separate border-spacing-0 px-2 py-3 text-left text-[14px] text-[#3E3022]">
					<thead>
						<tr className="text-[15px] font-medium text-[#4D3B29]">
							<th className="px-7 pb-3 pt-5">Aktivitas</th>
							<th className="px-3 pb-3 pt-5">Event</th>
							<th className="px-3 pb-3 pt-5">Waktu</th>
							<th className="px-3 pb-3 pt-5">Harga</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<tr>
								<td className="px-7 py-6 text-[#4A3928]" colSpan={4}>
									Memuat aktivitas checkout...
								</td>
							</tr>
						) : recentActivities.length === 0 ? (
							<tr>
								<td className="px-7 py-6 text-[#4A3928]" colSpan={4}>
									Belum ada aktivitas checkout.
								</td>
							</tr>
						) : (
							recentActivities.map((item, idx) => (
							<tr key={`${item.activity}-${idx}`} className="align-top">
								<td className="px-7 py-3 text-[#4A3928]">{item.activity}</td>
								<td className="px-3 py-3 text-[#493728]">
									<span className="block max-w-55">{item.event}</span>
								</td>
								<td className="px-3 py-3 text-[#A19A8E]">{item.time}</td>
								<td className="px-3 py-3 text-[#4A3928]">{item.price}</td>
							</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
