"use client";

import { FormEvent, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/Services/authService'
import { getApiErrorMessage } from '@/lib/apiError'
import dignImage from '@/image/sign.png'

export default function SignUp() {
	const router = useRouter()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [phone, setPhone] = useState('')
	const [gender, setGender] = useState<'male' | 'female'>('male')
	const [rememberMe, setRememberMe] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	const validateForm = () => {
		if (!name.trim() || !email.trim() || !password || !confirmPassword || !phone.trim()) {
			return 'Nama, email, password, konfirmasi password, dan nomor telepon wajib diisi.'
		}

		if (!email.includes('@')) {
			return 'Format email belum valid.'
		}

		if (password.length < 8) {
			return 'Password minimal 8 karakter.'
		}

		if (password !== confirmPassword) {
			return 'Konfirmasi password tidak sama.'
		}

		if (!/^[0-9]+$/.test(phone.trim())) {
			return 'Nomor telepon hanya boleh berisi angka.'
		}

		return null
	}

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setErrorMessage(null)
		setSuccessMessage(null)

		const validationError = validateForm()
		if (validationError) {
			setErrorMessage(validationError)
			return
		}

		setIsSubmitting(true)

		try {
			const response = await registerUser({
				name: name.trim(),
				email: email.trim(),
				password,
				confirmPassword,
				phone: phone.trim(),
				role: 'user',
				gender,
			})

			setSuccessMessage(response.message || 'Akun berhasil dibuat. Silakan login.')
			setName('')
			setEmail('')
			setPassword('')
			setConfirmPassword('')
			setPhone('')
			setGender('male')
			setRememberMe(false)

			setTimeout(() => {
				router.push('/sign-in')
			}, 1000)
		} catch (error) {
			setErrorMessage(getApiErrorMessage(error, 'Gagal membuat akun.'))
		} finally {
			setIsSubmitting(false)
		}
	}

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
				</div>

				<div className="flex flex-col justify-center px-6 py-10 sm:px-10 md:px-12">
					<h1 className="text-4xl font-semibold text-[#1f1a14]">Sign Up</h1>

					<form className="mt-10 space-y-7" onSubmit={handleSubmit}>
						{errorMessage ? (
							<p className="rounded-xl border border-[#d59f8f] bg-[#fff2ef] px-4 py-3 text-sm text-[#8d2f2f]">{errorMessage}</p>
						) : null}
						{successMessage ? (
							<p className="rounded-xl border border-[#9cc28f] bg-[#f2ffef] px-4 py-3 text-sm text-[#2f6c2e]">{successMessage}</p>
						) : null}
						<div>
							<label htmlFor="name" className="mb-2 block text-lg font-medium text-[#201a12]">
								Nama<span className="text-[#a12a2a]">*</span>
							</label>
							<input
								id="name"
								type="text"
								value={name}
								onChange={(event) => setName(event.target.value)}
								className="h-14 w-full rounded-xl border border-[#b8b8b8] bg-transparent px-4 text-[#201a12] caret-[#201a12] placeholder:text-[#b8b8b8] outline-none ring-0 transition-colors focus:border-[#9a7b45]"
							/>
						</div>

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

						<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
							<div>
								<label htmlFor="phone" className="mb-2 block text-lg font-medium text-[#201a12]">
									Nomor Telepon<span className="text-[#a12a2a]">*</span>
								</label>
								<input
									id="phone"
									type="tel"
									value={phone}
									onChange={(event) => setPhone(event.target.value)}
									className="h-12 w-full rounded-xl border border-[#b8b8b8] bg-transparent px-4 text-[#201a12] caret-[#201a12] placeholder:text-[#b8b8b8] outline-none ring-0 transition-colors focus:border-[#9a7b45]"
								/>
							</div>

							<div>
								<label htmlFor="gender" className="mb-2 block text-lg font-medium text-[#201a12]">
									Gender<span className="text-[#a12a2a]">*</span>
								</label>
								<select
									id="gender"
									value={gender}
									onChange={(event) => setGender(event.target.value as 'male' | 'female')}
									className="h-12 w-full rounded-xl border border-[#b8b8b8] bg-transparent px-4 text-[#201a12] outline-none ring-0 transition-colors focus:border-[#9a7b45]"
								>
									<option value="male">Male</option>
									<option value="female">Female</option>
								</select>
							</div>
						</div>

						<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
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

							<div>
								<label htmlFor="confirm-password" className="mb-2 block text-lg font-medium text-[#201a12]">
									Confirm Password<span className="text-[#a12a2a]">*</span>
								</label>
								<input
									id="confirm-password"
									type="password"
									value={confirmPassword}
									onChange={(event) => setConfirmPassword(event.target.value)}
									className="h-12 w-full rounded-xl border border-[#b8b8b8] bg-transparent px-4 text-[#201a12] caret-[#201a12] placeholder:text-[#b8b8b8] outline-none ring-0 transition-colors focus:border-[#9a7b45]"
								/>
							</div>
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
							{isSubmitting ? 'Memproses...' : 'Buat Akun'}
						</button>

						<p className="flex items-center justify-between text-base text-[#8f8a84]">
							Sudah Punya Akun?
							<Link href="/sign-in" className="font-semibold text-[#8a6a34] hover:underline">
								Login
							</Link>
						</p>
					</form>
				</div>
			</section>
		</main>
	)
}