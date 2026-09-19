import FormField from "@/ui/FormField";
import { useForm } from "react-hook-form";
import { registerForFreeEvent } from "@/lib/api";

type RegistrationFormProps = {
  eventId?: string;
  title?: string;
  userId?: string | null;
};

type RegistrationFormValues = {
  fullName: string;
  email: string;
  contact: string;
};

export default function RegistrationForm({
  eventId,
  title = "Selected Event",
  userId = null,
}: RegistrationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegistrationFormValues>({
    defaultValues: { fullName: "", email: "", contact: "" },
  });

  const onSubmit = async (data: RegistrationFormValues) => {
    if (!eventId) {
      alert("Event ID is missing. Please open this page from an event card.");
      return;
    }

    try {
      await registerForFreeEvent({
        contact_number: data.contact,
        full_name: data.fullName,
        email: data.email,
        userId,
        eventId,
      });

      reset();
      alert("Successfully registered for the event.");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Registration failed. Please try again.";
      alert(message);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f2ea] px-4 py-10 text-[#1f1d1a] sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="overflow-hidden rounded-[28px] border-[1.5px] border-[#1f1d1a] bg-[#efe6de] p-6 shadow-[10px_10px_0_rgba(31,29,26,0.06)] sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <span className="rounded-full border border-[#1f1d1a] bg-[#f6f1e8] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#4f4a42]">
              Event Registration
            </span>
          </div>

          <div className="space-y-4">
            <div className="rounded-[22px] border-[1.5px] border-[#1f1d1a] bg-[#f8f5f1] p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#4f4a42]">
                Selected event
              </p>
              <h1 className="mt-3 text-3xl font-medium tracking-[-0.07em] text-[#1f1d1a] sm:text-4xl">
                {title}
              </h1>
            </div>

            <div className="rounded-[22px] border-[1.5px] border-[#1f1d1a] bg-[#e9e5f4] p-4 text-sm leading-6 text-[#4f4a42]">
              Secure your spot and keep your details ready for the host team.
            </div>
          </div>
        </aside>

        <section className="rounded-[28px] border-[1.5px] border-[#1f1d1a] bg-[#fffdf9] p-6 shadow-[12px_12px_0_rgba(31,29,26,0.06)] sm:p-8">
          <div className="mb-8">
            <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[#765c9b]">
              RSVP Form
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.06em] text-[#1f1d1a] sm:text-4xl">
              Register your spot
            </h2>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                field_name="Full Name"
                placeholder="Anne Hathaway"
                {...register("fullName", { required: "Full name is required" })}
                error={errors.fullName?.message}
              />
              
              <FormField
                field_name="Email"
                placeholder="You'll receive payment and event confirmation on this email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
                error={errors.email?.message}
              />
              <FormField
                field_name="Contact"
                placeholder="Enter your WhatsApp number"
                {...register("contact", {
                  required: "Contact number is required",
                  pattern: {
                    value: /^[0-9+\-\s]{7,15}$/,
                    message: "Enter a valid phone number",
                  },
                })}
                error={errors.contact?.message}
              />
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-[16px] border-[1.5px] border-[#1f1d1a] bg-[#1f1d1a] px-5 py-3 text-sm font-medium text-[#f6f1e8] shadow-[4px_4px_0_rgba(31,29,26,0.08)] transition hover:bg-[#2f2a27] disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit registration"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}