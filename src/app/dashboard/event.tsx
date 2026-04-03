import Image from 'next/image'
import Link from 'next/link'
import { getEventsByQuery } from '@/Services/eventService'
import type { ApidogModel } from '@/types/api/event'
import type { EventCard } from '../EventHighlight/types'

const buildSummary = (event: EventCard) => {
	if (event.summary && event.summary.trim()) {
		return event.summary
	}

	return `${event.title} hadir dengan rangkaian pengalaman budaya yang seru, terbuka untuk semua kalangan.`
}

const buildStockLabel = (event: EventCard) => {
	if (event.stockLabel && event.stockLabel.trim()) {
		return event.stockLabel
	}

	return 'Tiket terbatas'
}

const Fore = async () => {
	let events: EventCard[] = []

	try {
		const queryOptions: ApidogModel = {
			category_id: '',
			limit: '3',
			page: '1',
			search: '',
			sort_by: 'created_at',
			sort_order: 'desc',
		}

		events = await getEventsByQuery(queryOptions)
	} catch {
		events = []
	}

	return (
		<section id="eventhighlight" className="relative mt-14 bg-[#f6f1e9] py-16">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(183,133,45,0.14),transparent_40%),radial-gradient(circle_at_88%_78%,rgba(183,133,45,0.14),transparent_38%)]" />

			<div className="relative mx-auto w-[92%] max-w-338">
				<div className="mb-8 flex items-center justify-between">
					<h2 className="text-4xl font-semibold text-[#2c2214]">Event Pilihan Bulan Ini</h2>
					<Link
						href="/EventHighlight"
						className="rounded-full border bg-[#967744] px-8 py-4 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#7f6132]"
					>
						Lihat Semua
					</Link>
				</div>

				{events.length === 0 ? (
					<div className="rounded-2xl border border-[#e2d6c0] bg-[#fffdfa] p-6 text-center text-sm text-[#7f6b49]">
						Event belum tersedia saat ini.
					</div>
				) : null}

				<div className="grid gap-6 lg:grid-cols-3">
					{events.map((event) => (
						<article
							key={event.id}
							className="overflow-hidden rounded-2xl border border-[#e2d6c0] bg-[#fffdfa] shadow-[0_8px_20px_rgba(86,65,32,0.09)]"
						>
							<div className="relative h-40 w-full">
								<Image
									src={event.image}
									alt={event.title}
									fill
									sizes="(max-width: 1024px) 92vw, 30vw"
									className="h-full w-full object-cover"
								/>
							</div>

							<div className="space-y-4 p-5">
								<div className="space-y-2">
									<p className="text-xs uppercase tracking-wider text-[#9d8a68]">{event.category}</p>
									<h3 className="text-xl font-semibold leading-tight text-[#302413]">{event.title}</h3>
									<p className="line-clamp-2 text-sm text-[#7f6b49]">{buildSummary(event)}</p>
								</div>

								<div className="flex items-center justify-between text-xs text-[#7f6b49]">
									<p>{event.priceLabel}</p>
									<p>{buildStockLabel(event)}</p>
								</div>

								<Link
									href={event.slug ? `/EventDetail?slug=${encodeURIComponent(event.slug)}` : '/EventDetail'}
									className="block w-full rounded-full bg-[#c7a05a] py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-[#b88f4b]"
								>
									Lihat Selengkapnya
								</Link>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	)
}

export default Fore
