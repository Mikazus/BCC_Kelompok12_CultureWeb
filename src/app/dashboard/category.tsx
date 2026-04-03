import { getCategories } from '@/Services/eventService'

const formatEventCount = (value: number | undefined) => {
	if (typeof value !== 'number' || !Number.isFinite(value)) {
		return null
	}

	const safeCount = Math.max(0, value)
	return `${safeCount} Event`
}

const Kategori = async () => {
	let categories = [] as Awaited<ReturnType<typeof getCategories>>

	try {
		categories = await getCategories()
	} catch {
		categories = []
	}

	return (
		<section className="relative bg-[#f6f1e9] pb-16 pt-8">
			<div className="mx-auto w-[92%] max-w-338">
				<div className="mb-10 text-center text-[#2f2416]">
					<p className="text-2xl font-semibold">Jelajahi</p>
					<h2 className="mt-2 text-4xl font-semibold sm:text-5xl">Semua Kategori</h2>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{categories.map((category) => {
						const eventCountLabel = formatEventCount(category.event_count)

						return (
							<article
								key={category.id}
								className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-[#6f5737] bg-[#f7f2ea] px-6 text-center text-[#3d2f1c]"
							>
								{category.icon ? (
									<img src={category.icon} alt={`${category.name} icon`} className="mb-4 h-9 w-9" loading="lazy" />
								) : (
									<div className="mb-4 h-9 w-9 rounded-full border border-[#6f5737]/40" aria-hidden="true" />
								)}
								<h3 className="text-xl font-semibold">{category.name}</h3>
								{eventCountLabel ? <p className="mt-2 text-lg">{eventCountLabel}</p> : null}
							</article>
						)
					})}
				</div>

				{categories.length === 0 ? (
					<p className="mt-4 text-center text-sm text-[#6b5638]">Kategori belum tersedia saat ini.</p>
				) : null}
			</div>
		</section>
	)
}

export default Kategori
