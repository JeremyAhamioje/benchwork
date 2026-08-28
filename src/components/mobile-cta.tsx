"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { quickWhatsappLink } from "@/lib/booking";

/**
 * Sticky conversion bar for phones. Appears once the hero has scrolled away and
 * hides again over the booking form, where the real CTAs already are.
 */
export function MobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.8;
      const form = document.getElementById("book");
      const atForm = form
        ? form.getBoundingClientRect().top < window.innerHeight * 0.85
        : false;
      setVisible(past && !atForm);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: 72 }}
          animate={{ y: 0 }}
          exit={{ y: 72 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 backdrop-blur-xl lg:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="grid grid-cols-2 gap-2 px-4 py-3">
            <a
              href="#book"
              className="flex h-12 items-center justify-center bg-signal font-mono text-[0.72rem] uppercase tracking-[0.14em] text-white"
            >
              Book a Project
            </a>
            <a
              href={quickWhatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center border border-line font-mono text-[0.72rem] uppercase tracking-[0.14em] text-bone"
            >
              WhatsApp
            </a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
