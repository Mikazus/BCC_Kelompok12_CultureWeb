"use client";

import { FormEvent, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/Services/authService'
import { getApiErrorMessage } from '@/lib/apiError'
import { setAuthTokenCookie } from '@/lib/authCookie'
import dignImage from '@/image/sign.png'

export default function Login() {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [rememberMe, setRememberMe] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const handleGoogleLogin = () => {
		const resolvedBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || 'https://event-budaya.iccn.or.id/api'
		window.location.href = `${resolvedBaseUrl}/auth/google/login`
	}

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setErrorMessage(null)

		if (!email.trim() || !password) {
			setErrorMessage('Email dan password wajib diisi.')
			return
		}

		setIsSubmitting(true)

		try {
			const result = await loginUser({
				email: email.trim(),
				password,
			})

			setAuthTokenCookie(result.token, rememberMe)
			window.dispatchEvent(new Event('auth-changed'))
			router.push('/dashboard')
		} catch (error) {
			setErrorMessage(getApiErrorMessage(error, 'Gagal login. Cek kembali email dan password.'))
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<main className="min-h-screen bg-[#f2efea] px-4 pb-12 pt-24 sm:px-8">
			<section className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-2xl border border-[#7a6748] bg-[#f5f2ee] md:grid-cols-2">
				<div className="flex flex-col justify-center px-6 py-10 sm:px-10 md:px-12">
					<h1 className="text-4xl font-semibold text-[#1f1a14]">Login</h1>

					<form className="mt-10 space-y-7" onSubmit={handleSubmit}>
						{errorMessage ? (
							<p className="rounded-xl border border-[#d59f8f] bg-[#fff2ef] px-4 py-3 text-sm text-[#8d2f2f]">{errorMessage}</p>
						) : null}
						<div>
							<label htmlFor="email" className="mb-2 block text-lg font-medium text-[#201a12]">
								Email<span className="text-[#a12a2a]">*</span>
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								className="h-14 w-full rounded-xl border border-[#b8b8b8] bg-transparent px-4 text-[#201a12] caret-[#201a12] placeholder:text-[#b8b8b8] outline-none ring-0 transition-colors focus:border-[#9a7b45]"
							/>
						</div>

						<div>
							<label htmlFor="password" className="mb-2 block text-lg font-medium text-[#201a12]">
								Password<span className="text-[#a12a2a]">*</span>
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								className="h-12 w-full rounded-xl border border-[#b8b8b8] bg-transparent px-4 text-[#201a12] caret-[#201a12] placeholder:text-[#b8b8b8] outline-none ring-0 transition-colors focus:border-[#9a7b45]"
							/>
						</div>

						<label className="flex items-center gap-2 text-sm text-[#8b8b8b]">
							<input
								type="checkbox"
								checked={rememberMe}
								onChange={(event) => setRememberMe(event.target.checked)}
								className="h-5 w-5 rounded border border-[#b8b8b8]"
							/>
							Remember me for 30 days
						</label>

						<button
							type="submit"
							disabled={isSubmitting}
							className="h-12 w-full rounded-full bg-[#9f7f47] text-base font-medium text-white transition-colors hover:bg-[#876834]"
						>
							{isSubmitting ? 'Memproses...' : 'Masuk'}
						</button>

						<div className="flex items-center gap-4 text-sm font-medium text-[#8f8a84]">
							<div className="h-px flex-1 bg-[#b8b8b8]" />
							<span>Or Continue With</span>
							<div className="h-px flex-1 bg-[#b8b8b8]" />
						</div>

						<button
							type="button"
							onClick={handleGoogleLogin}
							className="mx-auto flex h-12 min-w-44 items-center justify-center gap-2 rounded-xl bg-[#9f7f47] px-6 text-sm font-medium text-white transition-colors hover:bg-[#876834]"
						>
							<span className="text-lg leading-none">G</span>
							Google
						</button>

						<p className="text-center text-base text-[#8f8a84]">
							Belum Punya Akun?{' '}
							<Link href="/sign-up" className="font-semibold text-[#8a6a34] hover:underline">
								Register
							</Link>
						</p>
					</form>
				</div>

				<div className="relative min-h-70 md:min-h-155">
					<Image
						src={dignImage}
						alt="Indonesian traditional dance"
						fill
						priority
						className="object-cover"
					/>
				</div>
			</section>
		</main>
	)
}
