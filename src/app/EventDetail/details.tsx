import { CalendarDays, Clock3, MapPin, Ticket } from "lucide-react"
import Link from "next/link"

import type { EventDetailData } from "./data"

type DetailCardProps = {
	detail: EventDetailData
}

const DetailCard = ({ detail }: DetailCardProps) => {
	const normalizedPriceLabel = (detail.priceLabel || "").trim()
	const parsedTicketPrice = Number(normalizedPriceLabel.replace(/[^\d]/g, ""))
	const ticketPriceNumber = Number.isFinite(parsedTicketPrice) ? parsedTicketPrice : 25000
	const titleWords = detail.title.trim().split(/\s+/)
	const headingPrimary = titleWords.length >= 2 ? `${titleWords[0]} ${titleWords[titleWords.length - 1]}` : detail.title
	const headingSecondary = titleWords.length >= 3 ? titleWords[1] : ""
	const headingTertiary = titleWords.length >= 4 ? titleWords[2] : ""
	const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=112.61%2C-8.06%2C112.66%2C-7.94&layer=mapnik&marker=-7.9839%2C112.6304`
	const orderHref = `/order?eventId=${encodeURIComponent(String(detail.eventId || ""))}&eventTitle=${encodeURIComponent(detail.title)}&ticketPrice=${ticketPriceNumber}&ticketPriceLabel=${encodeURIComponent(normalizedPriceLabel)}&qty=1`

	return (
		<section className="mx-auto mt-6 w-[92%] max-w-338">
			<div className="grid gap-5 lg:grid-cols-[1.62fr_1fr]">
				<article className="relative overflow-hidden rounded-2xl border border-[#b59462] bg-[#f2efe9] p-8 shadow-[0_8px_20px_rgba(86,65,32,0.09)]">
					<div className="pointer-events-none absolute -left-8 -top-9 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(181,148,98,0.25)_0%,rgba(181,148,98,0.08)_50%,transparent_70%)]" />
					<div className="pointer-events-none absolute -bottom-9 -right-10 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(181,148,98,0.2)_0%,rgba(181,148,98,0.04)_58%,transparent_72%)]" />

					<div className="relative grid gap-3 sm:grid-cols-[1.2fr_0.8fr_0.8fr] sm:items-start">
						<h2 className="font-[Georgia,Times_New_Roman,serif] text-4xl font-semibold leading-[1.05] text-[#3a2a15] sm:text-5xl">
							{headingPrimary}
						</h2>
						{headingSecondary ? (
							<p className="pt-1 font-[Georgia,Times_New_Roman,serif] text-4xl font-semibold leading-[1.05] text-[#3a2a15] sm:text-5xl">
								{headingSecondary}
							</p>
						) : null}
						{headingTertiary ? (
							<p className="pt-1 font-[Georgia,Times_New_Roman,serif] text-4xl font-semibold leading-[1.05] text-[#3a2a15] sm:text-5xl">
								{headingTertiary}
							</p>
						) : null}
					</div>

					<p className="relative mt-6 max-w-[96%] text-[15px] leading-[1.9] tracking-[0.01em] text-[#382812] sm:text-[17px]">
						{detail.description}
					</p>
				</article>

				<div className="space-y-5">
					<article className="relative overflow-hidden rounded-4xl border border-[#a88449] bg-[#f3f0eb] p-5 text-[#1f1a14] sm:p-6">
						<div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 sm:gap-y-6">
							<div className="flex items-center gap-4">
								<div className="rounded-2xl bg-[#e9dcc7] p-3 text-[#111111]">
									<CalendarDays className="h-5 w-5" aria-hidden="true" />
								</div>
								<div>
									<p className="text-[12px] font-medium text-[#8f8a83] sm:text-[13px]">Tanggal</p>
									<p className="text-xl font-semibold leading-tight text-[#15120f] sm:text-[22px]">{detail.dateLabel}</p>
								</div>
							</div>

							<div className="flex items-center gap-4">
								<div className="rounded-2xl bg-[#e9dcc7] p-3 text-[#111111]">
									<MapPin className="h-5 w-5" aria-hidden="true" />
								</div>
								<div>
									<p className="text-[12px] font-medium text-[#8f8a83] sm:text-[13px]">Lokasi</p>
									<p className="text-xl font-semibold leading-tight text-[#15120f] sm:text-[22px]">{detail.location}</p>
								</div>
							</div>

							<div className="flex items-center gap-4">
								<div className="rounded-2xl bg-[#e9dcc7] p-3 text-[#111111]">
									<Clock3 className="h-5 w-5" aria-hidden="true" />
								</div>
								<div>
									<p className="text-[12px] font-medium text-[#8f8a83] sm:text-[13px]">Jam</p>
									<p className="text-xl font-semibold leading-tight text-[#15120f] sm:text-[22px]">10.00 - 15.00</p>
								</div>
							</div>

							<div className="flex items-center gap-4">
								<div className="rounded-2xl bg-[#e9dcc7] p-3 text-[#111111]">
									<Ticket className="h-5 w-5" aria-hidden="true" />
								</div>
								<div>
									<p className="text-[12px] font-medium text-[#8f8a83] sm:text-[13px]">Biaya Tiket</p>
									<p className="text-xl font-semibold leading-tight text-[#15120f] sm:text-[22px]">{detail.priceLabel}</p>
								</div>
							</div>
						</div>

						<div className="mt-6">
							<Link
								href={orderHref}
								className="block w-full rounded-full bg-[#a7864f] px-5 py-3 text-center text-base font-medium text-white transition-colors hover:bg-[#947642] sm:py-4 sm:text-lg"
							>
								Pesan Sekarang
							</Link>
						</div>

						<div className="pointer-events-none absolute -bottom-16 right-6 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(198,168,133,0.22)_0%,rgba(198,168,133,0.08)_55%,transparent_72%)]" />
					</article>

					<article className="relative overflow-hidden rounded-2xl border border-[#b59462] bg-[#f2efe9] p-1.5 shadow-[0_8px_20px_rgba(86,65,32,0.09)]">
						<div className="pointer-events-none absolute right-0 top-0 h-14 w-24 rounded-bl-3xl bg-[#f4dfd3]/50" />
						<iframe
							title={`Peta lokasi ${detail.title}`}
							src={mapUrl}
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
							className="h-52 w-full rounded-xl border border-[#cfb996]"
						/>
					</article>
				</div>
			</div>
		</section>
	)
}

export default DetailCard
