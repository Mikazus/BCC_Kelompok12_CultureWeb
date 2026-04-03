"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BellRing, LogOut, Mail, ShieldCheck, Smartphone, UserRound, MessageCircle } from "lucide-react"

import Footer from "../footer"
import { changeMyPassword, getMe, logoutUser, updateMyProfile } from "@/Services/authService"
import { getApiErrorMessage } from "@/lib/apiError"
import { clearAuthTokenCookie, getAuthTokenCookie } from "@/lib/authCookie"

const SIDEBAR_ITEMS = [
	{ label: "Profil Saya", href: "/dashboard/mainMenu/myProfile", active: true },
	{ label: "Ticket Saya", href: "/dashboard/mainMenu" },
	{ label: "Riwayat Transaksi", href: "/dashboard/history" },
]

type NotificationState = {
	email: boolean
	whatsapp: boolean
	push: boolean
}

const MyProfile = () => {
	const router = useRouter()

	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [phone, setPhone] = useState("")

	const [currentPassword, setCurrentPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [confirmNewPassword, setConfirmNewPassword] = useState("")

	const [notifications, setNotifications] = useState<NotificationState>({
		email: true,
		whatsapp: false,
		push: false,
	})

	const [isLoading, setIsLoading] = useState(true)
	const [isSavingProfile, setIsSavingProfile] = useState(false)
	const [isSavingPassword, setIsSavingPassword] = useState(false)
	const [isLoggingOut, setIsLoggingOut] = useState(false)

	const [profileError, setProfileError] = useState<string | null>(null)
	const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
	const [passwordError, setPasswordError] = useState<string | null>(null)
	const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)

	const notificationItems = [
		{
			key: "email" as const,
			label: "Email",
			description: "Update promo & info tiket",
			icon: Mail,
		},
		{
			key: "whatsapp" as const,
			label: "Whatsapp",
			description: "Konfirmasi transaksi instan",
			icon: MessageCircle,
		},
		{
			key: "push" as const,
			label: "Push Notifikasi",
			description: "Pemberitahuan real-time",
			icon: BellRing,
		},
	]

	useEffect(() => {
		let isMounted = true

		const loadProfile = async () => {
			const token = getAuthTokenCookie()
			if (!token) {
				router.replace("/sign-in")
				return
			}

			try {
				const me = await getMe(token)
				if (!isMounted) {
					return
				}

				setName(me.name || "")
				setEmail(me.email || "")
				setPhone(me.phone || "")
			} catch (error) {
				if (isMounted) {
					setProfileError(getApiErrorMessage(error, "Gagal memuat profil Anda."))
				}
			} finally {
				if (isMounted) {
					setIsLoading(false)
				}
			}
		}

		void loadProfile()

		return () => {
			isMounted = false
		}
	}, [router])

	const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const token = getAuthTokenCookie()
		if (!token) {
			router.replace("/sign-in")
			return
		}

		if (!name.trim() || !email.trim() || !phone.trim()) {
			setProfileError("Nama, email, dan nomor handphone wajib diisi.")
			setProfileSuccess(null)
			return
		}

		setIsSavingProfile(true)
		setProfileError(null)
		setProfileSuccess(null)

		try {
			await updateMyProfile(token, {
				name: name.trim(),
				email: email.trim(),
				phone: phone.trim(),
			})
			setProfileSuccess("Profil berhasil diperbarui.")
			window.dispatchEvent(new Event("auth-changed"))
		} catch (error) {
			setProfileError(getApiErrorMessage(error, "Gagal menyimpan perubahan profil."))
		} finally {
			setIsSavingProfile(false)
		}
	}

	const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const token = getAuthTokenCookie()
		if (!token) {
			router.replace("/sign-in")
			return
		}

		if (!currentPassword || !newPassword || !confirmNewPassword) {
			setPasswordError("Semua field kata sandi wajib diisi.")
			setPasswordSuccess(null)
			return
		}

		if (newPassword !== confirmNewPassword) {
			setPasswordError("Konfirmasi kata sandi baru tidak sama.")
			setPasswordSuccess(null)
			return
		}

		setIsSavingPassword(true)
		setPasswordError(null)
		setPasswordSuccess(null)

		try {
			await changeMyPassword(token, {
				current_password: currentPassword,
				new_password: newPassword,
				confirm_new_password: confirmNewPassword,
			})

			setCurrentPassword("")
			setNewPassword("")
			setConfirmNewPassword("")
			setPasswordSuccess("Kata sandi berhasil diperbarui.")
		} catch (error) {
			setPasswordError(getApiErrorMessage(error, "Gagal memperbarui kata sandi."))
		} finally {
			setIsSavingPassword(false)
		}
	}

	const handleLogout = async () => {
		const token = getAuthTokenCookie()
		setIsLoggingOut(true)

		try {
			if (token) {
				await logoutUser(token)
			}
		} catch {
			// Always clear local auth even if API logout fails.
		} finally {
			clearAuthTokenCookie()
			window.dispatchEvent(new Event("auth-changed"))
			router.replace("/sign-in")
			setIsLoggingOut(false)
		}
	}

	return (
		<main className="relative min-h-screen overflow-hidden bg-[#f6f1e9] pt-20 text-[#2f2416]">
			<div className="pointer-events-none absolute left-0 top-24 h-96 w-52 bg-[radial-gradient(circle_at_20%_30%,rgba(166,134,72,0.15),transparent_68%)]" />
			<div className="pointer-events-none absolute bottom-52 right-0 h-130 w-85 bg-[radial-gradient(circle_at_75%_30%,rgba(166,134,72,0.14),transparent_64%)]" />

			<section className="mx-auto w-[92%] max-w-338 pb-16">
				<div className="mt-8 grid gap-5 lg:grid-cols-[0.24fr_0.76fr] lg:gap-6">
					<aside className="self-start rounded-2xl border border-[#9f7a3f]/70 bg-[#f8f3eb] p-4 shadow-[0_6px_14px_rgba(70,45,10,0.08)]">
						<h2 className="text-base font-semibold">Menu Utama</h2>
						<div className="mt-4 space-y-2 text-sm">
							{SIDEBAR_ITEMS.map((item) => (
								<Link
									key={item.label}
									href={item.href}
									className={`block rounded-md px-3 py-2.5 transition-colors ${
										item.active ? "bg-[#a7864f] text-white" : "text-[#5f4a2e] hover:bg-[#efe2ce]"
									}`}
								>
									{item.label}
								</Link>
							))}
						</div>
						<div className="mt-4 border-t border-[#d9c6a1] pt-4">
							<button
								type="button"
								onClick={handleLogout}
								disabled={isLoggingOut}
								className="inline-flex items-center gap-2 text-sm font-semibold text-[#ce4a31] disabled:opacity-70"
							>
								<LogOut size={14} />
								{isLoggingOut ? "Keluar..." : "Keluar"}
							</button>
						</div>
					</aside>

					<section>
						<h1 className="wrap-break-word text-4xl font-semibold leading-tight text-[#3f2f1a] sm:text-5xl">Profile Saya</h1>
						<p className="mt-1 max-w-none text-sm text-[#6f5c40] sm:max-w-165">
							Kelola informasi pribadi, keamanan akun, dan preferensi notifikasi Anda dalam satu kurasi digital yang elegan.
						</p>

						<div className="mt-6 grid gap-4 xl:grid-cols-[1.55fr_0.8fr]">
							<form className="rounded-2xl border border-[#9f7a3f]/70 bg-[#f8f3eb] p-4 sm:p-5" onSubmit={handleProfileSubmit}>
								<h3 className="text-sm font-semibold text-[#4e3d24]">Informasi Pribadi</h3>

								{profileError ? (
									<p className="mt-3 rounded-lg border border-[#d59f8f] bg-[#fff2ef] px-3 py-2 text-xs text-[#8d2f2f]">{profileError}</p>
								) : null}

								{profileSuccess ? (
									<p className="mt-3 rounded-lg border border-[#89b68e] bg-[#eef9ef] px-3 py-2 text-xs text-[#2d7c3a]">{profileSuccess}</p>
								) : null}

								<div className="mt-4 space-y-4">
									<div>
										<label className="mb-1 block text-sm font-medium text-[#4E3C2B]">Nama Lengkap*</label>
										<div className="relative">
											<UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8d7b5f]" />
											<input
												value={name}
												onChange={(event) => setName(event.target.value)}
												className="h-12 w-full rounded-xl border border-[#B8B1A8] bg-transparent pl-10 pr-4 text-[15px] text-[#3D2E21] outline-none focus:border-[#A88648]"
												disabled={isLoading || isSavingProfile}
											/>
										</div>
									</div>

									<div className="grid gap-3 sm:grid-cols-2">
										<div>
											<label className="mb-1 block text-sm font-medium text-[#4E3C2B]">Nomor Handphone*</label>
											<div className="relative">
												<Smartphone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8d7b5f]" />
												<input
													value={phone}
													onChange={(event) => setPhone(event.target.value)}
													className="h-12 w-full rounded-xl border border-[#B8B1A8] bg-transparent pl-10 pr-4 text-[15px] text-[#3D2E21] outline-none focus:border-[#A88648]"
													disabled={isLoading || isSavingProfile}
												/>
											</div>
										</div>

										<div>
											<label className="mb-1 block text-sm font-medium text-[#4E3C2B]">Email*</label>
											<div className="relative">
												<Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8d7b5f]" />
												<input
													type="email"
													value={email}
													onChange={(event) => setEmail(event.target.value)}
													className="h-12 w-full rounded-xl border border-[#B8B1A8] bg-transparent pl-10 pr-4 text-[15px] text-[#3D2E21] outline-none focus:border-[#A88648]"
													disabled={isLoading || isSavingProfile}
												/>
											</div>
										</div>
									</div>

									<div className="flex justify-stretch sm:justify-end">
										<button
											type="submit"
											disabled={isLoading || isSavingProfile}
											className="h-11 w-full rounded-full bg-[#a7864f] px-8 text-sm font-semibold text-white transition-colors hover:bg-[#8f6f3e] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
										>
											{isSavingProfile ? "Menyimpan..." : "Simpan Perubahan"}
										</button>
									</div>
								</div>
							</form>

							<aside className="rounded-2xl border border-[#9f7a3f]/70 bg-[#f8f3eb] p-4">
								<h3 className="text-sm font-semibold text-[#4e3d24]">Kelola Notifikasi</h3>

								<div className="mt-3 space-y-1.5">
									{notificationItems.map(({ key, label, description, icon: Icon }) => {
										const checked = notifications[key]

										return (
											<div key={key} className="flex items-center justify-between gap-3 rounded-lg border border-[#dbc7a3] bg-white/45 px-2.5 py-2">
												<div className="inline-flex items-start gap-2">
													<Icon size={14} className="mt-0.5 text-[#5f4a2e]" />
													<div>
														<p className="text-[11px] font-semibold leading-tight text-[#5f4a2e]">{label}</p>
														<p className="mt-0.5 text-[10px] leading-tight text-[#7a694d]">{description}</p>
													</div>
												</div>

												<button
													type="button"
													role="switch"
													aria-checked={checked}
													onClick={() => setNotifications((prev) => ({ ...prev, [key]: !checked }))}
													className={`relative h-5 w-9 rounded-full border transition ${
														checked
															? "border-[#a7864f] bg-[#dcc49b]"
															: "border-[#d7c5a3] bg-[#eee6d9]"
													}`}
												>
													<span
														className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition ${
															checked ? "left-4.5" : "left-0.5"
														}`}
													/>
												</button>
											</div>
										)
									})}
								</div>

								<div className="mt-4 rounded-xl bg-[#6b512b] p-3 text-[10px] text-[#f7e8cf]">
									<p className="font-semibold">Catatan Privasi !</p>
									<p className="mt-1 leading-relaxed">Kami tidak akan membagikan data Anda kepada pihak ketiga tanpa izin eksplisit. Anda dapat mengubah preferensi ini kapan saja.</p>
								</div>
							</aside>
						</div>

						<form className="mt-5 rounded-2xl border border-[#9f7a3f]/70 bg-[#f8f3eb] p-4 sm:p-5" onSubmit={handlePasswordSubmit}>
							<h3 className="inline-flex items-center gap-2 text-sm font-semibold text-[#4e3d24]"><ShieldCheck size={14} /> Keamanan & Kata Sandi</h3>

							{passwordError ? (
								<p className="mt-3 rounded-lg border border-[#d59f8f] bg-[#fff2ef] px-3 py-2 text-xs text-[#8d2f2f]">{passwordError}</p>
							) : null}

							{passwordSuccess ? (
								<p className="mt-3 rounded-lg border border-[#89b68e] bg-[#eef9ef] px-3 py-2 text-xs text-[#2d7c3a]">{passwordSuccess}</p>
							) : null}

							<div className="mt-4 space-y-4">
								<div>
									<label className="mb-1 block text-sm font-medium text-[#4E3C2B]">Kata Sandi Saat Ini*</label>
									<input
										type="password"
										value={currentPassword}
										onChange={(event) => setCurrentPassword(event.target.value)}
										className="h-12 w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 text-[15px] text-[#3D2E21] outline-none focus:border-[#A88648]"
										disabled={isSavingPassword}
									/>
								</div>

								<div className="grid gap-3 sm:grid-cols-2">
									<div>
										<label className="mb-1 block text-sm font-medium text-[#4E3C2B]">Kata Sandi Baru*</label>
										<input
											type="password"
											value={newPassword}
											onChange={(event) => setNewPassword(event.target.value)}
											className="h-12 w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 text-[15px] text-[#3D2E21] outline-none focus:border-[#A88648]"
											disabled={isSavingPassword}
										/>
									</div>

									<div>
										<label className="mb-1 block text-sm font-medium text-[#4E3C2B]">Konfirmasi Kata Sandi Baru*</label>
										<input
											type="password"
											value={confirmNewPassword}
											onChange={(event) => setConfirmNewPassword(event.target.value)}
											className="h-12 w-full rounded-xl border border-[#B8B1A8] bg-transparent px-4 text-[15px] text-[#3D2E21] outline-none focus:border-[#A88648]"
											disabled={isSavingPassword}
										/>
									</div>
								</div>

								<div className="flex justify-stretch sm:justify-end">
									<button
										type="submit"
										disabled={isSavingPassword}
										className="h-11 w-full rounded-full bg-[#a7864f] px-8 text-sm font-semibold text-white transition-colors hover:bg-[#8f6f3e] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
									>
										{isSavingPassword ? "Menyimpan..." : "Simpan Perubahan"}
									</button>
								</div>
							</div>
						</form>
					</section>
				</div>
			</section>

			<Footer />
		</main>
	)
}

export default MyProfile
