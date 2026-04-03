"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Footer from "../dashboard/footer"
import { submitCheckout } from "@/Services/checkoutService"
import { getApiErrorMessage } from "@/lib/apiError"
import { getAuthTokenCookie } from "@/lib/authCookie"
import { savePaymentContext } from "./paymentResultStorage"

type TicketForm = {
	holder_name: string
	identity_type: string
	identity_number: string
	holder_phone: string
	holder_email: string
	notes: string
}

const DEFAULT_EVENT_ID = "bcdfacb6-d3ab-48b8-bedc-67b70d6af058"
const DEFAULT_EVENT_TITLE = "Tari Topeng Malang"
const DEFAULT_TICKET_PRICE = 40000
const SERVICE_FEE_PER_TICKET = 2000
const MIN_TICKETS = 1
const MAX_TICKETS = 10
const PROCESS_STEPS = ["Pendaftaran", "Pembayaran", "Selesai"] as const

const createEmptyTicket = (): TicketForm => ({
	holder_name: "",
	identity_type: "KTP",
	identity_number: "",
	holder_phone: "",
	holder_email: "",
	notes: "",
})

const normalizeCount = (value: string | null, fallback = 1) => {
	if (!value) {
		return fallback
	}

	const parsed = Number(value)
	if (!Number.isFinite(parsed)) {
		return fallback
	}

	return Math.min(MAX_TICKETS, Math.max(MIN_TICKETS, Math.floor(parsed)))
}

const normalizePrice = (value: string | null, ticketPriceLabel: string | null, fallback = DEFAULT_TICKET_PRICE) => {
	const normalizedLabel = ticketPriceLabel?.trim().toLowerCase() || ""
	if (normalizedLabel.includes("gratis") || normalizedLabel.includes("free")) {
		return 0
	}

	if (normalizedLabel) {
		const labelDigits = normalizedLabel.replace(/[^\d]/g, "")
		if (labelDigits) {
			const labelParsed = Number(labelDigits)
			if (Number.isFinite(labelParsed) && labelParsed >= 0) {
				return labelParsed
			}
		}
	}

	if (!value || !value.trim()) {
		return fallback
	}

	const normalized = value.trim().toLowerCase()
	if (normalized.includes("gratis") || normalized.includes("free")) {
		return 0
	}

	const digitsOnly = value.replace(/[^\d]/g, "")
	if (!digitsOnly) {
		return fallback
	}

	const parsed = Number(digitsOnly)
	if (!Number.isFinite(parsed) || parsed < 0) {
		return fallback
	}

	return parsed
}

const formatIdr = (value: number) => {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(value)
}

const extractCheckoutData = (value: unknown) => {
	if (typeof value !== "object" || value === null) {
		return { orderId: null, paymentUrl: null }
	}

	const data = value as Record<string, unknown>
	const nestedData =
		typeof data.data === "object" && data.data !== null ? (data.data as Record<string, unknown>) : null

	const orderIdCandidates = [data.order_id, data.orderId, nestedData?.order_id, nestedData?.orderId]
	const paymentUrlCandidates = [
		data.payment_url,
		data.paymentUrl,
		data.redirect_url,
		data.redirectUrl,
		nestedData?.payment_url,
		nestedData?.paymentUrl,
		nestedData?.redirect_url,
		nestedData?.redirectUrl,
	]

	let orderId: string | null = null
	let paymentUrl: string | null = null

	for (const candidate of orderIdCandidates) {
		if (typeof candidate === "string" && candidate.trim()) {
			orderId = candidate.trim()
			break
		}
	}

	for (const candidate of paymentUrlCandidates) {
		if (typeof candidate === "string" && candidate.trim()) {
			paymentUrl = candidate.trim()
			break
		}
	}

	return { orderId, paymentUrl }
}

