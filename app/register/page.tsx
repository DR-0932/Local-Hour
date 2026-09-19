"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RegistrationForm from "@/components/events/registrationForm";


function RegisterPageContent() {
  const searchParams = useSearchParams();

  const eventId = searchParams.get("eventId") ?? undefined;
  const title = searchParams.get("title") ?? "Selected Event";
  const userId = null;

  return <RegistrationForm eventId={eventId} title={title} userId={userId} />;
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegistrationForm title="Selected Event" userId={null} />}>
      <RegisterPageContent />
    </Suspense>
  );
}
