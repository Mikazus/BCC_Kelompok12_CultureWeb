type TicketSettingsValues = {
	ticketName: string;
	price: string;
	quota: string;
	registrationDeadline: string;
};

type TicketSettingsCardProps = {
	values: TicketSettingsValues;
	onChange: (field: keyof TicketSettingsValues, value: string) => void;
};

export default function TicketSettingsCard({ values, onChange }: TicketSettingsCardProps) {
	return (
		<section className="h-fit rounded-2xl border border-[#9B845D] bg-[#F4F1EC] p-6">
			<h3 className="text-[43px] font-semibold leading-tight text-[#3E3022]">Pengaturan Ticket</h3>

			<div className="mt-5 space-y-5">
				<div>
					<label className="mb-2 block text-[20px] font-medium text-[#4E3C2B]">
						Nama Tiket<span className="text-[#A43D2F]">*</span>
					</label>
					<input
						type="text"
						value={values.ticketName}
						onChange={(event) => onChange("ticketName", event.target.value)}
						className="h-14 w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 text-[18px] text-[#3D2E21] outline-none focus:border-[#A88648]"
					/>
				</div>

				<div>
					<label className="mb-2 block text-[20px] font-medium text-[#4E3C2B]">
						Harga Tiket (Rp)<span className="text-[#A43D2F]">*</span>
					</label>
					<input
						type="number"
						value={values.price}
						onChange={(event) => onChange("price", event.target.value)}
						className="h-14 w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 text-[18px] text-[#3D2E21] outline-none focus:border-[#A88648]"
					/>
				</div>

				<div>
					<label className="mb-2 block text-[20px] font-medium text-[#4E3C2B]">
						Kuota Tiket<span className="text-[#A43D2F]">*</span>
					</label>
					<input
						type="number"
						value={values.quota}
						onChange={(event) => onChange("quota", event.target.value)}
						className="h-14 w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 text-[18px] text-[#3D2E21] outline-none focus:border-[#A88648]"
					/>
				</div>

				<div>
					<label className="mb-2 block text-[20px] font-medium text-[#4E3C2B]">
						Batas Waktu Penjualan<span className="text-[#A43D2F]">*</span>
					</label>
					<input
						type="datetime-local"
						value={values.registrationDeadline}
						onChange={(event) => onChange("registrationDeadline", event.target.value)}
						className="h-14 w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 text-[18px] text-[#3D2E21] outline-none focus:border-[#A88648]"
					/>
				</div>

				<button
					type="button"
					className="h-12 w-full rounded-full bg-[#A88648] px-6 text-[20px] font-medium text-[#FFF8EA] transition hover:bg-[#94743C]"
				>
					Tambah Jenis Tiket
				</button>
			</div>
		</section>
	);
}
