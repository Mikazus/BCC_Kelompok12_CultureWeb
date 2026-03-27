"use client"

import Link from "next/link"
import Image from "next/image"
import { FaCheck, FaRegEnvelope } from "react-icons/fa6"
import { HiMiniInformationCircle } from "react-icons/hi2"

import Footer from "../dashboard/footer"

export type PaymentSuccessData = {
	orderId: string
	eventTitle: string
	quantity: number
	total: number
	purchaserEmail?: string
	qrValue: string
}

type PaymentSuccessProps = {
	data: PaymentSuccessData
}

const formatCurrency = (amount: number) => {
	if (amount <= 0) {
		return "Gratis"
	}

	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount)
}

const formatOrderLabel = (orderId: string) => {
	if (!orderId.trim()) {
		return "-"
	}

	return orderId.slice(0, 12).toUpperCase()
}

const PaymentSucess = ({ data }: PaymentSuccessProps) => {
	const downloadUrl = `/api/ticket/pdf?order_id=${encodeURIComponent(data.orderId)}`
	const qrSource = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(data.qrValue)}`

	return (
		<main className="min-h-screen bg-[#f6f1e9] pt-20 text-[#2f2416]">
			<section className="mx-auto w-[92%] max-w-338 pb-10">
				<div className="relative mt-6 overflow-hidden rounded-3xl border border-[#dbc9a8] bg-[#f7f2eb] px-5 py-9 sm:px-10">
					<div className="pointer-events-none absolute -right-14 top-12 h-64 w-64 rounded-full border border-[#d8c4a0]/60" />
					<div className="pointer-events-none absolute -left-28 bottom-2 h-64 w-64 rounded-full border border-[#d8c4a0]/45" />

					<div className="relative text-center">
						<span className="mx-auto inline-flex h-13 w-13 items-center justify-center rounded-full bg-[#75e08e] text-[#0f6d2a]">
							<FaCheck className="h-6 w-6" />
						</span>
						<h1 className="mt-5 text-4xl font-semibold text-[#4c3a23] sm:text-[52px]">Pembayaran Berhasil!</h1>
						<p className="mx-auto mt-3 max-w-125 text-sm text-[#6e5d44]">
							Your cultural journey begins now. We have sent your e-ticket details to your email.
						</p>
					</div>

					<section className="relative mt-8 overflow-hidden rounded-3xl border border-[#8d6b39] bg-[#fcf9f4] p-4 sm:p-6">
						<div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
							<div>
								<p className="text-sm font-semibold">Official Ticket</p>
								<h2 className="mt-2 text-3xl font-semibold text-[#1f1408]">{data.eventTitle}</h2>

								<dl className="mt-6 grid grid-cols-2 gap-y-4 text-sm text-[#6d5a3f] sm:max-w-126">
									<div>
										<dt>Tanggal</dt>
										<dd className="mt-1 text-base font-semibold text-[#1f1408]">Minggu, 15 April 2026</dd>
									</div>
									<div>
										<dt>Jam</dt>
										<dd className="mt-1 text-base font-semibold text-[#1f1408]">09.00 - 12.00 WIB</dd>
									</div>
									<div>
										<dt>Lokasi</dt>
										<dd className="mt-1 text-base font-semibold text-[#1f1408]">Begawan Plaza</dd>
									</div>
									<div>
										<dt>ID-Order</dt>
										<dd className="mt-1 text-base font-semibold text-[#1f1408]">{formatOrderLabel(data.orderId)}</dd>
									</div>
									<div>
										<dt>Jenis Ticket</dt>
										<dd className="mt-1 text-base font-semibold text-[#1f1408]">Reguler x{data.quantity}</dd>
									</div>
									<div>
										<dt>Total</dt>
										<dd className="mt-1 text-base font-semibold text-[#1f1408]">{formatCurrency(data.total)}</dd>
									</div>
								</dl>

								<div className="my-6 border-t border-[#c2af89]" />
								<p className="flex items-center gap-2 text-sm text-[#433521]">
									<HiMiniInformationCircle className="h-5 w-5" />
									Please arrive 30 minutes before the event starts.
								</p>
							</div>

							<aside className="relative overflow-hidden rounded-2xl bg-[#e3c78d] px-4 pb-4 pt-5">
								<Image src={qrSource} alt="Ticket QR" width={220} height={220} className="mx-auto rounded-md" unoptimized />
								<div className="my-4 border-t-2 border-dashed border-[#7f5d2b]" />
								<p className="text-center text-xs font-semibold text-[#3f2e16]">Scan at Entrance</p>
								<a
									href={downloadUrl}
									className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-full bg-[#a7864f] text-xs font-semibold text-white transition-colors hover:bg-[#8f6f3e]"
								>
									Download PDF
								</a>
							</aside>
						</div>
					</section>

					<div className="mx-auto mt-8 flex max-w-120 flex-col gap-4">
						<Link
							href="/dashboard/mainMenu"
							className="inline-flex h-10 items-center justify-center rounded-full bg-[#a7864f] px-8 text-sm font-semibold text-white transition-colors hover:bg-[#8f6f3e]"
						>
							Ticket Saya
						</Link>

						<div className="rounded-2xl border border-[#8d6b39] bg-[#f8f3eb] p-4">
							<p className="flex items-center gap-2 text-base font-semibold text-[#1f1408]">
								<FaRegEnvelope className="h-4 w-4" />
								Konfirmasi Sent
							</p>
							<p className="mt-2 text-sm text-[#5d4a2f]">
								A copy of your ticket and receipt has been sent to {data.purchaserEmail || "your email"}. If you do not
								see it, please check your spam folder.
							</p>
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</main>
	)
}

export default PaymentSucess