const CheckOut = () => {
	const searchParams = useSearchParams()
	const eventId = searchParams.get("eventId")?.trim() || searchParams.get("event_id")?.trim() || DEFAULT_EVENT_ID
	const eventTitle =
		searchParams.get("eventTitle")?.trim() || searchParams.get("event_title")?.trim() || DEFAULT_EVENT_TITLE
	const ticketPrice = normalizePrice(
		searchParams.get("ticketPrice") || searchParams.get("ticket_price"),
		searchParams.get("ticketPriceLabel") || searchParams.get("ticket_price_label")
	)
	const initialCount = normalizeCount(searchParams.get("qty") || searchParams.get("quantity"), 1)

	const [ticketCount, setTicketCount] = useState(initialCount)
	const [tickets, setTickets] = useState<TicketForm[]>(() =>
		Array.from({ length: initialCount }, () => createEmptyTicket())
	)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)
	const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
	const currentStep = 1

	const syncTicketCount = (nextCount: number) => {
		const safeCount = Math.min(MAX_TICKETS, Math.max(MIN_TICKETS, nextCount))
		setTicketCount(safeCount)
		setTickets((prev) => {
			if (safeCount === prev.length) {
				return prev
			}

			if (safeCount < prev.length) {
				return prev.slice(0, safeCount)
			}

			return [...prev, ...Array.from({ length: safeCount - prev.length }, () => createEmptyTicket())]
		})
	}

	const updateTicketField = (index: number, field: keyof TicketForm, value: string) => {
		setTickets((prev) =>
			prev.map((ticket, ticketIndex) => {
				if (ticketIndex !== index) {
					return ticket
				}

				return {
					...ticket,
					[field]: value,
				}
			})
		)
	}

	const subtotal = useMemo(() => ticketPrice * ticketCount, [ticketPrice, ticketCount])
	const serviceFee = useMemo(
		() => (ticketPrice > 0 ? SERVICE_FEE_PER_TICKET * ticketCount : 0),
		[ticketPrice, ticketCount]
	)
	const total = useMemo(() => subtotal + serviceFee, [subtotal, serviceFee])

	const handleSubmit = async () => {
		setSubmitError(null)
		setSubmitSuccess(null)

		const hasMissingField = tickets.some(
			(ticket) =>
				!ticket.holder_name.trim() ||
				!ticket.identity_type.trim() ||
				!ticket.identity_number.trim() ||
				!ticket.holder_phone.trim() ||
				!ticket.holder_email.trim()
		)

		if (hasMissingField) {
			setSubmitError("Semua field wajib (kecuali catatan) harus diisi untuk setiap pemesan.")
			return
		}

		const token = getAuthTokenCookie()
		if (!token) {
			setSubmitError("Silakan login terlebih dahulu sebelum checkout.")
			return
		}

		setIsSubmitting(true)

		try {
			const isFreeCheckout = ticketPrice <= 0
			const purchaserEmail = tickets[0]?.holder_email?.trim() || undefined

			const payload = {
				event_id: eventId,
				tickets: tickets.map((ticket) => {
					const notes = ticket.notes.trim()

					return {
						holder_name: ticket.holder_name.trim(),
						identity_type: ticket.identity_type.trim(),
						identity_number: ticket.identity_number.trim(),
						holder_phone: ticket.holder_phone.trim(),
						holder_email: ticket.holder_email.trim(),
						...(notes ? { notes } : {}),
					}
				}),
			}

			const checkoutResult = await submitCheckout(payload, token)
			const { orderId, paymentUrl } = extractCheckoutData(checkoutResult)

			if (isFreeCheckout) {
				savePaymentContext({
					orderId: orderId || undefined,
					eventTitle,
					quantity: ticketCount,
					total,
					purchaserEmail,
					createdAt: new Date().toISOString(),
				})

				const successParams = new URLSearchParams({
					transaction_status: "settlement",
					status_code: "200",
					gross_amount: String(total),
				})

				if (orderId) {
					successParams.set("order_id", orderId)
				}

				window.location.assign(`/order?${successParams.toString()}`)
				return
			}

			if (paymentUrl) {
				savePaymentContext({
					orderId: orderId || undefined,
					eventTitle,
					quantity: ticketCount,
					total,
					purchaserEmail,
					createdAt: new Date().toISOString(),
				})
				window.location.assign(paymentUrl)
				return
			}

			if (orderId) {
				setSubmitSuccess(`Checkout berhasil dibuat (Order ID: ${orderId}). Lanjutkan pembayaran dari halaman pesanan Anda.`)
				return
			}

			setSubmitSuccess("Checkout berhasil dibuat. Lanjutkan ke proses pembayaran.")
		} catch (error) {
			setSubmitError(getApiErrorMessage(error, "Gagal melakukan checkout."))
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<main className="bg-[#f6f1e9] pb-0 pt-20 text-[#2f2416]">
			<section className="mx-auto w-[92%] max-w-338 py-8">
				<div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<h1 className="text-[32px] font-semibold leading-tight">Data Pemesanan</h1>

					<ol className="flex items-center gap-0 text-sm" aria-label="Progress checkout">
					{PROCESS_STEPS.map((step, index) => {
						const stepNumber = index + 1
						const isActive = stepNumber === currentStep
						const isCompleted = stepNumber < currentStep

						return (
							<li key={step} className="flex items-center">
								<span
									className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] leading-none ${
										isActive
											? "border-[#c8b594] bg-[#e8dcc7] text-[#4a3820]"
											: isCompleted
												? "border-[#baa37e] bg-[#d7c2a0] text-[#4a3820]"
												: "border-[#cfc8bb] bg-[#eeebe4] text-[#7f786c]"
									}`}
								>
									{stepNumber}
								</span>
								<span
									className={`ml-2 text-sm leading-none ${
										isActive ? "font-semibold text-[#2f2416]" : "font-medium text-[#3d352b]"
									}`}
								>
									{step}
								</span>
								{index < PROCESS_STEPS.length - 1 ? (
									<span className="mx-2 h-px w-6 bg-[#bfb7aa]" aria-hidden="true" />
								) : null}
							</li>
						)
					})}
					</ol>
				</div>

				<div className="grid gap-4 lg:grid-cols-[1.65fr_0.8fr] lg:items-start">
					<div className="space-y-6">
						{tickets.map((ticket, index) => (
							<section
								key={`ticket-form-${index}`}
								className="rounded-2xl border border-[#9c7c49] bg-[#f5efe6] p-5 sm:p-6"
							>
								{tickets.length > 1 ? <h2 className="mb-4 text-xl font-semibold">Data Pemesanan {index + 1}</h2> : null}

								<div className="grid gap-4 sm:grid-cols-2">
									<label className="sm:col-span-2">
										<span className="mb-1 block text-sm font-medium">
											Nama Lengkap<span className="text-[#c93f3f]">*</span>
										</span>
										<input
											type="text"
											value={ticket.holder_name}
											onChange={(event) => updateTicketField(index, "holder_name", event.target.value)}
											className="h-11 w-full rounded-xl border border-[#bca27a] bg-[#f7f3ec] px-3 text-sm outline-none focus:border-[#8f6f3e]"
										/>
									</label>

									<label>
										<span className="mb-1 block text-sm font-medium">
											Tanda Pengenal<span className="text-[#c93f3f]">*</span>
										</span>
										<select
											value={ticket.identity_type}
											onChange={(event) => updateTicketField(index, "identity_type", event.target.value)}
											className="h-11 w-full rounded-xl border border-[#bca27a] bg-[#f7f3ec] px-3 text-sm outline-none focus:border-[#8f6f3e]"
										>
											<option value="KTP">KTP</option>
											<option value="SIM">SIM</option>
											<option value="Paspor">Paspor</option>
										</select>
									</label>

									<label>
										<span className="mb-1 block text-sm font-medium">
											No. Tanda Pengenal<span className="text-[#c93f3f]">*</span>
										</span>
										<input
											type="text"
											value={ticket.identity_number}
											onChange={(event) => updateTicketField(index, "identity_number", event.target.value)}
											className="h-11 w-full rounded-xl border border-[#bca27a] bg-[#f7f3ec] px-3 text-sm outline-none focus:border-[#8f6f3e]"
										/>
										<p className="mt-1 text-[11px] leading-snug text-[#a39684]">
											Masukkan 16 angka NIK sesuai KTP. Penumpang yang tidak memiliki KTP dapat menggunakan
											nomor kartu keluarga.
										</p>
									</label>

									<label>
										<span className="mb-1 block text-sm font-medium">
											Nomor Handphone<span className="text-[#c93f3f]">*</span>
										</span>
										<input
											type="tel"
											value={ticket.holder_phone}
											onChange={(event) => updateTicketField(index, "holder_phone", event.target.value)}
											className="h-11 w-full rounded-xl border border-[#bca27a] bg-[#f7f3ec] px-3 text-sm outline-none focus:border-[#8f6f3e]"
										/>
									</label>

									<label>
										<span className="mb-1 block text-sm font-medium">
											Email<span className="text-[#c93f3f]">*</span>
										</span>
										<input
											type="email"
											value={ticket.holder_email}
											onChange={(event) => updateTicketField(index, "holder_email", event.target.value)}
											className="h-11 w-full rounded-xl border border-[#bca27a] bg-[#f7f3ec] px-3 text-sm outline-none focus:border-[#8f6f3e]"
										/>
									</label>

									<label className="sm:col-span-2">
										<span className="mb-1 block text-sm font-medium">Catatan</span>
										<input
											type="text"
											value={ticket.notes}
											onChange={(event) => updateTicketField(index, "notes", event.target.value)}
											className="h-11 w-full rounded-xl border border-[#bca27a] bg-[#f7f3ec] px-3 text-sm outline-none focus:border-[#8f6f3e]"
										/>
									</label>
								</div>
							</section>
						))}
					</div>

					<aside className="sticky top-24 overflow-hidden rounded-[22px] border border-[#9c7c49] bg-[#f5efe6] p-4">
						<div className="pointer-events-none absolute -left-3 top-[52%] hidden h-6 w-6 -translate-y-1/2 rounded-full border border-[#9c7c49] bg-[#f6f1e9] lg:block" />
						<div className="pointer-events-none absolute -right-3 top-[52%] hidden h-6 w-6 -translate-y-1/2 rounded-full border border-[#9c7c49] bg-[#f6f1e9] lg:block" />
						<h2 className="text-lg font-semibold">Pemesanan</h2>
						<div className="mt-3 flex items-start justify-between gap-3">
							<div className="flex items-start gap-3">
								<div className="h-11 w-11 shrink-0 rounded-md bg-[#c49f64]/50" />
								<div>
									<p className="text-sm font-semibold leading-tight">{eventTitle}</p>
									<p className="mt-1 text-[11px] text-[#7c6542]">Tiket x{ticketCount}</p>
									<p className="text-sm font-semibold">{ticketPrice === 0 ? "Gratis" : formatIdr(ticketPrice)}</p>
								</div>
							</div>
							<div className="flex items-center gap-1">
								<button
									type="button"
									onClick={() => syncTicketCount(ticketCount - 1)}
									className="h-6 w-6 rounded border border-[#9c7c49] text-sm leading-none"
								>
									-
								</button>
								<span className="min-w-6 text-center text-sm">{ticketCount}</span>
								<button
									type="button"
									onClick={() => syncTicketCount(ticketCount + 1)}
									className="h-6 w-6 rounded border border-[#9c7c49] text-sm"
								>
									+
								</button>
							</div>
						</div>

						<div className="my-4 border-t border-dashed border-[#9c7c49]" />
						<div className="space-y-1.5 text-sm">
							<div className="flex items-center justify-between">
								<p>Subtotal</p>
								<p className="font-medium">{subtotal === 0 ? "Gratis" : formatIdr(subtotal)}</p>
							</div>
							<div className="flex items-center justify-between">
								<p>Services Fee</p>
								<p className="font-medium">{serviceFee === 0 ? "Gratis" : formatIdr(serviceFee)}</p>
							</div>
						</div>

						<div className="mt-4 border-t border-dashed border-[#9c7c49] pt-3">
							<div className="mb-3 flex items-center justify-between text-base font-semibold">
								<p>Total</p>
								<p>{total === 0 ? "Gratis" : formatIdr(total)}</p>
							</div>

							<button
								type="button"
								onClick={handleSubmit}
								disabled={isSubmitting}
								className="h-10 w-full rounded-full bg-[#a7864f] text-sm font-semibold text-white transition-colors hover:bg-[#8f6f3e] disabled:cursor-not-allowed disabled:opacity-70"
							>
								{isSubmitting ? "Memproses..." : ticketPrice <= 0 ? "Dapatkan Tiket" : "Bayar"}
							</button>
						</div>

						{submitError ? <p className="mt-3 text-xs text-[#9a2e2e]">{submitError}</p> : null}
						{submitSuccess ? <p className="mt-3 text-xs text-[#2f6b30]">{submitSuccess}</p> : null}
					</aside>
				</div>
			</section>

			<Footer />
		</main>
	)
}

export default CheckOut