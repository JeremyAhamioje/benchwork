"use client";

import { useRef, useState, type ChangeEvent } from "react";

import { useProjectBrief } from "@/components/project-brief-context";
import { CtaButton, CtaLink } from "@/components/ui/cta";
import { Reveal } from "@/components/ui/reveal";
import { Container, SectionHeader } from "@/components/ui/section";
import { emailLink, whatsappLink } from "@/lib/booking";
import { cn } from "@/lib/cn";
import { buildFilters, complexityOptions, serviceOptions } from "@/lib/content";
import {
  contactConfigured,
  intakeStatusCopy,
  resolveIntakeStatus,
  siteConfig,
} from "@/lib/site-config";
import type { BookingDetails } from "@/lib/types";

const emptyDetails: BookingDetails = {
  fullName: "",
  phone: "",
  email: "",
  matricNumber: "",
  university: "",
  department: "",
  projectTitle: "",
  projectDescription: "",
  projectType: "",
  complexity: complexityOptions[0],
  deadline: "",
  services: [],
  budget: "",
};

type Errors = Partial<Record<keyof BookingDetails, string>>;

const inputClass =
  "h-12 w-full border border-line bg-ink px-4 text-sm text-bone placeholder:text-faint transition-colors hover:border-line focus:border-signal focus:outline-none";

