import { Suspense } from "react"
import PromotorEventPaymentClientPage from "./clientPage"

const PromotorEventPaymentPage = () => {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#F4F1EC]" />}>
      <PromotorEventPaymentClientPage />
    </Suspense>
  )
}

export default PromotorEventPaymentPage
