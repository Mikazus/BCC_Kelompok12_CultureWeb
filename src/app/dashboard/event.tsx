import Image from 'next/image'
import dashImage from '@/image/dash.png'

const events = [
	{
		title: 'Festival Tari Topeng Malangan',
		place: 'Malang'
	},
	{
		title: 'Festival Tari Topeng Malangan',
		place: 'Surabaya'
	},
	{
		title: 'Festival Tari Topeng Malangan',
		place: 'Yogyakarta'
	}
]

const Fore = () => {
	return (
		<section id="event" className="relative mt-14 bg-[#f6f1e9] py-16">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(183,133,45,0.14),transparent_40%),radial-gradient(circle_at_88%_78%,rgba(183,133,45,0.14),transparent_38%)]" />

			<div className="relative mx-auto w-[92%] max-w-338">
				<div className="mb-8 flex items-center justify-between">
					<h2 className="text-4xl font-semibold text-[#2c2214]">Event Pilihan Bulan Ini</h2>
					<button className="rounded-full border bg-[#967744] px-8 py-4 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#efe2c8]">
						Lihat Semua
					</button>
				</div>

				<div className="grid gap-6 lg:grid-cols-3">
					{events.map((event) => (
						<article
							key={`${event.title}-${event.place}`}
							className="overflow-hidden rounded-2xl border border-[#e2d6c0] bg-[#fffdfa] shadow-[0_8px_20px_rgba(86,65,32,0.09)]"
						>
							<div className="relative h-40 w-full">
								<Image
									src={dashImage}
									alt={event.title}
									className="h-full w-full object-cover"
								/>
							</div>

							<div className="space-y-4 p-5">
								<div className="space-y-2">
									<p className="text-xs uppercase tracking-wider text-[#9d8a68]">8th Topengan</p>
									<h3 className="text-xl font-semibold leading-tight text-[#302413]">{event.title}</h3>
									<p className="text-sm text-[#7f6b49]">
										Mulai petualangan yang tak terlupakan untuk menikmati seni budaya khas daerah.
									</p>
								</div>

								<div className="flex items-center justify-between text-xs text-[#7f6b49]">
									<p>Rp. 25.000 / orang</p>
									<p>12 tiket tersisa</p>
								</div>

								<button className="w-full rounded-full bg-[#c7a05a] py-2 text-sm font-semibold text-white transition-colors hover:bg-[#b88f4b]">
									Lihat Selengkapnya
								</button>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	)
}

export default Fore
