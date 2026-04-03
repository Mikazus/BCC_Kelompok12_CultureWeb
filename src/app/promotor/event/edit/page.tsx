import { Suspense } from "react";
import PromotorEditEventPageContent from "../../dashboard/components/edit";

const PromotorEditEventPage = () => {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#F4F1EC]" />}>
      <PromotorEditEventPageContent />
    </Suspense>
  );
};

export default PromotorEditEventPage;