export function Booking() {
  const { prefill } = useProjectBrief();
  const [details, setDetails] = useState<BookingDetails>(emptyDetails);
  const [errors, setErrors] = useState<Errors>({});
  const [appliedKey, setAppliedKey] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const intake = intakeStatusCopy[resolveIntakeStatus()];
  const prefilled = appliedKey !== null;

  /* Estimator hand-off, merged during render rather than in an effect so the
     form never paints a frame of stale values. Only defined values are copied
     across, so a partial estimate cannot wipe something already typed. */
  if (prefill && prefill.key !== appliedKey) {
    setAppliedKey(prefill.key);
    setDetails((current) => {
      const next = { ...current };
      for (const [field, value] of Object.entries(prefill)) {
        if (field === "key" || value === undefined || value === "") continue;
        Object.assign(next, { [field]: value });
      }
      return next;
    });
  }

  const update =
    (field: keyof BookingDetails) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { value } = event.target;
      setDetails((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
    };

  const toggleService = (service: string) => {
    setDetails((current) => ({
      ...current,
      services: current.services.includes(service)
        ? current.services.filter((item) => item !== service)
        : [...current.services, service],
    }));
    setErrors((current) => ({ ...current, services: undefined }));
  };

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setDetails((current) => ({ ...current, fileName: file?.name }));
  };

  const validate = () => {
    const next: Errors = {};

    if (!details.fullName.trim()) next.fullName = "We need a name to reply to.";
    if (!details.phone.trim() && !details.email.trim()) {
      next.phone = "Add a phone number or an email so we can reach you.";
    }
    if (!details.projectTitle.trim()) {
      next.projectTitle = "What is the project called?";
    }
    if (details.projectDescription.trim().length < 20) {
      next.projectDescription =
        "A couple of lines about what it should do, please.";
    }
    if (details.services.length === 0) {
      next.services = "Pick at least one thing you need.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const send = (channel: "whatsapp" | "email") => {
    if (!validate()) {
      document
        .getElementById("book-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (channel === "whatsapp") {
      window.open(whatsappLink(details), "_blank", "noopener,noreferrer");
    } else {
      window.location.href = emailLink(details);
    }
  };

  return (
    <section id="book" className="relative scroll-mt-24 py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-graphite/60"
      />

      <Container className="relative">
        <SectionHeader
          index="07"
          eyebrow="Start a project"
          title="Ready to get your project moving?"
          lead="We take projects on a first-come, first-served basis so we can give every build the attention it deserves."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* -------------------------------- form -------------------------------- */}
          <div id="book-form" className="scroll-mt-24 lg:col-span-8">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                send("whatsapp");
              }}
              className="border border-line bg-steel"
              noValidate
            >
              {prefilled ? (
                <p className="border-b border-line bg-signal/[0.07] px-5 py-3.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-bone sm:px-7">
                  Filled in from your estimate — edit anything that is wrong.
                </p>
              ) : null}

              {/* ---------------------------- student ---------------------------- */}
              <FormBlock index="01" title="Student information">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Full name"
                    name="fullName"
                    required
                    error={errors.fullName}
                  >
                    <input
                      id="bw-fullName"
                      name="fullName"
                      value={details.fullName}
                      onChange={update("fullName")}
                      autoComplete="name"
                      placeholder="Your name"
                      aria-invalid={Boolean(errors.fullName)}
                      className={inputClass}
                    />
                  </Field>

                  <Field
                    label="Phone number"
                    name="phone"
                    error={errors.phone}
                    hint="WhatsApp preferred"
                  >
                    <input
                      id="bw-phone"
                      name="phone"
                      type="tel"
                      value={details.phone}
                      onChange={update("phone")}
                      autoComplete="tel"
                      placeholder="080…"
                      aria-invalid={Boolean(errors.phone)}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Email" name="email">
                    <input
                      id="bw-email"
                      name="email"
                      type="email"
                      value={details.email}
                      onChange={update("email")}
                      autoComplete="email"
                      placeholder="you@university.edu"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Matric number" name="matricNumber">
                    <input
                      id="bw-matricNumber"
                      name="matricNumber"
                      value={details.matricNumber}
                      onChange={update("matricNumber")}
                      placeholder="Optional"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="University" name="university">
                    <input
                      id="bw-university"
                      name="university"
                      value={details.university}
                      onChange={update("university")}
                      autoComplete="organization"
                      placeholder="Institution"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Department" name="department">
                    <input
                      id="bw-department"
                      name="department"
                      value={details.department}
                      onChange={update("department")}
                      placeholder="e.g. Mechanical Engineering"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </FormBlock>

              {/* ---------------------------- project ---------------------------- */}
              <FormBlock index="02" title="Project information">
                <div className="grid gap-5">
                  <Field
                    label="Project title"
                    name="projectTitle"
                    required
                    error={errors.projectTitle}
                  >
                    <input
                      id="bw-projectTitle"
                      name="projectTitle"
                      value={details.projectTitle}
                      onChange={update("projectTitle")}
                      placeholder="e.g. Motorised cassava grating machine"
                      aria-invalid={Boolean(errors.projectTitle)}
                      className={inputClass}
                    />
                  </Field>

                  <Field
                    label="Project description"
                    name="projectDescription"
                    required
                    error={errors.projectDescription}
                    hint="What it is, what it should do, and any requirement your supervisor insisted on."
                  >
                    <textarea
                      id="bw-projectDescription"
                      name="projectDescription"
                      value={details.projectDescription}
                      onChange={update("projectDescription")}
                      rows={5}
                      maxLength={4000}
                      placeholder="Describe the project in your own words…"
                      aria-invalid={Boolean(errors.projectDescription)}
                      className="w-full resize-y border border-line bg-ink p-4 text-sm leading-relaxed text-bone placeholder:text-faint transition-colors focus:border-signal focus:outline-none"
                    />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-3">
                    <Field label="Project type" name="projectType">
                      <SelectShell>
                        <select
                          id="bw-projectType"
                          name="projectType"
                          value={details.projectType}
                          onChange={update("projectType")}
                          className={cn(inputClass, "bare-select cursor-pointer pr-10")}
                        >
                          <option value="">Select type</option>
                          {buildFilters
                            .filter((option) => option !== "All")
                            .map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                        </select>
                      </SelectShell>
                    </Field>

                    <Field label="Complexity" name="complexity">
                      <SelectShell>
                        <select
                          id="bw-complexity"
                          name="complexity"
                          value={details.complexity}
                          onChange={update("complexity")}
                          className={cn(inputClass, "bare-select cursor-pointer pr-10")}
                        >
                          {complexityOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </SelectShell>
                    </Field>

                    <Field label="Deadline" name="deadline">
                      <input
                        id="bw-deadline"
                        name="deadline"
                        type="date"
                        value={details.deadline}
                        onChange={update("deadline")}
                        className={cn(inputClass, "[color-scheme:dark]")}
                      />
                    </Field>
                  </div>

                  <Field
                    label="Rough budget"
                    name="budget"
                    hint="Optional — it helps us scope realistically."
                  >
                    <input
                      id="bw-budget"
                      name="budget"
                      value={details.budget}
                      onChange={update("budget")}
                      placeholder={`e.g. ${siteConfig.currencySymbol}150,000`}
                      className={inputClass}
                    />
                  </Field>
                </div>
              </FormBlock>

              {/* ---------------------------- services --------------------------- */}
              <FormBlock
                index="03"
                title="What do you need?"
                note="Select everything that applies."
              >
                {errors.services ? (
                  <p role="alert" className="mb-4 text-sm text-signal">
                    {errors.services}
                  </p>
                ) : null}

                <div
                  role="group"
                  aria-label="Services required"
                  className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
                >
                  {serviceOptions.map((service) => {
                    const selected = details.services.includes(service);
                    return (
                      <button
                        key={service}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleService(service)}
                        className={cn(
                          "group relative flex items-center gap-3 px-4 py-4 text-left transition-colors duration-300",
                          selected
                            ? "bg-signal/[0.12] text-bone"
                            : "bg-steel text-muted hover:bg-steel-2 hover:text-bone",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center border text-[0.6rem] transition-colors",
                            selected
                              ? "border-signal bg-signal text-white"
                              : "border-line group-hover:border-muted",
                          )}
                        >
                          {selected ? "✓" : ""}
                        </span>
                        <span className="text-sm leading-snug">{service}</span>
                      </button>
                    );
                  })}
                </div>

                {/* ------------------------- brief upload ------------------------ */}
                <div className="mt-6 flex flex-col gap-3 border border-dashed border-line bg-ink px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold tracking-tight">
                      Project brief
                    </p>
                    <p className="tech mt-1.5 normal-case tracking-[0.06em]">
                      {details.fileName
                        ? `${details.fileName} — attach it in the chat when it opens.`
                        : "PDF or DOCX. We note the file name and you attach it in WhatsApp or email."}
                    </p>
                  </div>
                  <CtaButton
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="shrink-0"
                  >
                    {details.fileName ? "Change file" : "Choose file"}
                  </CtaButton>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    className="sr-only"
                    onChange={onFile}
                  />
                </div>
              </FormBlock>

              {/* ------------------------------ submit --------------------------- */}
              <div className="flex flex-col gap-5 border-t border-line bg-ink px-5 py-7 sm:px-7">
                {!contactConfigured ? (
                  <p className="border border-signal/40 bg-signal/[0.07] px-4 py-3 text-sm leading-relaxed text-bone">
                    Setup notice: contact routes are still placeholders. Set
                    NEXT_PUBLIC_WHATSAPP_NUMBER and NEXT_PUBLIC_PROJECT_EMAIL
                    before going live.
                  </p>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <CtaButton type="submit" size="lg">
                    Book My Project
                  </CtaButton>
                  <CtaButton
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => send("email")}
                  >
                    Send by Email
                  </CtaButton>
                </div>

                <p className="text-xs leading-relaxed text-faint">
                  Your details are not stored on this site — the button opens
                  WhatsApp or your email client with the message already written.
                </p>
              </div>
            </form>
          </div>

          {/* ------------------------------- sidebar ------------------------------ */}
          <div className="flex flex-col gap-5 lg:col-span-4">
            <Reveal className="border border-line bg-steel p-6">
              <p className="tech">Current intake</p>
              <div className="mt-4 flex items-center gap-2.5">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full animate-pulse-dot",
                    intake.dot,
                  )}
                  aria-hidden
                />
                <p className="font-mono text-sm uppercase tracking-[0.14em] text-bone">
                  {intake.label}
                </p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {intake.note}
              </p>

              {siteConfig.intake.nextSlot ? (
                <div className="mt-5 border-t border-line-soft pt-5">
                  <p className="tech">Next available build slot</p>
                  <p className="mt-2 text-base font-semibold tracking-tight">
                    {siteConfig.intake.nextSlot}
                  </p>
                </div>
              ) : null}
            </Reveal>

            {/* --------------------- pay to accelerate (disabled) ---------------- */}
            <Reveal
              delay={0.05}
              className="hatch relative border border-line bg-steel/60 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="tech">Priority</p>
                  <p className="mt-3 text-lg font-bold tracking-tight">
                    Need it faster?
                  </p>
                </div>
                <span className="shrink-0 border border-line px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">
                  Soon
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted">
                Priority project acceleration will let students move ahead in the
                queue when capacity allows.
              </p>

              <button
                type="button"
                disabled
                aria-disabled="true"
                className="mt-6 flex h-11 w-full cursor-not-allowed items-center justify-center border border-line bg-ink font-mono text-[0.72rem] uppercase tracking-[0.16em] text-faint opacity-60"
              >
                Coming Soon
              </button>

              <p className="mt-3 text-xs leading-relaxed text-faint">
                Priority acceleration is currently unavailable.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="border border-line bg-steel p-6">
              <p className="tech">Prefer to just message?</p>
              <div className="mt-4 flex flex-col gap-3">
                <CtaLink
                  href={whatsappLink(details)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                >
                  Open WhatsApp
                </CtaLink>
                <CtaLink href={`mailto:${siteConfig.email}`} variant="outline">
                  {siteConfig.email}
                </CtaLink>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function FormBlock({
  index,
  title,
  note,
  children,
}: {
  index: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-b border-line px-5 py-7 sm:px-7">
      <legend className="sr-only">{title}</legend>
      <div className="mb-6 flex items-center gap-4">
        <span className="tech text-signal">{index}</span>
        <span className="h-px w-6 bg-line" aria-hidden />
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-bone">
          {title}
        </p>
        {note ? <span className="tech ml-auto hidden sm:block">{note}</span> : null}
      </div>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  name,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={`bw-${name}`}
        className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted"
      >
        {label}
        {required ? <span className="text-signal"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-signal">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs leading-relaxed text-faint">{hint}</p>
      ) : null}
    </div>
  );
}

/** Wraps a native select so it can carry our own marker instead of the OS one. */
function SelectShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-signal"
      >
        ▼
      </span>
    </div>
  );
}
