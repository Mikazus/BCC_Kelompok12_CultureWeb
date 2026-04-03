"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import PromotorSidebar from "../../components/promotorSidebar"
import PromotorTopbar from "../../components/promotorTopbar"
import usePromotorAuth from "../../hooks/usePromotorAuth"
import { markEventAsPaid } from "@/Services/eventService"
import { getApiErrorMessage } from "@/lib/apiError"
import {
  clearPromotorEventPaymentContext,
  readPromotorEventPaymentContext,
  savePromotorEventPaymentContext,
} from "./paymentStorage"

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

const isPaymentCompleted = (searchParams: URLSearchParams) => {
  const statusCode = readSearchParam(searchParams, ["status_code", "statusCode"])
  const transactionStatus = readSearchParam(searchParams, ["transaction_status", "transactionStatus"]).toLowerCase()

  if (SUCCESS_STATUSES.has(transactionStatus)) {
    return true
  }

  return statusCode === "200" && !transactionStatus
}

export default function PromotorEventPaymentClientPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthResolved, token, profileName, profileRoleLabel } = usePromotorAuth()

  const [isFinalizing, setIsFinalizing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const context = useMemo(() => readPromotorEventPaymentContext(), [])

  const eventId =
    readSearchParam(searchParams, ["event_id", "eventId"]) ||
    (typeof context?.eventId === "string" ? context.eventId : "")
  const paymentUrl =
    readSearchParam(searchParams, ["payment_url", "paymentUrl", "redirect_url"]) ||
    (typeof context?.paymentUrl === "string" ? context.paymentUrl : "")
  const paymentToken =
    readSearchParam(searchParams, ["payment_token", "paymentToken", "snap_token"]) ||
    (typeof context?.paymentToken === "string" ? context.paymentToken : "")
  const eventTitle =
    readSearchParam(searchParams, ["event_title", "eventTitle"]) ||
    (typeof context?.eventTitle === "string" ? context.eventTitle : "Event Anda")

  const hasCompletedPayment = isPaymentCompleted(searchParams)

  useEffect(() => {
    if (!eventTitle) {
      return
    }

    savePromotorEventPaymentContext({
      eventId: eventId || undefined,
      paymentUrl: paymentUrl || undefined,
      paymentToken: paymentToken || undefined,
      eventTitle,
      createdAt: new Date().toISOString(),
    })
  }, [eventId, eventTitle, paymentToken, paymentUrl])

  useEffect(() => {
    if (!hasCompletedPayment || !token || !eventId) {
      return
    }

    let isMounted = true

    const finalizePayment = async () => {
      setIsFinalizing(true)
      setErrorMessage(null)

      try {
        await markEventAsPaid(token, eventId)

        if (!isMounted) {
          return
        }

        clearPromotorEventPaymentContext()
        setSuccessMessage("Pembayaran berhasil. Event sudah ditandai is_paid=true dan akan tampil di daftar event.")
      } catch (error) {
        if (isMounted) {
          setErrorMessage(getApiErrorMessage(error, "Pembayaran sukses, tetapi gagal update status event."))
        }
      } finally {
        if (isMounted) {
          setIsFinalizing(false)
        }
      }
    }

    void finalizePayment()

    return () => {
      isMounted = false
    }
  }, [eventId, hasCompletedPayment, token])

  const handlePayNow = () => {
    if (!paymentUrl) {
      setErrorMessage("Payment URL belum tersedia dari API create event.")
      return
    }

    window.location.assign(paymentUrl)
  }

  if (!isAuthResolved) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#A88648] text-[#433424]">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <PromotorSidebar active="event" />

        <div className="flex min-h-screen flex-1 flex-col bg-[#F4F1EC]">
          <PromotorTopbar profileName={profileName} profileRoleLabel={profileRoleLabel} />

          <main className="flex-1 px-5 pb-8 pt-7 md:px-8 lg:px-12 lg:pt-8">
            <h2 className="font-serif text-[42px] font-semibold leading-tight text-[#4A3827]">Pembayaran Publikasi Event</h2>
            <p className="mt-2 text-base text-[#6E5A43]">
              Event: <span className="font-semibold text-[#4A3827]">{eventTitle}</span>
            </p>

            {errorMessage ? (
              <p className="mt-4 rounded-xl border border-[#D46969] bg-[#FFF0F0] px-4 py-3 text-sm text-[#B74848]">{errorMessage}</p>
            ) : null}

            {successMessage ? (
              <p className="mt-4 rounded-xl border border-[#59B76D] bg-[#E8F8EC] px-4 py-3 text-sm text-[#2B9F47]">{successMessage}</p>
            ) : null}

            <section className="mt-6 rounded-2xl border border-[#9B845D] bg-[#F4F1EC] p-6">
              <div className="space-y-3 text-sm text-[#5A4A38]">
                <p>Event ID: {eventId || "-"}</p>
                <p>Payment Token: {paymentToken || "-"}</p>
                <p>Status callback: {hasCompletedPayment ? "Sukses" : "Menunggu pembayaran"}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={isFinalizing || hasCompletedPayment}
                  className="rounded-full bg-[#A88648] px-6 py-3 text-sm font-medium text-[#FFF8EA] transition hover:bg-[#94743C] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {hasCompletedPayment ? "Pembayaran Terkonfirmasi" : "Bayar Sekarang"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/promotor/event")}
                  className="rounded-full border border-[#B08F59] px-6 py-3 text-sm font-medium text-[#B08F59] transition hover:bg-[#ECE4D5]"
                >
                  Kembali ke Form Event
                </button>

                <Link
                  href="/promotor/dashboard"
                  className="rounded-full border border-[#B08F59] px-6 py-3 text-sm font-medium text-[#B08F59] transition hover:bg-[#ECE4D5]"
                >
                  Lihat Dashboard
                </Link>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
