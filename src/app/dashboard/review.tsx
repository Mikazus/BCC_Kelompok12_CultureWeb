import { CircleUserRound, Star } from 'lucide-react'

const reviews = [
	{
		quote:
			'"BudayaHub sangat memudahkan saya menemukan event wayang kulit dan batik yang selama ini saya cari. Pendaftarannya simpel banget!"',
		name: 'Siti Ayu',
		role: 'User - Pecinta Seni Indonesia'
	},
	{
		quote:
			'"Awalnya ragu mau beli tiket online, tapi setelah coba BudayaHub prosesnya cepat dan e-tiketnya langsung masuk ke email. Rekomen banget!"',
		name: 'Andi Kusuma',
		role: 'User - Mahasiswa Universitas Brawijaya'
	},
	{
		quote:
			'"Saya biasanya kesulitan mencari info event budaya di Malang, tapi di BudayaHub semuanya jadi lebih mudah. Jadwal, lokasi, dan tiketnya jelas dalam satu tempat."',
		name: 'Rina Pratiwi',
		role: 'User - Mahasiswi UM Malang'
	}
]

const Review = () => {
	return (
		<section className="relative bg-[#f6f1e9] py-14">
			<div className="mx-auto w-[92%] max-w-338">
				<div className="mb-9 text-center text-[#2f2416]">
					<p className="text-2xl font-semibold">Kata Mereka</p>
					<h2 className="mt-2 text-5xl font-semibold leading-tight">Dipercaya Komunitas Malang</h2>
				</div>

				<div className="grid gap-5 lg:grid-cols-3">
					{reviews.map((review) => (
						<article
							key={review.name}
							className="rounded-3xl border border-[#6f5737]/50 bg-[linear-gradient(100deg,#463215_0%,#5a4522_50%,#4f3a1d_100%)] px-7 py-6 text-[#f8f2e8] shadow-[0_10px_20px_rgba(67,45,19,0.18)]"
						>
							<div className="mb-4 flex gap-1 text-[#ffe54d]" aria-label="5 star rating">
								{Array.from({ length: 5 }).map((_, index) => (
									<Star key={index} className="h-5 w-5 fill-current" aria-hidden="true" />
								))}
							</div>

							<p className="min-h-24 text-base leading-relaxed text-[#f3ede1]">{review.quote}</p>

							<div className="mt-5 flex items-center gap-3">
								<CircleUserRound className="h-8 w-8 text-[#efe4d2]" aria-hidden="true" />
								<div>
									<p className="text-base font-semibold text-white">{review.name}</p>
									<p className="text-sm text-[#eadfce]">{review.role}</p>
								</div>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	)
}

export default Review
