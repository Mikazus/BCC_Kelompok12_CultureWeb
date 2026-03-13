import Image from 'next/image'
import Link from 'next/link'
import { FiMail, FiSend } from 'react-icons/fi'
import { FaInstagram, FaLinkedinIn } from 'react-icons/fa'

import logo from '@/image/logo.png'

const exploreLinks = [
	'Semua Event',
	'Event Gratis',
	'Event Hari Ini',
	'Event Pekan Ini',
	'Kategori',
	'Budaya',
]

const platformLinks = ['Tentang', 'Kami', 'Cara Kerja', 'Blog Budaya', 'Hubungi', 'Kami']

const legalLinks = ['Syarat & Ketentuan', 'Kebijakan Privasi', 'Kebijakan Tiket', 'FAQ']

const Footer = () => {
	return (
		<footer className="bg-[#e4d2af] text-[#1f1408]">
			<div className="mx-auto w-[92%] max-w-7xl py-12 sm:py-14">
				<div className="grid gap-10 border-b border-[#5f4c2f]/40 pb-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr]">
					<div>
						<div className="flex items-center gap-3">
							<Image src={logo} alt="BudayaHub logo" className="h-10 w-10 object-contain" priority />
							<h3 className="text-3xl font-semibold tracking-tight">BudayaHub</h3>
						</div>
						<p className="mt-4 max-w-[28ch] text-base leading-relaxed text-[#3e2d15]">
							Platform terdepan untuk event budaya di kota Malang. Menghubungkan pecinta
							budaya dengan promotor event lokal terbaik.
						</p>
					</div>

					<div>
						<h4 className="text-2xl font-semibold">Jelajahi</h4>
						<ul className="mt-3 space-y-1.5 text-base text-[#3e2d15]">
							{exploreLinks.map((item) => (
								<li key={item}>
									<Link href="#" className="transition-colors hover:text-[#7f5e2d]">
										{item}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="text-2xl font-semibold">Platform</h4>
						<ul className="mt-3 space-y-1.5 text-base text-[#3e2d15]">
							{platformLinks.map((item, index) => (
								<li key={`${item}-${index}`}>
									<Link href="#" className="transition-colors hover:text-[#7f5e2d]">
										{item}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="text-2xl font-semibold">Legal</h4>
						<ul className="mt-3 space-y-1.5 text-base text-[#3e2d15]">
							{legalLinks.map((item) => (
								<li key={item}>
									<Link href="#" className="transition-colors hover:text-[#7f5e2d]">
										{item}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="text-2xl font-semibold">Newsletter</h4>
						<form className="mt-3">
							<div className="flex h-11 overflow-hidden rounded-md border border-[#7b6440]">
								<input
									type="email"
									placeholder="Message"
									className="w-full bg-[#e4d2af] px-3 text-sm text-[#3e2d15] placeholder:text-[#8b7250] focus:outline-none"
								/>
								<button
									type="submit"
									aria-label="Kirim newsletter"
									className="inline-flex w-12 items-center justify-center border-l border-[#7b6440] text-[#1f1408] transition-colors hover:bg-[#d7c095]"
								>
									<FiSend size={18} />
								</button>
							</div>
						</form>
						<div className="mt-4 flex items-center gap-3 text-lg text-[#1f1408]">
							<Link href="#" aria-label="LinkedIn" className="transition-colors hover:text-[#7f5e2d]">
								<FaLinkedinIn />
							</Link>
							<Link href="#" aria-label="Instagram" className="transition-colors hover:text-[#7f5e2d]">
								<FaInstagram />
							</Link>
							<Link href="#" aria-label="Email" className="transition-colors hover:text-[#7f5e2d]">
								<FiMail />
							</Link>
						</div>
					</div>
				</div>

				<p className="pt-5 text-sm text-[#3e2d15]">© 2026 BudayaHub</p>
			</div>
		</footer>
	)
}

export default Footer
