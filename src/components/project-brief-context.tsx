"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { BookingDetails } from "@/lib/types";

type Prefill = Partial<BookingDetails> & { key: number };

type ContextValue = {
  prefill: Prefill | null;
  /** Push estimator output into the onboarding form and scroll to it. */
  applyPrefill: (details: Partial<BookingDetails>) => void;
};

const ProjectBriefContext = createContext<ContextValue | null>(null);

export function ProjectBriefProvider({ children }: { children: ReactNode }) {
  const [prefill, setPrefill] = useState<Prefill | null>(null);

  const applyPrefill = useCallback((details: Partial<BookingDetails>) => {
    // `key` changes on every call so repeat hand-offs still trigger the effect.
    setPrefill({ ...details, key: Date.now() });
    document
      .getElementById("book")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const value = useMemo(
    () => ({ prefill, applyPrefill }),
    [prefill, applyPrefill],
  );

  return (
    <ProjectBriefContext.Provider value={value}>
      {children}
    </ProjectBriefContext.Provider>
  );
}

export function useProjectBrief(): ContextValue {
  const context = useContext(ProjectBriefContext);
  if (!context) {
    throw new Error("useProjectBrief must be used inside ProjectBriefProvider");
  }
  return context;
}
