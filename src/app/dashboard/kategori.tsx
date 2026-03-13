import {
	BookOpen,
	Flower2,
	Music,
	Paintbrush,
	PersonStanding,
	Soup,
	Theater,
	VenetianMask,
	type LucideIcon
} from 'lucide-react'

type CategoryItem = {
	title: string
	count: string
	icon: LucideIcon
}

const categories: CategoryItem[] = [
	{ title: 'Seni Pertunjukan', count: '15 Event', icon: VenetianMask },
	{ title: 'Musik Tradisional', count: '15 Event', icon: Music },
	{ title: 'Tari Daerah', count: '15 Event', icon: PersonStanding },
	{ title: 'Pemeran Seni', count: '15 Event', icon: Paintbrush },
	{ title: 'Upacara Adat', count: '15 Event', icon: Flower2 },
	{ title: 'Festival Adat', count: '15 Event', icon: Theater },
	{ title: 'Kuliner Budaya', count: '15 Event', icon: Soup },
	{ title: 'Seminar Budaya', count: '15 Event', icon: BookOpen }
]

const Kategori = () => {
	return (
		<section className="relative bg-[#f6f1e9] pb-16 pt-8">
			<div className="mx-auto w-[92%] max-w-338">
				<div className="mb-10 text-center text-[#2f2416]">
					<p className="text-2xl font-semibold">Jelajahi</p>
					<h2 className="mt-2 text-4xl font-semibold sm:text-5xl">Semua Kategori</h2>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{categories.map((category) => {
						const Icon = category.icon

						return (
							<article
								key={category.title}
								className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-[#6f5737] bg-[#f7f2ea] px-6 text-center text-[#3d2f1c]"
							>
								<Icon className="mb-4 h-9 w-9" aria-hidden="true" />
								<h3 className="text-xl font-semibold">{category.title}</h3>
								<p className="mt-2 text-lg">{category.count}</p>
							</article>
						)
					})}
				</div>
			</div>
		</section>
	)
}

export default Kategori
