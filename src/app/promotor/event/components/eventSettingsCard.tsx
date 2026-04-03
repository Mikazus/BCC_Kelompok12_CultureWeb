import { Upload } from "lucide-react";
import type { EventCategoryOption } from "@/Services/eventService";

type EventSettingsValues = {
	categoryId: string;
	title: string;
	summary: string;
	description: string;
	venue: string;
	address: string;
	googleMapsUrl: string;
	startDate: string;
	startTime: string;
	endDate: string;
	endTime: string;
	bannerFile: File | null;
};

type EventSettingsCardProps = {
	values: EventSettingsValues;
	categories: EventCategoryOption[];
	isSubmitting: boolean;
	onChange: (field: keyof EventSettingsValues, value: string | File | null) => void;
	onSubmit: () => void;
};

export default function EventSettingsCard({
	values,
	categories,
	isSubmitting,
	onChange,
	onSubmit,
}: EventSettingsCardProps) {
	return (
		<section className="rounded-2xl border border-[#9B845D] bg-[#F4F1EC] p-6">
			<h3 className="text-[43px] font-semibold leading-tight text-[#3E3022]">Pengaturan Event</h3>

			<div className="mt-5 space-y-5">
				<div>
					<label className="mb-2 block text-[20px] font-medium text-[#4E3C2B]">
						Kategori Event<span className="text-[#A43D2F]">*</span>
					</label>
					<select
						value={values.categoryId}
						onChange={(event) => onChange("categoryId", event.target.value)}
						className="h-14 w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 text-[16px] text-[#3D2E21] outline-none focus:border-[#A88648]"
					>
						<option value="">Pilih kategori</option>
						{categories.map((category) => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="mb-2 block text-[20px] font-medium text-[#4E3C2B]">
						Judul Event<span className="text-[#A43D2F]">*</span>
					</label>
					<input
						type="text"
						value={values.title}
						onChange={(event) => onChange("title", event.target.value)}
						className="h-14 w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 text-[18px] text-[#3D2E21] outline-none focus:border-[#A88648]"
					/>
				</div>

				<div>
					<label className="mb-2 block text-[20px] font-medium text-[#4E3C2B]">Ringkasan Event</label>
					<textarea
						rows={2}
						value={values.summary}
						onChange={(event) => onChange("summary", event.target.value)}
						className="w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 py-3 text-[16px] text-[#3D2E21] outline-none focus:border-[#A88648]"
					/>
				</div>

				<div>
					<label className="mb-2 block text-[20px] font-medium text-[#4E3C2B]">
						Deskripsi Event<span className="text-[#A43D2F]">*</span>
					</label>
					<textarea
						rows={4}
						value={values.description}
						onChange={(event) => onChange("description", event.target.value)}
						className="w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 py-3 text-[18px] text-[#3D2E21] outline-none focus:border-[#A88648]"
					/>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label className="mb-2 block text-[20px] font-medium text-[#4E3C2B]">
							Tanggal Mulai<span className="text-[#A43D2F]">*</span>
						</label>
						<input
							type="date"
							value={values.startDate}
							onChange={(event) => onChange("startDate", event.target.value)}
							className="h-14 w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 text-[18px] text-[#3D2E21] outline-none focus:border-[#A88648]"
						/>
					</div>

					<div>
						<label className="mb-2 block text-[20px] font-medium text-[#4E3C2B]">
							Waktu Mulai<span className="text-[#A43D2F]">*</span>
						</label>
						<input
							type="time"
							value={values.startTime}
							onChange={(event) => onChange("startTime", event.target.value)}
							className="h-14 w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 text-[18px] text-[#3D2E21] outline-none focus:border-[#A88648]"
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label className="mb-2 block text-[20px] font-medium text-[#4E3C2B]">Tanggal Selesai</label>
						<input
							type="date"
							value={values.endDate}
							onChange={(event) => onChange("endDate", event.target.value)}
							className="h-14 w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 text-[18px] text-[#3D2E21] outline-none focus:border-[#A88648]"
						/>
					</div>

					<div>
						<label className="mb-2 block text-[20px] font-medium text-[#4E3C2B]">Waktu Selesai</label>
						<input
							type="time"
							value={values.endTime}
							onChange={(event) => onChange("endTime", event.target.value)}
							className="h-14 w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 text-[18px] text-[#3D2E21] outline-none focus:border-[#A88648]"
						/>
					</div>
				</div>

				<div>
					<label className="mb-2 block text-[20px] font-medium text-[#4E3C2B]">
						Venue<span className="text-[#A43D2F]">*</span>
					</label>
					<input
						type="text"
						value={values.venue}
						onChange={(event) => onChange("venue", event.target.value)}
						className="h-14 w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 text-[18px] text-[#3D2E21] outline-none focus:border-[#A88648]"
					/>
				</div>

				<div>
					<label className="mb-2 block text-[20px] font-medium text-[#4E3C2B]">Address</label>
					<input
						type="text"
						value={values.address}
						onChange={(event) => onChange("address", event.target.value)}
						className="h-14 w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 text-[18px] text-[#3D2E21] outline-none focus:border-[#A88648]"
					/>
				</div>

				<div>
					<label className="mb-2 block text-[20px] font-medium text-[#4E3C2B]">Google Maps URL</label>
					<input
						type="url"
						value={values.googleMapsUrl}
						onChange={(event) => onChange("googleMapsUrl", event.target.value)}
						className="h-14 w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 text-[16px] text-[#3D2E21] outline-none focus:border-[#A88648]"
					/>
				</div>

				<div>
					<label className="mb-2 block text-[20px] font-medium text-[#4E3C2B]">
						Upload Gambar<span className="text-[#A43D2F]">*</span>
					</label>
					<label className="flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#9B8A72] text-[#6A5842]">
						<input
							type="file"
							accept="image/*"
							onChange={(event) => onChange("bannerFile", event.target.files?.[0] || null)}
							className="hidden"
						/>
						<Upload size={34} />
						<span className="mt-3 text-[24px] font-medium">Klik untuk upload gambar event</span>
						{values.bannerFile ? <span className="mt-2 text-sm">{values.bannerFile.name}</span> : null}
					</label>
				</div>

				<div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
					<button
						type="button"
						className="h-12 min-w-32 rounded-full border border-[#B08F59] px-8 text-[20px] font-medium text-[#B08F59] transition hover:bg-[#ECE4D5]"
					>
						Preview
					</button>
					<button
						type="button"
						onClick={onSubmit}
						disabled={isSubmitting}
						className="h-12 rounded-full bg-[#A88648] px-8 text-[20px] font-medium text-[#FFF8EA] transition hover:bg-[#94743C]"
					>
						{isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
					</button>
				</div>
			</div>
		</section>
	);
}
