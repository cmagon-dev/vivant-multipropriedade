"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTOR = [
  "main h1",
  "main h2",
  "main h3",
  "main h4",
  "main h5",
  "main h6",
  "main p",
  "main li",
  "main blockquote",
  "main label",
  "main small",
].join(", ");

function shouldSkipElement(el: Element): boolean {
  return Boolean(
    el.closest("[data-no-reveal]") ||
      el.closest("nav") ||
      el.closest("header") ||
      el.closest("aside") ||
      el.closest("footer") ||
      el.closest("[role='dialog']"),
  );
}

export function GlobalScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    const observeTargets = () => {
      const elements = Array.from(document.querySelectorAll(REVEAL_SELECTOR));
      elements.forEach((el) => {
        if (shouldSkipElement(el)) return;
        el.classList.add("reveal-on-scroll", "reveal-single");
        observer.observe(el);
      });
    };

    // Espera a troca de rota/hidratação terminar para evitar estados intermediários.
    const rafId = window.requestAnimationFrame(() => {
      observeTargets();
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
