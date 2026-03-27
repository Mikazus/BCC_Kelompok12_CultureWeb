import api from "@/lib/api"

export type CheckoutTicketPayload = {
	holder_name: string
	identity_type: string
	identity_number: string
	holder_phone: string
	holder_email: string
	notes?: string
}

export type CheckoutPayload = {
	event_id: string
	tickets: CheckoutTicketPayload[]
}

export const submitCheckout = async (payload: CheckoutPayload, token: string) => {
	const response = await api.post("/checkout", payload, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	})

	return response.data
}
