import Image from "next/image"

import type { EventDetailData } from "./data"

type HeroProps = {
	detail: EventDetailData
}

const Hero = ({ detail }: HeroProps) => {
	return (
		<section className="mx-auto mt-8 w-[92%] max-w-338">
			<div className="relative overflow-hidden rounded-[26px] border border-[#9f7a3f]/35">
				<Image
					src={detail.image}
					alt={detail.title}
					width={1600}
					height={900}
					priority
					className="h-[360px] w-full object-cover md:h-[430px] lg:h-[500px]"
				/>

				<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(20,14,6,0.88)_8%,rgba(20,14,6,0.28)_56%,rgba(20,14,6,0.58)_100%)]" />

				<div className="absolute bottom-10 left-8 max-w-[620px] text-white sm:left-12">
					<span className="inline-flex rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-medium">
						{detail.category}
					</span>
					<h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">{detail.title}</h1>
					<p className="mt-3 max-w-[560px] text-sm leading-6 text-white/85 sm:text-base">{detail.subtitle}</p>
				</div>
			</div>
		</section>
	)
}

export default Hero
