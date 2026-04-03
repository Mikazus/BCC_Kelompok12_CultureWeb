import type { AttendeeRow, PaymentStatus } from "./attendeeData";

const statusStyles: Record<PaymentStatus, string> = {
	lunas: "border-[#59B76D] bg-[#E8F8EC] text-[#2B9F47]",
	menunggu: "border-[#D9A646] bg-[#FFF4DF] text-[#D29B2A]",
	dibatalkan: "border-[#D46969] bg-[#FFF0F0] text-[#CD4F4F]",
};

const statusLabel: Record<PaymentStatus, string> = {
	lunas: "LUNAS",
	menunggu: "MENUNGGU",
	dibatalkan: "DIBATALKAN",
};

function StatusPill({ status }: { status: PaymentStatus }) {
	return (
		<span className={`inline-flex min-w-20 items-center justify-center rounded-full border px-2 py-1 text-[10px] font-semibold ${statusStyles[status]}`}>
			{statusLabel[status]}
		</span>
	);
}

function AvatarSeed({ name }: { name: string }) {
	const initials = name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((chunk) => chunk[0]?.toUpperCase() || "")
		.join("");

	return (
		<span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#B58E4E] text-[10px] font-semibold text-[#FFF6E8]">
			{initials}
		</span>
	);
}

function Row({ item }: { item: AttendeeRow }) {
	return (
		<tr className="align-top text-[#473729]">
			<td className="px-4 py-4">
				<div className="flex items-center gap-2">
					<AvatarSeed name={item.fullName} />
					<span>{item.fullName}</span>
				</div>
			</td>
			<td className="px-4 py-4">{item.ticketCategory}</td>
			<td className="px-4 py-4">
				<StatusPill status={item.paymentStatus} />
			</td>
			<td className="px-4 py-4 whitespace-pre-line">{item.registeredAt}</td>
			<td className="px-4 py-4 text-center">
				<input
					type="checkbox"
					defaultChecked={item.checkedIn}
					className="h-5 w-5 rounded border border-[#B8B0A4] accent-[#A88648]"
				/>
			</td>
		</tr>
	);
}

type AttendeeTableProps = {
	rows: AttendeeRow[];
	isLoading?: boolean;
};

export default function AttendeeTable({ rows, isLoading = false }: AttendeeTableProps) {
	return (
		<section className="mt-7 overflow-x-auto rounded-2xl border border-[#6E522D] bg-[#F4F1EC] p-3 sm:p-4">
			<table className="w-full min-w-195 border-separate border-spacing-0 text-left text-[18px]">
				<thead>
					<tr className="text-[20px] font-semibold text-[#3D3023]">
						<th className="px-4 pb-2 pt-4">Nama Lengkap</th>
						<th className="px-4 pb-2 pt-4">Kategori Tiket</th>
						<th className="px-4 pb-2 pt-4">Status Pembayaran</th>
						<th className="px-4 pb-2 pt-4">Waktu Daftar</th>
						<th className="px-4 pb-2 pt-4 text-center">Check-in Status</th>
					</tr>
				</thead>
				<tbody>
					{isLoading ? (
						<tr>
							<td className="px-4 py-6 text-[#473729]" colSpan={5}>
								Memuat data peserta...
							</td>
						</tr>
					) : rows.length === 0 ? (
						<tr>
							<td className="px-4 py-6 text-[#473729]" colSpan={5}>
								Belum ada peserta untuk event ini.
							</td>
						</tr>
					) : (
						rows.map((item) => <Row key={item.id} item={item} />)
					)}
				</tbody>
			</table>
		</section>
	);
}
