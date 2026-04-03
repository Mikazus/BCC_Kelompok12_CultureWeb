import api from "@/lib/api"

const DEFAULT_WALLET_ENDPOINT = "/me/wallet"

const isObject = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null

const firstNumber = (item: Record<string, unknown>, keys: string[]) => {
	for (const key of keys) {
		const value = item[key]
		if (typeof value === "number" && Number.isFinite(value)) {
			return value
		}

		if (typeof value === "string" && value.trim()) {
			const parsed = Number(value.replace(/[^\d.]/g, ""))
			if (Number.isFinite(parsed)) {
				return parsed
			}
		}
	}

	return null
}

const extractWalletBalance = (payload: unknown) => {
	if (!isObject(payload)) {
		return 0
	}

	const topLevel = firstNumber(payload, [
		"balance",
		"amount",
		"wallet",
		"total",
		"total_balance",
		"wallet_balance",
	])

	if (topLevel !== null) {
		return Math.max(0, topLevel)
	}

	if (isObject(payload.data)) {
		const nested = payload.data as Record<string, unknown>
		const nestedBalance = firstNumber(nested, [
			"balance",
			"amount",
			"wallet",
			"total",
			"total_balance",
			"wallet_balance",
		])

		if (nestedBalance !== null) {
			return Math.max(0, nestedBalance)
		}
	}

	return 0
}

export const getMyWalletBalance = async (token: string) => {
	const endpoint = process.env.NEXT_PUBLIC_WALLET_ENDPOINT?.trim() || DEFAULT_WALLET_ENDPOINT

	const response = await api.get<unknown>(endpoint, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	return extractWalletBalance(response.data)
}
