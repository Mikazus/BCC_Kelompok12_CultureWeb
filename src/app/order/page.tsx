"use client"

import { Suspense, useMemo } from "react"
import { useSearchParams } from "next/navigation"

import CheckOut from "./CheckOut"
import PaymentSucess, { type PaymentSuccessData } from "./PaymentSucess"
import { readPaymentContext } from "./paymentResultStorage"

const SUCCESS_STATUSES = new Set(["settlement", "capture", "success"])

const readSearchParam = (searchParams: URLSearchParams, keys: string[]) => {
	for (const key of keys) {
		const value = searchParams.get(key)
		if (value && value.trim()) {
			return value.trim()
		}
	}

	return ""
}

const isMidtransCompleted = (searchParams: URLSearchParams) => {
	const statusCode = readSearchParam(searchParams, ["status_code", "statusCode"])
	const transactionStatus = readSearchParam(searchParams, ["transaction_status", "transactionStatus"]).toLowerCase()

	if (SUCCESS_STATUSES.has(transactionStatus)) {
		return true
	}

	return statusCode === "200" && !transactionStatus
}

const normalizeAmount = (value: string) => {
	if (!value) {
		return 0
	}

	const numeric = Number(value.replace(/[^\d.]/g, ""))
	if (!Number.isFinite(numeric) || numeric <= 0) {
		return 0
	}

	return Math.round(numeric)
}

const OrderPageContent = () => {
	const searchParams = useSearchParams()

	const paymentData = useMemo<PaymentSuccessData | null>(() => {
		if (!isMidtransCompleted(searchParams)) {
			return null
		}

		const orderId = readSearchParam(searchParams, ["order_id", "orderId"])
		const amountFromGateway = normalizeAmount(readSearchParam(searchParams, ["gross_amount", "grossAmount"]))
		const context = readPaymentContext()

		const quantity = context?.quantity && context.quantity > 0 ? context.quantity : 1
		const total = amountFromGateway > 0 ? amountFromGateway : context?.total || 0

		return {
			orderId: orderId || context?.orderId || "-",
			eventTitle: context?.eventTitle || "Festival Budaya Lokal",
			quantity,
			total,
			purchaserEmail: context?.purchaserEmail,
			qrValue: orderId || context?.orderId || "ticket-fallback",
		}
	}, [searchParams])

	if (paymentData) {
		return <PaymentSucess data={paymentData} />
	}

	return <CheckOut />
}

const OrderPage = () => {
	return (
		<Suspense fallback={<main className="bg-[#f6f1e9] pb-0 pt-20 text-[#2f2416]" />}>
			<OrderPageContent />
		</Suspense>
	)
}

export default OrderPage
