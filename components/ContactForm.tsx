"use client";

import { useState, useTransition } from "react";
import { submitContactMessage } from "@/app/api/actions/portfolio/actions";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setStatus("idle");
    setError("");
    startTransition(async () => {
      const result = await submitContactMessage(formData);
      if (result.ok) {
        setStatus("success");
        const form = document.getElementById("contact-form") as HTMLFormElement | null;
        form?.reset();
      } else {
        setStatus("error");
        setError(result.error);
      }
    });
  }

  return (
    <form id="contact-form" action={onSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <input id="contact-name" name="name" type="text" required autoComplete="name" />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input id="contact-email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-2 block text-sm font-medium">
          Message
        </label>
        <textarea id="contact-message" name="message" rows={4} required />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60 dark:text-slate-950"
      >
        {pending ? "Sending..." : "Send Message"}
      </button>
      {status === "success" ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-300" role="status">
          Thanks — your message was sent. I&apos;ll get back to you soon.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-rose-700 dark:text-rose-300" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}