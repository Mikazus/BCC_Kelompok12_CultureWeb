import Image from 'next/image'
import Link from 'next/link'
import dignImage from '@/image/sign.png'

export default function SignUp() {
	return (
		<main className="min-h-screen bg-[#f2efea] px-4 pb-12 pt-24 sm:px-8">
			<section className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-2xl border border-[#7a6748] bg-[#f5f2ee] md:grid-cols-2">
				<div className="relative min-h-70 md:min-h-155">
					<Image
						src={dignImage}
						alt="Indonesian traditional dance"
						fill
						priority
						className="object-cover"
					/>
					<span className="absolute left-8 top-8 text-4xl font-semibold text-black">Login</span>
				</div>

				<div className="flex flex-col justify-center px-6 py-10 sm:px-10 md:px-12">
					<h1 className="text-4xl font-semibold text-[#1f1a14]">Sign Up</h1>

					<form className="mt-10 space-y-7">
						<div>
							<label htmlFor="email" className="mb-2 block text-lg font-medium text-[#201a12]">
								Email<span className="text-[#a12a2a]">*</span>
							</label>
							<input
								id="email"
								type="email"
								className="h-14 w-full rounded-xl border border-[#b8b8b8] bg-transparent px-4 outline-none ring-0 transition-colors focus:border-[#9a7b45]"
							/>
						</div>

						<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
							<div>
								<label htmlFor="password" className="mb-2 block text-lg font-medium text-[#201a12]">
									Password<span className="text-[#a12a2a]">*</span>
								</label>
								<input
									id="password"
									type="password"
									className="h-12 w-full rounded-xl border border-[#b8b8b8] bg-transparent px-4 outline-none ring-0 transition-colors focus:border-[#9a7b45]"
								/>
							</div>

							<div>
								<label htmlFor="confirm-password" className="mb-2 block text-lg font-medium text-[#201a12]">
									Confirm Password<span className="text-[#a12a2a]">*</span>
								</label>
								<input
									id="confirm-password"
									type="password"
									className="h-12 w-full rounded-xl border border-[#b8b8b8] bg-transparent px-4 outline-none ring-0 transition-colors focus:border-[#9a7b45]"
								/>
							</div>
						</div>

						<label className="flex items-center gap-2 text-sm text-[#8b8b8b]">
							<input type="checkbox" className="h-5 w-5 rounded border border-[#b8b8b8]" />
							Remember me for 30 days
						</label>

						<button
							type="submit"
							className="h-12 w-full rounded-full bg-[#9f7f47] text-base font-medium text-white transition-colors hover:bg-[#876834]"
						>
							Buat Akun
						</button>

						<p className="flex items-center justify-between text-base text-[#8f8a84]">
							Sudah Punya Akun?
							<Link href="/sign-up" className="font-semibold text-[#8a6a34] hover:underline">
								Login
							</Link>
						</p>
					</form>
				</div>
			</section>
		</main>
	)
}
