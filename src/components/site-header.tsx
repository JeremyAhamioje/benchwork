"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { CtaLink } from "@/components/ui/cta";
import { quickWhatsappLink } from "@/lib/booking";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site-config";

const navItems = [
  { href: "#disciplines", label: "Disciplines" },
  { href: "#build", label: "What we build" },
  { href: "#process", label: "Process" },
  { href: "#estimate", label: "Estimator" },
  { href: "#work", label: "Samples" },
  { href: "#about", label: "About" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "border-b border-line bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[86rem] items-center justify-between px-5 md:h-18 md:px-8">
        <a
          href="#top"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <Mark />
          <span className="display text-lg tracking-[-0.02em] md:text-xl">
            {siteConfig.name}
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-bone"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Wrapped rather than given `hidden sm:inline-flex`: the button's own
              display utility has equal specificity and wins the cascade. */}
          <span className="hidden sm:block">
            <CtaLink href="#book" variant="primary">
              Book a Project
            </CtaLink>
          </span>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center border border-line text-bone transition-colors hover:border-bone lg:hidden"
          >
            <span className="relative block h-3 w-4.5">
              <span
                className={cn(
                  "absolute left-0 block h-px w-full bg-current transition-all duration-300",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 bottom-0 block h-px w-full bg-current transition-all duration-300",
                  open ? "bottom-1.5 -rotate-45" : "",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="sheet"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-line bg-ink lg:hidden"
          >
            <nav className="flex flex-col px-5 py-2">
              {navItems.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-b border-line-soft py-4 text-lg"
                >
                  <span>{item.label}</span>
                  <span className="tech">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </a>
              ))}
            </nav>
            <div className="grid grid-cols-2 gap-3 px-5 pb-6 pt-3">
              <CtaLink href="#book" onClick={() => setOpen(false)}>
                Book a Project
              </CtaLink>
              <CtaLink
                href={quickWhatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
              >
                WhatsApp
              </CtaLink>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

/** Brand mark. Decorative — the wordmark beside it carries the name. */
function Mark() {
  return (
    <Image
      src="/gear-mark.png"
      alt=""
      width={266}
      height={265}
      priority
      className="h-8 w-8 shrink-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90"
    />
  );
}
