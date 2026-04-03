import Link from 'next/link'

const Engage = () => {
	return (
		<section className="bg-[#f6f1e9] pb-18 pt-8">
			<div className="mx-auto w-[92%] max-w-338 rounded-[30px] bg-[#e4d2af] px-6 py-14 text-center text-[#4a3a23] sm:px-10 md:py-20">
				<h2 className="mx-auto max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
					Jangan Lewatkan Perayaan Budaya Terbesar Tahun Ini
				</h2>

				<p className="mx-auto mt-5 max-w-2xl text-lg text-[#5f4c2f] sm:text-2xl">
					Bergabung dengan ribuan pecinta budaya event di Malang.
				</p>

				<Link href="/EventHighlight" className="mt-8 inline-flex h-12 w-full max-w-sm items-center justify-center rounded-full bg-[#9f7a3f] px-6 text-base font-semibold text-[#f9f3e9] transition-colors hover:bg-[#8d6b36] sm:h-14 sm:text-lg">
					Pesan Sekarang
				</Link>
			</div>
		</section>
	)
}

export default Engage
